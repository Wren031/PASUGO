import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Modal } from './Modal';
import { Input } from '@/components/inputs/Input';
import { LANDMARKS } from '@/constants/maps';
import { haversineKm } from '@/utils/geo';
import type { Landmark } from '@/constants/maps';
import type { PickedLocation } from '@/components/inputs/LocationInput';
import type { SavedPlace } from '@/types/passenger';
import { cn } from '@/utils/cn';

interface LocationPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (location: PickedLocation) => void;
  savedPlaces?: SavedPlace[];
}

export function LocationPickerModal({ visible, onClose, onSelect, savedPlaces = [] }: LocationPickerModalProps) {
  const [query, setQuery] = useState('');
  const [locating, setLocating] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const all: PickedLocation[] = [...savedPlaces, ...LANDMARKS];
    if (!q) return all;
    return all.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        (l.address && l.address.toLowerCase().includes(q)),
    );
  }, [query, savedPlaces]);

  const useCurrentLocation = async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const nearest = LANDMARKS.reduce((best, landmark) => {
        const distance = haversineKm(position.coords, landmark.coordinates);
        return distance < best.distance ? { landmark, distance } : best;
      }, { landmark: LANDMARKS[0], distance: Number.POSITIVE_INFINITY });
      onSelect(nearest.landmark);
    } catch {
      // Location unavailable - keep the sheet open
    } finally {
      setLocating(false);
    }
  };

  return (
    <Modal visible={visible} onClose={onClose} animationType="slide" className="max-h-[80%] p-0">
      <View className="border-b border-line p-4 pb-3">
        <Text className="text-lg font-bold text-ink">Choose a location</Text>
      </View>
      <View className="p-4 pb-2">
        <Input
          value={query}
          onChangeText={setQuery}
          placeholder="Search landmarks and saved places"
          autoFocus
          leftIcon={<Feather name="search" size={18} color="#94A3B8" />}
        />
        <Pressable
          onPress={useCurrentLocation}
          className="mt-3 flex-row items-center gap-3 rounded-xl border border-primary bg-primary-soft px-3.5 py-3"
        >
          <View className="h-9 w-9 items-center justify-center rounded-full bg-primary">
            {locating ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Feather name="navigation" size={16} color="#FFFFFF" />
            )}
          </View>
          <View className="flex-1">
            <Text className="text-[14px] font-bold text-primary-dark">Use current location</Text>
            <Text className="text-[11px] text-primary">Detect your GPS position</Text>
          </View>
        </Pressable>
      </View>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        className="max-h-[320px]"
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <Pressable
            onPress={() => onSelect(item)}
            className="flex-row items-center gap-3 border-b border-line px-4 py-3.5 active:bg-slate-50"
          >
            <View className={cn('h-9 w-9 items-center justify-center rounded-full', 'label' in item ? 'bg-primary-soft' : 'bg-surface-muted')}>
              {'label' in item ? (
                <Text className="text-[10px] font-bold text-primary-dark">{item.label}</Text>
              ) : (
                <Feather name="map-pin" size={16} color="#64748B" />
              )}
            </View>
            <View className="flex-1">
              <Text className="text-[15px] font-semibold text-ink">{item.name}</Text>
              <Text className="mt-0.5 text-[12px] text-ink-muted">{item.address}</Text>
            </View>
          </Pressable>
        )}
      />
    </Modal>
  );
}
