import React, { type ReactNode } from 'react';
import {
  Text,
  View,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from '@/components/buttons/Button';
import { cn } from '@/utils/cn';

export interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'primary' | 'danger' | 'warning';
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

  // Dynamic icon styling per tone
  const badgeStyles = {
    primary: {
      bg: 'bg-orange-50 border-orange-100',
      iconColor: '#F97316',
      defaultIcon: 'help-circle-outline' as const,
    },
    danger: {
      bg: 'bg-red-50 border-red-100',
      iconColor: '#EF4444',
      defaultIcon: 'alert-circle-outline' as const,
    },
    warning: {
      bg: 'bg-amber-50 border-amber-100',
      iconColor: '#F59E0B',
      defaultIcon: 'alert-outline' as const,
    },
  }[tone];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={loading ? () => {} : onCancel}
    >
      {/* Backdrop */}
      <Pressable
        className="flex-1 justify-end bg-black/40"
        onPress={loading ? undefined : onCancel}
      >
        {/* Drawer Sheet Container */}
        <TouchableWithoutFeedback>
          <View className="w-full rounded-t-3xl bg-white px-5 pb-8 pt-3">
            {/* Top Grab Handle Pill */}
            <View className="mb-4 h-1 w-10 self-center rounded-full bg-slate-200" />

            {/* Header Content */}
            <View className="flex-row items-center gap-3">
              <View
                className={cn(
                  'h-10 w-10 items-center justify-center rounded-xl border',
                  badgeStyles.bg,
                )}
              >
                {icon ?? (
                  <MaterialCommunityIcons
                    name={badgeStyles.defaultIcon}
                    size={20}
                    color={badgeStyles.iconColor}
                  />
                )}
              </View>

              <View className="flex-1">
                <Text className="text-base font-bold text-slate-900">
                  {title}
                </Text>
                {message ? (
                  <Text className="mt-0.5 text-xs leading-4 text-slate-500">
                    {message}
                  </Text>
                ) : null}
              </View>
            </View>

            {/* Side-by-Side Action Buttons */}
            <View className="mt-5 flex-row items-center gap-2.5">
              <View className="flex-1">
                <Button
                  label={cancelLabel}
                  variant="outline"
                  size="sm"
                  disabled={loading}
                  fullWidth
                  onPress={onCancel}
                />
              </View>

              <View className="flex-1">
                <Button
                  label={confirmLabel}
                  variant={isDanger ? 'danger' : 'primary'}
                  size="sm"
                  loading={loading}
                  fullWidth
                  onPress={onConfirm}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Pressable>
    </Modal>
  );
}