import { Colors } from '@/constants/theme';
import { useAppSettings } from '@/contexts/app-settings';

export function useTheme() {
  const { resolvedScheme } = useAppSettings();
  return Colors[resolvedScheme];
}
