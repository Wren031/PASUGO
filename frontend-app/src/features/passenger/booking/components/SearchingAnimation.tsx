import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export function SearchingAnimation() {
  const pulse = useSharedValue(1);
  const ring = useSharedValue(0.5);
  const bounce = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1.4, { duration: 900, easing: Easing.out(Easing.ease) }), -1, true);
    ring.value = withRepeat(
      withSequence(withTiming(1.15, { duration: 900, easing: Easing.out(Easing.ease) }), withTiming(0.5, { duration: 0 })),
      -1,
      false,
    );
    bounce.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 350, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 350, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      true,
    );
  }, [pulse, ring, bounce]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));
  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ring.value }],
    opacity: 1 - (ring.value - 0.5) / 0.65,
  }));
  const bounceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }],
  }));

  return (
    <View className="items-center justify-center py-8">
      <View className="h-24 w-24 items-center justify-center">
        <Animated.View className="absolute h-20 w-20 rounded-full bg-primary-soft" style={[styles.absolute, ringStyle]} />
        <Animated.View className="absolute h-16 w-16 rounded-full bg-primary-soft" style={[styles.absolute, pulseStyle]} />
        <Animated.View style={bounceStyle} className="absolute h-16 w-16 items-center justify-center rounded-full bg-primary">
          <MaterialCommunityIcons name="motorbike" size={28} color="#FFFFFF" />
        </Animated.View>
      </View>
      <Text className="mt-5 text-[17px] font-bold text-ink">Searching for drivers</Text>
      <Text className="mt-1 text-[13px] text-ink-muted">Hang tight, a rider near you is being matched…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  absolute: { position: 'absolute' },
});
