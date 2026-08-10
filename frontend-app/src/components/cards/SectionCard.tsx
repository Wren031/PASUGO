import { Text, View } from 'react-native';
import type { ReactNode } from 'react';
import { Card } from './Card';
import { cn } from '@/utils/cn';

interface SectionCardProps {
  title?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SectionCard({ title, right, children, className }: SectionCardProps) {
  return (
    <Card className={cn('p-0', className)}>
      {title ? (
        <View className="flex-row items-center justify-between border-b border-line px-4 py-3.5">
          <Text className="text-[16px] font-bold text-ink">{title}</Text>
          {right}
        </View>
      ) : null}
      <View>{children}</View>
    </Card>
  );
}
