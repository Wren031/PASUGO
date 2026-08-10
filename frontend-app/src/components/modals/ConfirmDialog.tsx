import { Text, View } from 'react-native';
import { Modal } from './Modal';
import { Button } from '@/components/buttons/Button';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'primary' | 'danger';
  loading?: boolean;
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
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal visible={visible} onClose={onCancel}>
      <View className="items-center">
        <Text className="text-center text-lg font-bold text-ink">{title}</Text>
        {message ? <Text className="mt-2 text-center text-sm leading-5 text-ink-secondary">{message}</Text> : null}
      </View>
      <View className="mt-6 flex-row gap-3">
        <Button label={cancelLabel} variant="outline" onPress={onCancel} className="flex-1" />
        <Button
          label={confirmLabel}
          variant={tone === 'danger' ? 'danger' : 'primary'}
          loading={loading}
          onPress={onConfirm}
          className="flex-1"
        />
      </View>
    </Modal>
  );
}
