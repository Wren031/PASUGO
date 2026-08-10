import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LocationPickerModal } from '@/components/modals/LocationPickerModal';
import { cn } from '@/utils/cn';
import type { Landmark } from '@/constants/maps';
import type { SavedPlace } from '@/types/passenger';

export type PickedLocation = Landmark | SavedPlace;

interface LocationInputProps {
  label?: string;
  value: string | null;
  placeholder?: string;
  iconColor?: string;
  error?: string;
  savedPlaces?: SavedPlace[];
  onSelect: (location: PickedLocation) => void;
}

export function LocationInput({
  label,
  value,
  placeholder = 'Where to?',
  iconColor = '#94A3B8',
  error,
  savedPlaces = [],
  onSelect,
}: LocationInputProps) {
  const [open, setOpen] = useState(false);

  return (
    <View className="gap-2">
      {label ? <Text className="px-1 text-[14px] font-semibold text-ink">{label}</Text> : null}
      <Pressable
        onPress={() => setOpen(true)}
        className={cn(
          'min-h-[52px] flex-row items-center gap-3 rounded-2xl border bg-white px-4',
          error ? 'border-danger' : 'border-line',
        )}
      >
        <Feather name="map-pin" size={20} color={iconColor} />
        <View className="flex-1">
          {value ? (
            <>
              <Text className="text-[16px] font-semibold text-ink">{value}</Text>
              <Text className="text-[11.5px] text-ink-muted">{value === 'Current location' ? '' : 'Tap to change'}</Text>
            </>
          ) : (
            <Text className="text-[16px] text-ink-muted">{placeholder}</Text>
          )}
        </View>
        <Feather name="chevron-down" size={18} color="#94A3B8" />
      </Pressable>
      {error ? <Text className="px-1 text-[12.5px] leading-4 text-danger">{error}</Text> : null}
      <LocationPickerModal
        visible={open}
        onClose={() => setOpen(false)}
        onSelect={(location) => {
          onSelect(location);
          setOpen(false);
        }}
        savedPlaces={savedPlaces}
      />
    </View>
  );
}
