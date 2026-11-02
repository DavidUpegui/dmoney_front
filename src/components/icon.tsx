import type { LucideIcon } from 'lucide-react-native';
import ArrowDown from 'lucide-react-native/icons/arrow-down';
import ArrowUp from 'lucide-react-native/icons/arrow-up';
import Calendar from 'lucide-react-native/icons/calendar';
import Check from 'lucide-react-native/icons/check';
import ChevronRight from 'lucide-react-native/icons/chevron-right';
import Circle from 'lucide-react-native/icons/circle';
import LayoutGrid from 'lucide-react-native/icons/layout-grid';
import List from 'lucide-react-native/icons/list';
import Pencil from 'lucide-react-native/icons/pencil';
import Plus from 'lucide-react-native/icons/plus';
import Search from 'lucide-react-native/icons/search';
import Settings from 'lucide-react-native/icons/settings';
import SlidersHorizontal from 'lucide-react-native/icons/sliders-horizontal';
import Tag from 'lucide-react-native/icons/tag';
import Wallet from 'lucide-react-native/icons/wallet';
import X from 'lucide-react-native/icons/x';

import { useColors } from '@/lib/theme';
import { type ColorTokens } from '@/theme';

const ICONS = {
  tag: Tag,
  category: Tag,
  wallet: Wallet,
  calendar: Calendar,
  pencil: Pencil,
  plus: Plus,
  close: X,
  check: Check,
  chevron: ChevronRight,
  chevronRight: ChevronRight,
  search: Search,
  filter: SlidersHorizontal,
  list: List,
  grid: LayoutGrid,
  settings: Settings,
  income: ArrowDown,
  outcome: ArrowUp,
  transfer: Circle,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

export type IconTone =
  | 'default'
  | 'secondary'
  | 'faint'
  | 'primary'
  | 'onPrimary'
  | 'income'
  | 'outcome'
  | 'transfer'
  | 'danger';

const TONE: Record<IconTone, keyof ColorTokens> = {
  default: 'ink',
  secondary: 'inkSecondary',
  faint: 'inkFaint',
  primary: 'primary',
  onPrimary: 'onPrimary',
  income: 'income',
  outcome: 'outcome',
  transfer: 'transfer',
  danger: 'danger',
};

export type IconSize = 14 | 16 | 18 | 20 | 24 | 40;

type IconProps = {
  name: IconName;
  size?: IconSize;
  tone?: IconTone;
  strokeWidth?: number;
};

export function Icon({ name, size = 20, tone = 'secondary', strokeWidth = 2 }: IconProps) {
  const colors = useColors();
  const Component = ICONS[name];

  return <Component size={size} color={colors[TONE[tone]]} strokeWidth={strokeWidth} />;
}
