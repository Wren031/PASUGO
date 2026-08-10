import { Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { cn } from '@/utils/cn';
import { colors } from '@/constants/theme';

export interface StepperStep {
  key: string;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

interface TripStatusStepperProps {
  steps: StepperStep[];
  currentIndex: number;
  failed?: boolean;
  className?: string;
}

export function TripStatusStepper({ steps, currentIndex, failed = false, className }: TripStatusStepperProps) {
  return (
    <View className={cn('flex-row items-center', className)}>
      {steps.map((step, index) => {
        const done = index < currentIndex;
        const current = index === currentIndex;
        return (
          <View key={step.key} className="flex-1">
            <View className="flex-row items-center">
              {index > 0 ? (
                <View className={cn('h-0.5 flex-1', done || current ? 'bg-primary' : 'bg-line')} />
              ) : (
                <View className="w-2" />
              )}
              <View
                className={cn(
                  'h-8 w-8 items-center justify-center rounded-full border-2',
                  done && 'border-primary bg-primary',
                  current && 'border-primary bg-primary-soft',
                  !done && !current && 'border-line bg-white',
                  failed && index === steps.length - 1 && 'border-danger bg-danger-soft',
                )}
              >
                <MaterialCommunityIcons
                  name={step.icon}
                  size={15}
                  color={done ? '#FFFFFF' : current ? colors.primary : '#CBD5E1'}
                />
              </View>
              {index === steps.length - 1 ? <View className="w-2" /> : <View className="h-0.5 flex-1 bg-line" />}
            </View>
            <Text
              className={cn(
                'mt-1.5 text-center text-[10px] leading-3',
                current || done ? 'font-bold text-ink' : 'text-ink-muted',
              )}
            >
              {step.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
