import { Modal as RNModal, Pressable, View } from 'react-native';
import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  animationType?: 'fade' | 'slide' | 'none';
}

export function Modal({ visible, onClose, children, className, animationType = 'fade' }: ModalProps) {
  return (
    <RNModal visible={visible} transparent animationType={animationType} onRequestClose={onClose} statusBarTranslucent>
      <Pressable className="flex-1 items-center justify-center bg-black/50 px-6" onPress={onClose}>
        <Pressable onPress={(event) => event.stopPropagation()}>
          <View className={cn('w-full rounded-2xl bg-white p-5', className)}>{children}</View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
