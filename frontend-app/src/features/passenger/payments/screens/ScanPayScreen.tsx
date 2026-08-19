import React, { useEffect, useRef, useState } from 'react';
import { Animated, Keyboard, Pressable, Text, TextInput, View } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useScanQr } from '../hooks/useScanPay';
import { useMerchants } from '../hooks/useScanPay';
import { showToast } from '@/store/toast-store';
import type { PassengerStackParamList } from '@/navigation/types';

type Navigation = NativeStackNavigationProp<PassengerStackParamList>;

export function ScanPayScreen() {
  const navigation = useNavigation<Navigation>();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const [permission, requestPermission] = useCameraPermissions();
  const { data: merchants } = useMerchants();

  const [torch, setTorch] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [pendingPayload, setPendingPayload] = useState('');
  const lockRef = useRef(false);

  const { data: scannedMerchant, error: scanError, isFetching } = useScanQr(pendingPayload);

  useEffect(() => {
    if (pendingPayload && scannedMerchant) {
      lockRef.current = true;
      navigation.navigate('ScanPayConfirm', { payload: pendingPayload });
      setPendingPayload('');
    }
  }, [pendingPayload, scannedMerchant, navigation]);

  useEffect(() => {
    if (pendingPayload && scanError) {
      showToast('error', 'Scan failed', scanError instanceof Error ? scanError.message : 'Invalid QR code.');
      lockRef.current = false;
      setPendingPayload('');
    }
  }, [pendingPayload, scanError]);

  const handleScan = (result: BarcodeScanningResult) => {
    if (lockRef.current || !isFocused) return;
    lockRef.current = true;
    setPendingPayload(result.data);
  };

  const simulateScan = () => {
    if (!merchants?.length || lockRef.current) return;
    lockRef.current = true;
    const random = merchants[Math.floor(Math.random() * merchants.length)];
    setPendingPayload(random.qrPayload);
  };

  const handleManual = () => {
    if (!manualCode.trim() || lockRef.current) return;
    lockRef.current = true;
    setManualOpen(false);
    Keyboard.dismiss();
    setPendingPayload(manualCode.trim());
  };

  return (
    <View className="flex-1 bg-slate-950">
      {isFocused && permission?.granted ? (
        <CameraView
          className="flex-1"
          facing="back"
          active={isFocused}
          enableTorch={torch}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={handleScan}
        />
      ) : (
        <View className="flex-1 items-center justify-center bg-slate-950 px-8">
          <View className="h-20 w-20 items-center justify-center rounded-3xl bg-white/10">
            <MaterialCommunityIcons name="qrcode-scan" size={36} color="#FFFFFF" />
          </View>
          <Text className="mt-4 text-center text-[16px] font-bold text-white">
            Camera access needed
          </Text>
          <Text className="mt-1.5 text-center text-[12.5px] leading-5 text-slate-400">
            Allow camera access to scan HatodGo partner QR codes. You can also simulate a scan below.
          </Text>
          {permission && !permission.granted ? (
            <Pressable
              onPress={requestPermission}
              className="mt-5 rounded-full bg-orange-500 px-6 py-3 active:bg-orange-600"
            >
              <Text className="text-[13px] font-bold text-white">Enable camera</Text>
            </Pressable>
          ) : null}
        </View>
      )}

      <View className="absolute inset-x-0" style={{ top: insets.top + 8 }}>
        <View className="flex-row items-center justify-between px-4">
          <Pressable
            onPress={() => navigation.goBack()}
            className="h-10 w-10 items-center justify-center rounded-full bg-black/40"
          >
            <Feather name="x" size={20} color="#FFFFFF" />
          </Pressable>
          <View className="items-center">
            <Text className="text-[16px] font-bold text-white">Scan to pay</Text>
            <Text className="text-[11px] text-slate-300">HatodGo Wallet</Text>
          </View>
          <View className="h-10 w-10" />
        </View>
      </View>

      {permission?.granted && isFocused ? (
        <View pointerEvents="none" className="absolute inset-0 items-center justify-center">
          <View className="h-56 w-56">
            <View className="absolute left-0 top-0 h-12 w-12 rounded-tl-3xl border-l-4 border-t-4 border-orange-400" />
            <View className="absolute right-0 top-0 h-12 w-12 rounded-tr-3xl border-r-4 border-t-4 border-orange-400" />
            <View className="absolute bottom-0 left-0 h-12 w-12 rounded-bl-3xl border-b-4 border-l-4 border-orange-400" />
            <View className="absolute bottom-0 right-0 h-12 w-12 rounded-br-3xl border-b-4 border-r-4 border-orange-400" />
            <ScanLine />
          </View>
        </View>
      ) : null}

      <View
        className="rounded-t-3xl bg-slate-900 px-5 pb-4"
        style={{ paddingBottom: insets.bottom + 16, marginTop: 'auto' }}
      >
        {manualOpen ? (
          <View>
            <Text className="text-[13px] font-semibold text-white">Enter QR code manually</Text>
            <Text className="mt-1 text-[11.5px] text-slate-400">
              Type the code shown on the merchant's terminal, e.g. HATDOPAY:m-7eleven
            </Text>
            <View className="mt-3 flex-row items-center gap-2">
              <TextInput
                value={manualCode}
                onChangeText={setManualCode}
                placeholder="HATDOPAY:merchant-id"
                placeholderTextColor="#64748B"
                autoCapitalize="characters"
                autoCorrect={false}
                className="h-12 flex-1 rounded-xl bg-slate-800 px-4 text-[13px] text-white"
                onSubmitEditing={handleManual}
              />
              <Pressable
                onPress={handleManual}
                className="h-12 items-center justify-center rounded-xl bg-orange-500 px-5 active:bg-orange-600"
              >
                <Feather name="arrow-right" size={18} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>
        ) : (
          <View className="flex-row items-center justify-between gap-2">
            <View className="flex-1">
              <Text className="text-[14px] font-bold text-white">Align QR within the frame</Text>
              <Text className="mt-0.5 text-[11.5px] text-slate-400">
                {isFetching ? 'Verifying code…' : 'Works with all HatodGo partner merchants'}
              </Text>
            </View>
            <Pressable
              onPress={() => setTorch((t) => !t)}
              className={`h-12 w-12 items-center justify-center rounded-full ${torch ? 'bg-orange-500' : 'bg-slate-800'}`}
            >
              <Feather name={torch ? 'zap' : 'zap-off'} size={18} color="#FFFFFF" />
            </Pressable>
            <Pressable
              onPress={simulateScan}
              className="h-12 items-center justify-center rounded-full bg-slate-800 px-5 active:bg-slate-700"
            >
              <Text className="text-[12px] font-bold text-white">Simulate scan</Text>
            </Pressable>
          </View>
        )}

        <Pressable
          onPress={() => setManualOpen((o) => !o)}
          className="mt-3 items-center rounded-full py-1.5 active:opacity-60"
        >
          <Text className="text-[12px] font-semibold text-orange-400">
            {manualOpen ? 'Back to camera' : 'Enter code manually instead'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function ScanLine() {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(progress, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [progress]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 224],
  });

  return (
    <Animated.View
      className="absolute inset-x-2 h-0.5 rounded-full bg-orange-400"
      style={{ transform: [{ translateY }] }}
    />
  );
}
