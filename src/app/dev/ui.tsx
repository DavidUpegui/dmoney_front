import { Redirect, useRouter } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { BalanceSummary } from '@/components/balance-summary';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Chip } from '@/components/chip';
import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { FormSection } from '@/components/form-section';
import { Header, HeaderAction } from '@/components/header';
import { Icon, type IconName } from '@/components/icon';
import { ListGroup } from '@/components/list-group';
import { MovementRow } from '@/components/movement-row';
import { Screen } from '@/components/screen';
import { SegmentedControl } from '@/components/segmented-control';
import { Spinner } from '@/components/spinner';
import { Tag } from '@/components/tag';
import { TextInput } from '@/components/text-input';
import { ThemedText, type ThemedTextTone, type ThemedTextVariant } from '@/components/themed-text';
import { useColors } from '@/lib/theme';
import { radius, shadows, spacing, type ColorTokens } from '@/theme';
import type { Movement, MovementType } from '@/types';

const TYPE_SPECIMENS: {
  variant: ThemedTextVariant;
  sample: string;
  tone?: ThemedTextTone;
}[] = [
  { variant: 'title', sample: 'Movements' },
  { variant: 'headline', sample: 'Section title' },
  { variant: 'rowTitle', sample: 'Groceries' },
  { variant: 'body', sample: 'Lunch with the team after the review.' },
  { variant: 'subhead', sample: 'Secondary copy for hints and labels.' },
  { variant: 'caption', sample: 'Food & Dining · Groceries' },
  { variant: 'label', sample: 'Net cash flow' },
  { variant: 'button', sample: 'Save movement' },
  { variant: 'chip', sample: 'Selected chip' },
  { variant: 'numeric', sample: '+$4.250.000', tone: 'income' },
  { variant: 'numericLarge', sample: '$3.428.500' },
  { variant: 'numericHero', sample: '$42.500' },
];

const ICON_NAMES: IconName[] = [
  'tag',
  'search',
  'filter',
  'calendar',
  'pencil',
  'plus',
  'close',
  'check',
  'chevron',
  'wallet',
  'list',
  'grid',
  'settings',
];

const COLOR_TOKENS: (keyof ColorTokens)[] = [
  'canvas',
  'surface',
  'raised',
  'sunken',
  'ink',
  'inkSecondary',
  'inkFaint',
  'hairline',
  'primary',
  'primaryPressed',
  'primarySurface',
  'onPrimary',
  'income',
  'outcome',
  'transfer',
  'danger',
  'placeholder',
];

const TYPE_OPTIONS = [
  { value: 'OUTCOME' as const, label: 'Outcome' },
  { value: 'INCOME' as const, label: 'Income' },
  { value: 'TRANSFER' as const, label: 'Transfer' },
];

const TYPE_TONE = {
  OUTCOME: 'outcome',
  INCOME: 'income',
  TRANSFER: 'transfer',
} as const;

const CHIP_OPTIONS = [
  { value: 'work', label: 'Work' },
  { value: 'home', label: 'Home' },
  { value: 'travel', label: 'Travel' },
];

const SALARY: Movement = {
  movementId: 'demo-1',
  categoryId: 'demo-c1',
  subcategoryId: 'demo-s1',
  amount: 4250000,
  type: 'INCOME',
  description: 'Monthly invoice',
  date: '2026-11-01',
  tagIds: ['demo-t1'],
};

const GROCERIES: Movement = {
  movementId: 'demo-2',
  categoryId: 'demo-c2',
  subcategoryId: 'demo-s2',
  amount: 42500,
  type: 'OUTCOME',
  description: 'Weekly shop',
  date: '2026-11-01',
  tagIds: ['demo-t2'],
};

const TAXI: Movement = {
  movementId: 'demo-3',
  categoryId: 'demo-c3',
  subcategoryId: 'demo-s3',
  amount: 38000,
  type: 'OUTCOME',
  description: 'Airport',
  date: '2026-11-01',
  tagIds: [],
};

export default function UiKitRoute() {
  if (!__DEV__) {
    return <Redirect href="/" />;
  }

  return <UiKitScreen />;
}

function UiKitScreen() {
  const router = useRouter();
  const colors = useColors();
  const [type, setType] = useState<MovementType>('OUTCOME');
  const [selected, setSelected] = useState<string[]>(['work']);

  return (
    <Screen
      scroll
      header={
        <Header
          title="UI kit"
          action={
            <HeaderAction
              label="Close"
              accessibilityLabel="Close UI kit"
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            />
          }
        />
      }
    >
      <View style={styles.page}>
        <Section
          title="Palette"
          hint="Petrol / Stone. Dark mode follows the system setting."
        >
          <View style={styles.swatches}>
            {COLOR_TOKENS.map((token) => (
              <View key={token} style={styles.swatch}>
                <View
                  style={[
                    styles.swatchColor,
                    { backgroundColor: colors[token], borderColor: colors.hairline },
                  ]}
                />
                <ThemedText variant="caption" tone="secondary" numberOfLines={1}>
                  {token}
                </ThemedText>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Typography" hint="Manrope for text, Plus Jakarta for display.">
          <View style={styles.typeList}>
            {TYPE_SPECIMENS.map((item) => (
              <View key={item.variant} style={styles.typeRow}>
                <ThemedText variant="caption" tone="faint">
                  {item.variant}
                </ThemedText>
                <ThemedText variant={item.variant} tone={item.tone}>
                  {item.sample}
                </ThemedText>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Buttons">
          <View style={styles.wrap}>
            <Button title="Save movement" onPress={() => {}} />
            <Button title="Secondary" variant="secondary" onPress={() => {}} />
            <Button title="Ghost" variant="ghost" onPress={() => {}} />
            <Button title="Delete" variant="destructive" onPress={() => {}} />
          </View>
          <View style={[styles.wrap, styles.alignCenter]}>
            <Button title="Small" size="sm" onPress={() => {}} />
            <Button title="Medium" size="md" onPress={() => {}} />
            <Button title="Large" size="lg" onPress={() => {}} />
          </View>
          <View style={[styles.wrap, styles.alignCenter]}>
            <Button title="Disabled" disabled onPress={() => {}} />
            <Button title="Loading" loading onPress={() => {}} />
          </View>
        </Section>

        <Section title="Inputs">
          <FormSection>
            <TextInput label="Description" placeholder="Lunch with team" />
            <TextInput
              label="Amount"
              placeholder="0"
              keyboardType="decimal-pad"
              error="Amount is required"
            />
            <TextInput
              label="Notes"
              placeholder="Anything worth remembering"
              multiline
            />
          </FormSection>
        </Section>

        <Section title="Chips and tags">
          <View style={styles.wrap}>
            {CHIP_OPTIONS.map((option) => {
              const isSelected = selected.includes(option.value);
              return (
                <Chip
                  key={option.value}
                  label={option.label}
                  selected={isSelected}
                  onPress={() =>
                    setSelected((current) =>
                      current.includes(option.value)
                        ? current.filter((value) => value !== option.value)
                        : [...current, option.value],
                    )
                  }
                />
              );
            })}
          </View>
          <View style={styles.wrap}>
            <Tag label="weekly" />
            <Tag label="home" />
            <Tag label="work" />
          </View>
          <View style={styles.wrap}>
            <Tag label="work" size="md" onRemove={() => {}} />
            <Tag label="team" size="md" onRemove={() => {}} />
          </View>
        </Section>

        <Section title="Segmented control">
          <SegmentedControl
            accessibilityLabel="Type"
            options={TYPE_OPTIONS}
            value={type}
            onChange={setType}
            toneForValue={(value) => TYPE_TONE[value]}
            showDot
          />
        </Section>

        <Section title="List group" hint="Inset rows, dividers, no per-row shadow.">
          <ListGroup
            title="Today"
            headerTrailing={<BalanceSummary amount={-80500} />}
          >
            <MovementRow
              movement={SALARY}
              categoryName="Income"
              subcategoryName="Tech consultancy"
              tagNames={['work', 'main']}
            />
            <MovementRow
              movement={GROCERIES}
              categoryName="Food & Dining"
              subcategoryName="Groceries"
              tagNames={['weekly', 'home']}
              divider
            />
            <MovementRow
              movement={TAXI}
              categoryName="Transport"
              subcategoryName="Airport"
              tagNames={[]}
              divider
            />
          </ListGroup>
        </Section>

        <Section title="Amount hero" hint="The input amount stays ink; color is for recorded money.">
          <Card style={styles.amountCard}>
            <ThemedText variant="label" tone="secondary" style={styles.center}>
              Amount
            </ThemedText>
            <View style={styles.amountLine}>
              <ThemedText variant="amountSymbol" tone="secondary">
                $
              </ThemedText>
              <ThemedText variant="numericHero">42.500</ThemedText>
              <ThemedText variant="label" tone="faint">
                COP
              </ThemedText>
            </View>
          </Card>
          <Button title="Save movement" size="lg" onPress={() => {}} />
        </Section>

        <Section title="States">
          <View style={styles.states}>
            <Card style={styles.stateCard}>
              <Spinner size="small" />
              <ThemedText variant="caption" tone="secondary">
                Loading
              </ThemedText>
            </Card>
            <Card style={styles.stateCard}>
              <Icon name="tag" size={24} tone="faint" />
              <ThemedText variant="caption" tone="secondary">
                Empty
              </ThemedText>
            </Card>
            <Card style={styles.stateCard}>
              <Icon name="close" size={24} tone="danger" />
              <ThemedText variant="caption" tone="secondary">
                Error
              </ThemedText>
            </Card>
          </View>
          <View style={styles.stateBlock}>
            <EmptyState message="No movements yet" actionLabel="Add movement" onAction={() => {}} />
          </View>
          <View style={styles.stateBlock}>
            <ErrorState message="The server did not answer. Try again." onRetry={() => {}} />
          </View>
        </Section>

        <Section title="Icons">
          <View style={styles.icons}>
            {ICON_NAMES.map((name) => (
              <View key={name} style={styles.iconItem}>
                <Icon name={name} size={20} tone="secondary" />
                <ThemedText variant="caption" tone="faint">
                  {name}
                </ThemedText>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Shape and elevation">
          <View style={styles.wrap}>
            {(['xs', 'sm', 'md', 'lg', 'xl', 'full'] as const).map((token) => (
              <View key={token} style={styles.shape}>
                <View
                  style={[
                    styles.shapeBox,
                    {
                      borderRadius: radius[token],
                      backgroundColor: colors.surface,
                      borderColor: colors.hairline,
                    },
                  ]}
                />
                <ThemedText variant="caption" tone="faint">
                  {token}
                </ThemedText>
              </View>
            ))}
          </View>
          <View style={styles.wrap}>
            {(['card', 'raised', 'overlay'] as const).map((token) => (
              <View
                key={token}
                style={[
                  styles.shadowBox,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.hairline,
                    boxShadow: shadows[token],
                  },
                ]}
              >
                <ThemedText variant="caption" tone="faint">
                  {token}
                </ThemedText>
              </View>
            ))}
          </View>
        </Section>
      </View>
    </Screen>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <ThemedText variant="label" tone="secondary">
          {title}
        </ThemedText>
        {hint != null ? (
          <ThemedText variant="caption" tone="faint">
            {hint}
          </ThemedText>
        ) : null}
      </View>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingVertical: spacing.lg,
    gap: spacing.xxl,
  },
  section: {
    gap: spacing.sm,
  },
  sectionHeader: {
    gap: 2,
    paddingHorizontal: spacing.xs,
  },
  sectionBody: {
    gap: spacing.md,
  },
  swatches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  swatch: {
    width: 100,
    gap: 4,
  },
  swatchColor: {
    height: 48,
    borderRadius: radius.md,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
  },
  typeList: {
    gap: spacing.md,
  },
  typeRow: {
    gap: 2,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.sm,
  },
  alignCenter: {
    alignItems: 'center',
  },
  amountCard: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing.lg,
  },
  center: {
    textAlign: 'center',
  },
  amountLine: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  states: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  stateCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: 96,
  },
  stateBlock: {
    height: 210,
  },
  icons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  iconItem: {
    width: 48,
    alignItems: 'center',
    gap: 4,
  },
  shape: {
    alignItems: 'center',
    gap: 4,
  },
  shapeBox: {
    width: 48,
    height: 48,
    borderWidth: StyleSheet.hairlineWidth,
  },
  shadowBox: {
    width: 104,
    height: 64,
    borderRadius: radius.xl,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
