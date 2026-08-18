import { useRef } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { cn } from '@/utils/cn';
import React from 'react';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  error?: string;
}

export function OtpInput({ value, onChange, length = 6, error }: OtpInputProps) {
  const inputRef = useRef<TextInput>(null);
  const digits = Array.from({ length }, (_, i) => value[i] ?? '');

  return (
    <View className="gap-2">
      <View className="relative">
        <View className="flex-row justify-between">
          {digits.map((digit, index) => (
            <View
              key={index}
              className={cn(
                'h-[56px] w-[48px] items-center justify-center rounded-2xl border bg-white',
                error ? 'border-danger' : index === value.length ? 'border-primary' : 'border-line',
              )}
            >
              <Text className="text-[22px] font-bold text-ink">{digit}</Text>
            </View>
          ))}
        </View>
        <Pressable
          className="absolute inset-0"
          onPress={() => inputRef.current?.focus()}
          accessibilityLabel="Enter verification code"
        >
          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={(text) => onChange(text.replace(/\D/g, '').slice(0, length))}
            keyboardType="number-pad"
            maxLength={length}
            autoFocus
            caretHidden
            className="h-full w-full opacity-0"
          />
        </Pressable>
      </View>
      {error ? <Text className="px-1 text-[12.5px] leading-4 text-danger">{error}</Text> : null}
    </View>
  );
}