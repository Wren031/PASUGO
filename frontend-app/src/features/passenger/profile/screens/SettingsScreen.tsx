import { useState } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Screen } from '@/components/screen/Screen';
import { ScreenHeader } from '@/components/screen/ScreenHeader';
import { cn } from '@/utils/cn';

export function SettingsScreen() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [rideUpdates, setRideUpdates] = useState(true);
  const [promos, setPromos] = useState(false);
  const [biometrics, setBiometrics] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [language, setLanguage] = useState('English');

  return (
    <Screen>
      <ScreenHeader title="Settings" />
      <ScrollView className="flex-1 px-4 pb-8" showsVerticalScrollIndicator={false}>
        <Text className="mt-4 mb-2.5 text-[13px] font-bold uppercase tracking-wide text-ink-muted">Notifications</Text>
        <View className="rounded-2xl border border-line bg-white">
          <ToggleRow icon="bell" label="Push notifications" value={pushEnabled} onChange={setPushEnabled} first />
          <ToggleRow icon="navigation" label="Ride updates" value={rideUpdates} onChange={setRideUpdates} />
          <ToggleRow icon="percent" label="Promos and offers" value={promos} onChange={setPromos} last />
        </View>

        <Text className="mt-6 mb-2.5 text-[13px] font-bold uppercase tracking-wide text-ink-muted">Security</Text>
        <View className="rounded-2xl border border-line bg-white">
          <ToggleRow icon="lock" label="Biometric unlock" value={biometrics} onChange={setBiometrics} first />
          <ChoiceRow icon="lock" label="Change password" value="••••••••" onPress={() => {}} last />
        </View>

        <Text className="mt-6 mb-2.5 text-[13px] font-bold uppercase tracking-wide text-ink-muted">Appearance</Text>
        <View className="rounded-2xl border border-line bg-white p-4">
          <Text className="mb-3 text-[13px] font-semibold text-ink">Theme</Text>
          <View className="flex-row gap-2.5">
            {(['light', 'dark', 'system'] as const).map((option) => (
              <Pressable
                key={option}
                onPress={() => setTheme(option)}
                className={cn(
                  'flex-1 min-h-[52px] items-center justify-center rounded-2xl border py-2',
                  theme === option ? 'border-primary bg-orange-50' : 'border-line bg-white',
                )}
              >
                <Feather
                  name={option === 'light' ? 'sun' : option === 'dark' ? 'moon' : 'smartphone'}
                  size={17}
                  color={theme === option ? '#F97316' : '#64748B'}
                />
                <Text className={cn('mt-1 text-[12px] font-semibold capitalize', theme === option ? 'text-primary-dark' : 'text-ink-secondary')}>
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Text className="mt-6 mb-2.5 text-[13px] font-bold uppercase tracking-wide text-ink-muted">Language</Text>
        <View className="rounded-2xl border border-line bg-white">
          <ChoiceRow icon="globe" label="Language" value={language} onPress={() => {}} last />
        </View>

        <View className="mt-6 rounded-2xl border border-line bg-white">
          <ChoiceRow icon="file-text" label="Terms of service" onPress={() => {}} first />
          <ChoiceRow icon="shield" label="Privacy policy" onPress={() => {}} />
          <ChoiceRow icon="help-circle" label="Help center" onPress={() => {}} last />
        </View>

        <Text className="mt-6 text-center text-[11px] text-ink-muted">HatodGo v1.0.0</Text>
      </ScrollView>
    </Screen>
  );
}

function ToggleRow({
  icon,
  label,
  value,
  onChange,
  first,
  last,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  first?: boolean;
  last?: boolean;
}) {
  return (
    <View className={cn('flex-row items-center gap-3 px-4 py-3.5', !first && 'border-t border-line', last && 'pb-4')}>
      <Feather name={icon} size={17} color="#64748B" />
      <Text className="flex-1 text-[14px] font-semibold text-ink">{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: '#CBD5E1', true: '#FDBA74' }}
        thumbColor={value ? '#F97316' : '#F1F5F9'}
      />
    </View>
  );
}

function ChoiceRow({ icon, label, value, onPress, first, last }: { icon: keyof typeof Feather.glyphMap; label: string; value?: string; onPress: () => void; first?: boolean; last?: boolean }) {
  return (
    <Pressable onPress={onPress} className={cn('flex-row items-center gap-3 px-4 py-4 active:bg-slate-50', !first && 'border-t border-line', last && 'rounded-b-2xl')}>
      <Feather name={icon} size={17} color="#64748B" />
      <Text className="flex-1 text-[14px] font-semibold text-ink">{label}</Text>
      {value ? <Text className="text-[13px] text-ink-muted">{value}</Text> : null}
      <Feather name="chevron-right" size={17} color="#CBD5E1" />
    </Pressable>
  );
}
