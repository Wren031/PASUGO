import React, { useEffect, useRef } from 'react';
import { Animated, View, Easing } from 'react-native';
import Svg, { Circle, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import { cn } from '@/utils/cn';

export function WelcomeIllustration({ className }: { className?: string }) {
  // Animation values
  const driveAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Continuous riding movement from left to right
    const driveLoop = Animated.loop(
      Animated.timing(driveAnim, {
        toValue: 1,
        duration: 3500,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    );

    // Engine road vibration / bobbing
    const bounceLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -3,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]),
    );

    driveLoop.start();
    bounceLoop.start();

    return () => {
      driveLoop.stop();
      bounceLoop.stop();
    };
  }, [driveAnim, bounceAnim]);

  // Interpolate riding path coordinates following the road curve
  const translateX = driveAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-35, 10, 35],
  });

  const translateY = driveAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [12, -2, 8],
  });

  return (
    <View
      className={cn('relative w-full items-center justify-center', className)}
      style={{ aspectRatio: 420 / 320 }}
    >
      {/* Background SVG Layer */}
      <View className="absolute inset-0 h-full w-full">
        <Svg width="100%" height="100%" viewBox="0 0 420 320">
          <Defs>
            <LinearGradient id="bgGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#FFF7ED" stopOpacity="1" />
              <Stop offset="100%" stopColor="#FFEDD5" stopOpacity="0.6" />
            </LinearGradient>
            <LinearGradient id="accentGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#F97316" stopOpacity="1" />
              <Stop offset="100%" stopColor="#FB923C" stopOpacity="1" />
            </LinearGradient>
          </Defs>

          {/* Core Soft Ambient Backdrop */}
          <Circle cx={210} cy={160} r={140} fill="url(#bgGlow)" />
          <Circle
            cx={210}
            cy={160}
            r={115}
            stroke="#FDBA74"
            strokeWidth={1.5}
            strokeDasharray="6 6"
            fill="none"
            opacity={0.4}
          />

          {/* Dynamic Road Curve Path */}
          <Path
            d="M -10 270 Q 120 220 210 245 T 430 230"
            stroke="#E2E8F0"
            strokeWidth={20}
            strokeLinecap="round"
            fill="none"
          />
          <Path
            d="M -10 270 Q 120 220 210 245 T 430 230"
            stroke="#FFFFFF"
            strokeWidth={3}
            strokeDasharray="10 10"
            strokeLinecap="round"
            fill="none"
          />

          {/* Active Route Highlight */}
          <Path
            d="M 40 270 C 130 210 290 220 380 250"
            stroke="url(#accentGlow)"
            strokeWidth={4}
            strokeLinecap="round"
            fill="none"
          />

          {/* Start and Destination Waypoint Markers */}
          <Circle cx={40} cy={270} r={10} fill="#F97316" />
          <Circle cx={40} cy={270} r={4} fill="#FFFFFF" />
          <Circle cx={380} cy={250} r={10} fill="#22C55E" />
          <Circle cx={380} cy={250} r={4} fill="#FFFFFF" />

          {/* Floating UI Decorative Dots */}
          <Circle cx={80} cy={60} r={6} fill="#FDBA74" opacity={0.6} />
          <Circle cx={350} cy={80} r={10} fill="#F97316" opacity={0.15} />
          <Circle cx={355} cy={80} r={4} fill="#F97316" opacity={0.4} />
        </Svg>
      </View>

      {/* Animated & Flipped Motorcycle Asset */}
      <Animated.Image
        source={require('../../../../assets/hatodGo.png')}
        style={{
          width: '75%',
          height: '75%',
          transform: [
            { translateX },
            { translateY: Animated.add(translateY, bounceAnim) },
            { scaleX: -1 }, // Flips image horizontally to face right
            { rotate: '-3deg' }, // Slight forward lean for riding feel
          ],
        }}
        resizeMode="contain"
      />

      {/* Floating Modern Badge */}
      <View className="absolute bottom-6 right-8 flex-row items-center rounded-full bg-white px-3 py-1.5 shadow-md shadow-black/10">
        <View className="mr-1.5 h-2 w-2 rounded-full bg-green-500" />
        <Feather name="navigation" size={12} color="#F97316" />
      </View>
    </View>
  );
}