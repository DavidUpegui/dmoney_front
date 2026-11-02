#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const specsDir = path.join(root, 'specs');
const resultsDir = path.join(root, '.requirements');
const resultsFile = path.join(resultsDir, 'jest.json');

const requirementPattern = /^-\s+\*\*([A-Z]{2,6}\d{2})\*\*/;
const blockPattern = /^#{1,6}\s+([A-Z]{2,6}\d{2})\b/;
const validatedPattern = /^-\s+\[([ xX])\]\s+\*\*Validado\*\*/;
const uncheckedPattern = /^-\s+\[\s\]\s+/;

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

function relative(file) {
  return path.relative(root, file).split(path.sep).join('/');
}

fs.mkdirSync(resultsDir, { recursive: true });

let jestFailed = false;
try {
  execFileSync(
    'npx',
    ['jest', '--runInBand', '--json', '--outputFile', resultsFile, '--silent'],
    { stdio: 'inherit' },
  );
} catch {
  jestFailed = true;
}

let report = { testResults: [] };
if (fs.existsSync(resultsFile)) {
  report = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));
}

const testsById = new Map();
for (const suite of report.testResults ?? []) {
  for (const assertion of suite.assertionResults ?? []) {
    const match = assertion.title.match(/^([a-z]{2,6}\d{2})[_\s-]/);
    if (!match) continue;

    const id = match[1].toUpperCase();
    const status = assertion.status === 'passed'
      ? 'pass'
      : assertion.status === 'failed'
        ? 'fail'
        : 'skip';

    if (!testsById.has(id)) testsById.set(id, []);
    testsById.get(id).push({ name: assertion.title, status });
  }
}

const specFiles = walk(specsDir)
  .filter((file) => {
    const base = path.basename(file);
    return (base === 'spec.md' || base === 'SYSTEM.md')
      && !file.includes(`${path.sep}_template${path.sep}`);
  })
  .sort();

const errors = [];
const legacy = [];
const requirements = new Map();
const blocks = new Map();

for (const specFile of specFiles) {
  const base = path.basename(specFile);
  const ids = [];

  for (const line of fs.readFileSync(specFile, 'utf8').split(/\r?\n/)) {
    const match = line.match(requirementPattern);
    if (match && !ids.includes(match[1])) ids.push(match[1]);
  }

  if (ids.length === 0) {
    legacy.push(relative(specFile));
    continue;
  }

  const tasksFile = base === 'SYSTEM.md'
    ? path.join(specsDir, 'tasks-system.md')
    : path.join(path.dirname(specFile), 'tasks.md');

  for (const id of ids) {
    if (requirements.has(id)) {
      errors.push(`duplicate requirement ${id} in ${relative(specFile)} and ${requirements.get(id)}`);
    }
    requirements.set(id, relative(specFile));
  }

  if (!fs.existsSync(tasksFile)) {
    errors.push(`${relative(specFile)} has ${ids.length} requirement(s) but ${relative(tasksFile)} is missing`);
    continue;
  }

  const found = new Map();
  let current = null;

  for (const line of fs.readFileSync(tasksFile, 'utf8').split(/\r?\n/)) {
    const header = line.match(blockPattern);
    const validated = line.match(validatedPattern);
    const unchecked = line.match(uncheckedPattern);

    if (header) {
      current = { id: header[1], validated: false, unchecked: 0 };
      found.set(current.id, current);
    } else if (current) {
      if (validated) {
        current.validated = validated[1].toLowerCase() === 'x';
      } else if (unchecked) {
        current.unchecked += 1;
      }
    }
  }

  for (const id of ids) {
    if (!found.has(id)) {
      errors.push(`${relative(tasksFile)}: missing block for ${id}`);
    } else {
      blocks.set(id, { ...found.get(id), file: relative(tasksFile) });
    }
  }

  for (const id of found.keys()) {
    if (!ids.includes(id)) {
      errors.push(`${relative(tasksFile)}: block ${id} is not a requirement in ${relative(specFile)}`);
    }
  }
}

for (const [id, block] of blocks) {
  if (!block.validated) continue;

  const tests = testsById.get(id) ?? [];

  if (block.unchecked > 0) {
    errors.push(`${block.file} (${id}): Validado is checked but ${block.unchecked} sub-item(s) are open`);
  }
  if (tests.length === 0) {
    errors.push(`${block.file} (${id}): Validado is checked but no test title starts with ${id.toLowerCase()}_`);
  } else if (tests.some((test) => test.status !== 'pass')) {
    const bad = tests
      .filter((test) => test.status !== 'pass')
      .map((test) => `${test.name} (${test.status})`);
    errors.push(`${block.file} (${id}): Validado is checked but these tests are not green: ${bad.join(', ')}`);
  }
}

for (const [id, tests] of testsById) {
  if (!requirements.has(id)) {
    errors.push(`test '${tests[0].name}' references ${id}, which is not a requirement in specs/`);
  }
}

const capabilitiesFile = path.join(specsDir, 'CAPABILITIES.md');
const capabilities = [];

if (fs.existsSync(capabilitiesFile)) {
  for (const line of fs.readFileSync(capabilitiesFile, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|')) continue;

    const cells = trimmed.split('|').map((cell) => cell.trim());
    if (cells.length < 6) continue;

    const capability = cells[1];
    if (!capability || capability === 'Capability' || /^:?-+:?$/.test(capability)) continue;

    capabilities.push({
      capability,
      context: cells[2].replaceAll('`', '').trim(),
      spec: cells[3].replaceAll('`', '').trim(),
      state: cells[4].replaceAll('`', '').trim(),
    });
  }
} else {
  console.warn('specs/CAPABILITIES.md is missing; capability coverage was not checked.');
}

for (const row of capabilities) {
  if (!row.spec || row.spec === '—' || row.spec === '-') continue;

  const specPath = path.join(root, row.spec);
  if (!fs.existsSync(specPath)) {
    errors.push(`specs/CAPABILITIES.md: ${row.capability} points to ${row.spec}, which does not exist`);
    continue;
  }

  if (row.state === 'modeled') {
    const hasSpec = walk(specPath).some((file) => path.basename(file) === 'spec.md');
    if (!hasSpec) {
      errors.push(`specs/CAPABILITIES.md: ${row.capability} is 'modeled' but ${row.spec} has no spec.md`);
    }
  }
}

for (const specFile of specFiles) {
  if (path.basename(specFile) === 'SYSTEM.md') continue;

  const registered = capabilities.some((row) => {
    if (!row.spec || row.spec === '—' || row.spec === '-') return false;
    return specFile.startsWith(path.join(root, row.spec));
  });

  if (!registered) {
    errors.push(`${relative(specFile)} is not listed in specs/CAPABILITIES.md`);
  }
}

const validated = [...requirements.keys()].filter((id) => blocks.get(id)?.validated).length;

if (capabilities.length > 0) {
  console.log('');
  console.log('Capability coverage');
  console.log('-'.repeat(64));
  for (const row of capabilities.sort((a, b) => a.capability.localeCompare(b.capability))) {
    const spec = row.spec && row.spec !== '—' ? row.spec : '—';
    console.log(`  ${row.capability.padEnd(12)} ${row.state.padEnd(9)} ${spec}`);
  }
  const missing = capabilities.filter((row) => row.state === 'missing');
  if (missing.length > 0) {
    console.log(`  Missing specs: ${missing.map((row) => row.capability).join(', ')}`);
  }
  console.log('-'.repeat(64));
}

console.log('');
console.log(`Requirement coverage (${validated}/${requirements.size} validated)`);
console.log('-'.repeat(64));
for (const id of [...requirements.keys()].sort()) {
  const tests = testsById.get(id) ?? [];
  const passed = tests.filter((test) => test.status === 'pass').length;
  const state = blocks.get(id)?.validated ? 'validado' : 'pendiente';
  console.log(`  ${id.padEnd(8)} ${String(tests.length).padStart(2)} tests  ${String(passed).padStart(2)} pass   ${state}`);
}
console.log('-'.repeat(64));

if (legacy.length > 0) {
  console.log(`Legacy specs without requirement IDs (skipped): ${legacy.join(', ')}`);
}

if (jestFailed) {
  errors.push('jest reported failing tests or could not run');
}

if (errors.length > 0) {
  console.error('');
  console.error('Requirement check failed:');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}
