import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { cn } from '@/utils/cn';

export interface TabBarProps extends BottomTabBarProps {
  icons: Record<string, keyof typeof Feather.glyphMap>;
  labels?: Record<string, string>;
  centerAction?: { icon: keyof typeof Feather.glyphMap; onPress: () => void; label?: string };
}

export function TabBar({ state, descriptors, navigation, icons, labels, centerAction }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const splitIndex = Math.ceil(state.routes.length / 2);
  const leftRoutes = state.routes.slice(0, splitIndex);
  const rightRoutes = state.routes.slice(splitIndex);

  const renderTab = (route: (typeof state.routes)[number], index: number) => {
    const { options } = descriptors[route.key];
    const isFocused = state.index === index;
    const icon = icons[route.name];
    const label = labels?.[route.name] ?? options.title ?? route.name;

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });
      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name, route.params);
      }
    };

    const onLongPress = () => {
      navigation.emit({ type: 'tabLongPress', target: route.key });
    };

    return (
      <Pressable
        key={route.key}
        onPress={onPress}
        onLongPress={onLongPress}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        className={cn(
          'h-11 flex-1 flex-row items-center justify-center gap-1.5 rounded-2xl active:opacity-80',
          isFocused ? 'bg-orange-500' : 'bg-transparent',
        )}
      >
        <Feather name={icon} size={16} color={isFocused ? '#FFFFFF' : '#94A3B8'} />
        <Text
          className={cn(
            'text-[11px] font-semibold',
            isFocused ? 'text-white' : 'text-slate-400',
          )}
        >
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingTop: centerAction ? 26 : 10,
        paddingBottom: insets.bottom + 10,
        backgroundColor: 'transparent',
      }}
    >
      <View
        className={cn(
          'flex-row items-center gap-1.5 rounded-[26px] border border-slate-200/80 bg-white px-2.5 py-2',
          centerAction && 'mt-1.5',
        )}
        style={{
          shadowColor: '#0F172A',
          shadowOpacity: 0.12,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 6 },
          elevation: 12,
        }}
      >
        {leftRoutes.map((route, index) => renderTab(route, index))}

        {centerAction ? (
          <Pressable
            onPress={centerAction.onPress}
            accessibilityRole="button"
            accessibilityLabel={centerAction.label ?? 'Scan QR'}
            className="-mt-10 h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-orange-500 active:bg-orange-600"
            style={{
              shadowColor: '#EA580C',
              shadowOpacity: 0.4,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 6 },
              elevation: 10,
            }}
          >
            <Feather name={centerAction.icon} size={24} color="#FFFFFF" />
          </Pressable>
        ) : null}

        {rightRoutes.map((route, index) => renderTab(route, index + splitIndex))}
      </View>
    </View>
  );
}
