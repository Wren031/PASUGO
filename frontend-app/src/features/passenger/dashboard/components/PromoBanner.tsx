import { Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export function PromoBanner() {
  return (
    <View className="overflow-hidden rounded-2xl bg-primary px-5 py-4">
      <View className="flex-row items-center gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-white/20">
          <MaterialCommunityIcons name="tag-outline" size={20} color="#FFFFFF" />
        </View>
        <View className="flex-1">
          <Text className="text-[15px] font-bold text-white">Weekend promo: 20% off</Text>
          <Text className="mt-0.5 text-[12px] text-orange-100">
            Use code WEEKEND20 on your next ride. Valid until Sunday.
          </Text>
        </View>
      </View>
    </View>
  );
}
