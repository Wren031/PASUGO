import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Modal } from './Modal';
import { Button } from '@/components/buttons/Button';
import { cn } from '@/utils/cn';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'primary' | 'danger';
  loading?: boolean;
  icon?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'primary',
  loading = false,
  icon,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const isDanger = tone === 'danger';

  return (
    <Modal visible={visible} onClose={onCancel}>
      <View className="items-center">
        <View
          className={cn(
            'h-11 w-11 items-center justify-center rounded-full',
            isDanger ? 'bg-danger-soft' : 'bg-primary-soft',
          )}
        >
          {icon ??
            (isDanger ? (
              <MaterialCommunityIcons name="alert-outline" size={22} color="#EF4444" />
            ) : (
              <MaterialCommunityIcons name="help-circle-outline" size={22} color="#F97316" />
            ))}
        </View>
        <Text className="mt-3 text-center text-[17px] font-bold text-ink">{title}</Text>
        {message ? (
          <Text className="mt-1 text-center text-[13px] leading-5 text-ink-secondary">{message}</Text>
        ) : null}
      </View>
      <View className="mt-4 gap-3">
        <Button label={cancelLabel} variant="outline" fullWidth onPress={onCancel} />
        <Button
          label={confirmLabel}
          variant={isDanger ? 'danger' : 'primary'}
          loading={loading}
          fullWidth
          onPress={onConfirm}
        />
      </View>
    </Modal>
  );
}