import { Modal as RNModal, Pressable, View } from 'react-native';
import type { ReactNode } from 'react';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '@/utils/cn';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  dismissible?: boolean;
}

export function BottomSheet({ visible, onClose, children, className, dismissible = true }: BottomSheetProps) {
  const insets = useSafeAreaInsets();
  return (
    <RNModal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <View className="flex-1 justify-end">
        <Animated.View entering={FadeIn.duration(180)} exiting={FadeOut.duration(150)} className="absolute inset-0">
          <Pressable className="flex-1 bg-black/50" onPress={dismissible ? onClose : undefined} />
        </Animated.View>
        <Animated.View
          entering={SlideInDown.springify().damping(18).stiffness(160)}
          exiting={SlideOutDown.duration(180)}
          className={cn(
            'rounded-t-3xl border-t border-line bg-white px-5',
            className,
          )}
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        >
          <View className="mb-3 mt-3 h-1 w-10 self-center rounded-full bg-slate-200" />
          {children}
        </Animated.View>
      </View>
    </RNModal>
  );
}
