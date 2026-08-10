import { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Screen } from '@/components/screen/Screen';
import { ScreenHeader } from '@/components/screen/ScreenHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/modals/ConfirmDialog';
import { useAddSavedPlace, useDeleteSavedPlace, useSavedPlaces } from '../hooks/useSavedPlaces';
import { useAuthStore, selectUser } from '@/store/auth-store';
import { showToast } from '@/store/toast-store';
import { cn } from '@/utils/cn';
import { LANDMARKS } from '@/constants/maps';
import type { SavedPlace } from '@/types/passenger';

type Navigation = ReturnType<typeof useNavigation>;

const placeTypes: { id: SavedPlace['label']; icon: keyof typeof Feather.glyphMap }[] = [
  { id: 'Home', icon: 'home' },
  { id: 'Work', icon: 'briefcase' },
  { id: 'Other', icon: 'map-pin' },
];

export function SavedPlacesScreen() {
  const navigation = useNavigation<Navigation>();
  const user = useAuthStore(selectUser);
  const userId = user?.id ?? '';
  const { data: places, isLoading } = useSavedPlaces(userId);
  const addPlace = useAddSavedPlace(userId);
  const deletePlace = useDeleteSavedPlace(userId);

  const [deleteTarget, setDeleteTarget] = useState<SavedPlace | null>(null);
  const [adding, setAdding] = useState(false);

  const handleAdd = (type: SavedPlace['label']) => {
    const landmark = LANDMARKS[Math.floor(Math.random() * LANDMARKS.length)];
    addPlace.mutate(
      {
        label: type,
        name: type === 'Home' ? 'Home' : type === 'Work' ? 'Work' : landmark.name,
        address: landmark.address,
        coordinates: landmark.coordinates,
      },
      {
        onSuccess: () => {
          showToast('success', 'Place saved');
          setAdding(false);
        },
        onError: (error: Error) => {
          showToast('error', 'Save failed', error.message);
          setAdding(false);
        },
      },
    );
  };

  return (
    <Screen>
      <ScreenHeader title="Saved places" />
      <FlatList
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 32 }}
        data={places ?? []}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View className="mt-4 flex-row gap-2.5">
            {placeTypes.map((type) => (
              <Pressable
                key={type.id}
                disabled={adding}
                onPress={() => {
                  setAdding(true);
                  handleAdd(type.id);
                }}
                className={cn(
                  'flex-1 min-h-[52px] flex-row items-center justify-center gap-2 rounded-2xl border py-2',
                  adding ? 'border-line bg-slate-100' : 'border-line bg-white active:bg-orange-50',
                )}
              >
                <Feather name={type.icon} size={16} color="#F97316" />
                <Text className="text-[13px] font-semibold text-ink">Add {type.id.toLowerCase()}</Text>
              </Pressable>
            ))}
          </View>
        }
        renderItem={({ item, index }) => (
          <View
            className={cn(
              'flex-row items-center gap-3 rounded-2xl border border-line bg-white p-4',
              index === 0 ? 'mt-4' : 'mt-2.5',
            )}
          >
            <View className="h-10 w-10 items-center justify-center rounded-full bg-orange-100">
              <Feather
                name={placeTypes.find((t) => t.id === item.label)?.icon ?? 'map-pin'}
                size={17}
                color="#F97316"
              />
            </View>
            <View className="flex-1">
              <Text className="text-[14px] font-bold text-ink">{item.name}</Text>
              <Text className="mt-0.5 text-[12px] text-ink-muted">
                {item.address} · {item.coordinates.latitude.toFixed(4)}, {item.coordinates.longitude.toFixed(4)}
              </Text>
            </View>
            <Pressable onPress={() => setDeleteTarget(item)} className="rounded-full p-2 active:bg-slate-100">
              <Feather name="trash-2" size={17} color="#EF4444" />
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          isLoading ? null : (
            <View className="mt-10">
              <EmptyState
                title="No saved places"
                message="Save your home or work address for faster booking."
                icon="map-pin"
              />
            </View>
          )
        }
      />

      <ConfirmDialog
        visible={Boolean(deleteTarget)}
        title="Delete saved place?"
        message={`Remove "${deleteTarget?.name}" from your saved places?`}
        confirmLabel="Delete"
        tone="danger"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deletePlace.mutate(deleteTarget.id, {
              onSuccess: () => showToast('success', 'Place removed'),
              onError: (error: Error) => showToast('error', 'Delete failed', error.message),
            });
          }
          setDeleteTarget(null);
        }}
      />
    </Screen>
  );
}
