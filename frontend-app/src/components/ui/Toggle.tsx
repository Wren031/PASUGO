import { Switch } from 'react-native';
import { colors } from '@/constants/theme';

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export function Toggle({ value, onValueChange, disabled }: ToggleProps) {
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{ false: '#CBD5E1', true: colors.primary }}
      thumbColor="#FFFFFF"
      ios_backgroundColor="#CBD5E1"
    />
  );
}
