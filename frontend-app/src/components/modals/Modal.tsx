import { Modal as RNModal, Pressable, View } from 'react-native';
import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  animationType?: 'fade' | 'slide' | 'none';
  padded?: boolean;
}

export function Modal({ visible, onClose, children, className, animationType = 'fade', padded = true }: ModalProps) {
  return (
    <RNModal visible={visible} transparent animationType={animationType} onRequestClose={onClose} statusBarTranslucent>
      <Pressable className="flex-1 items-center justify-center bg-black/50 px-4 sm:px-6" onPress={onClose}>
        <Pressable onPress={(event) => event.stopPropagation()} className="w-full max-w-lg overflow-hidden">
          <View
            className={cn(
              'overflow-hidden rounded-2xl bg-white',
              padded && 'p-4',
              className,
            )}
          >
            {children}
          </View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
