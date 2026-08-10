import { useEffect, useState } from 'react';
import { Keyboard, Platform, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

export function KeyboardDismissButton() {
  const [visible, setVisible] = useState(false);
  const [bottomOffset, setBottomOffset] = useState(16);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const show = Keyboard.addListener(showEvent, (e) => {
      setBottomOffset(Platform.OS === 'ios' ? e.endCoordinates.height + 16 : 16);
      setVisible(true);
    });
    const hide = Keyboard.addListener(hideEvent, () => setVisible(false));

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeInDown.duration(150)}
      exiting={FadeOutDown.duration(120)}
      className="absolute right-4 z-50"
      style={{ bottom: bottomOffset }}
      pointerEvents="box-none"
    >
      <Pressable
        onPress={() => Keyboard.dismiss()}
        accessibilityRole="button"
        accessibilityLabel="Close keyboard"
        hitSlop={8}
        className="h-10 w-10 items-center justify-center rounded-full bg-ink shadow-sm active:bg-slate-700"
      >
        <Feather name="chevron-down" size={20} color="#FFFFFF" />
      </Pressable>
    </Animated.View>
  );
}
