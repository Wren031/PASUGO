import { Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { cn } from '@/utils/cn';
import type { Landmark } from '@/constants/maps';
import type { SavedPlace } from '@/types/passenger';
import type { PassengerStackParamList } from '@/navigation/types';

export type PickedLocation = Landmark | SavedPlace;

interface LocationInputProps {
  label?: string;
  value: string | null;
  placeholder?: string;
  iconColor?: string;
  error?: string;
  savedPlaces?: SavedPlace[];
  bare?: boolean;
  target: 'pickup' | 'dropoff';
  onSelect: (location: PickedLocation) => void;
}

export function LocationInput({
  label,
  value,
  placeholder = 'Where to?',
  iconColor = '#94A3B8',
  error,
  savedPlaces = [],
  bare = false,
  target,
  onSelect,
}: LocationInputProps) {
  const navigation = useNavigation<NativeStackNavigationProp<PassengerStackParamList>>();

  const handlePress = () => {
    navigation.navigate('SelectLocationScreen', {
      target,
      savedPlaces,
      onSelect,
    });
  };

  return (
    <View className="gap-2">
      {label ? (
        <Text
          className={cn(
            bare ? 'px-1 text-[12px] font-semibold uppercase tracking-wide text-ink-muted' : 'px-1 text-[14px] font-semibold text-ink',
          )}
        >
          {label}
        </Text>
      ) : null}
      <Pressable
        onPress={handlePress}
        className={cn(
          'min-h-[52px] flex-row items-center gap-3',
          bare ? 'px-3' : 'rounded-2xl border bg-white px-4',
          !bare && (error ? 'border-danger' : 'border-line'),
        )}
      >
        {bare ? (
          <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: iconColor }} />
        ) : (
          <Feather name="map-pin" size={20} color={iconColor} />
        )}
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
    </View>
  );
}
