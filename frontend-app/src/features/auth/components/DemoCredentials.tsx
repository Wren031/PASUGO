import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { authService } from '../services/auth-service';
import React from 'react';

interface DemoCredentialsProps {
  onFill: (phone: string, password: string) => void;
}

export function DemoCredentials({ onFill }: DemoCredentialsProps) {
  const [credentials, setCredentials] = useState<{ passenger: string; driver: string; password: string } | null>(null);

  useEffect(() => {
    authService.getDemoCredentials().then(setCredentials).catch(() => undefined);
  }, []);

  if (!credentials) return null;

  return (
    <View className="mt-7 gap-2.5 rounded-2xl border border-dashed border-line bg-white p-4">
      <Text className="text-[11px] font-bold uppercase tracking-wide text-ink-muted">Demo accounts</Text>
      <Pressable
        onPress={() => onFill(credentials.passenger, credentials.password)}
        className="rounded-xl bg-surface-muted px-3.5 py-3 active:bg-slate-200"
      >
        <Text className="text-[13px] text-ink-secondary">
          Passenger: <Text className="font-bold text-ink">{credentials.passenger}</Text>
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onFill(credentials.driver, credentials.password)}
        className="rounded-xl bg-surface-muted px-3.5 py-3 active:bg-slate-200"
      >
        <Text className="text-[13px] text-ink-secondary">
          Driver: <Text className="font-bold text-ink">{credentials.driver}</Text>
        </Text>
      </Pressable>
    </View>
  );
}
