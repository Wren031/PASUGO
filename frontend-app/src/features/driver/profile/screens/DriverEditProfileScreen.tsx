import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '@/components/screen/Screen';
import { ScreenHeader } from '@/components/screen/ScreenHeader';
import { Input } from '@/components/inputs/Input';
import { PhoneInput } from '@/components/inputs/PhoneInput';
import { Button } from '@/components/buttons/Button';
import { useUpdateDriverProfile } from '@/features/driver/profile/hooks/useDriver';
import { useAuthStore, selectUser } from '@/store/auth-store';
import { showToast } from '@/store/toast-store';

export function DriverEditProfileScreen() {
  const navigation = useNavigation();
  const user = useAuthStore(selectUser);
  const updateProfile = useUpdateDriverProfile(user?.id ?? '');

  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [email, setEmail] = useState(user?.email ?? '');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone);
      setEmail(user.email);
    }
  }, [user?.id]);

  const handleSave = () => {
    if (!name.trim()) {
      showToast('error', 'Name is required');
      return;
    }
    updateProfile.mutate(
      { name: name.trim(), email: email.trim() || user?.email },
      {
        onSuccess: () => {
          showToast('success', 'Profile updated');
          navigation.goBack();
        },
        onError: (error: Error) => showToast('error', 'Update failed', error.message),
      },
    );
  };

  return (
    <Screen>
      <ScreenHeader title="Edit profile" />
      <ScrollView className="flex-1 px-4 pb-8" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View className="mt-4 rounded-2xl border border-line bg-white p-4">
          <Input label="Full name" value={name} onChangeText={setName} placeholder="Arman Castillo" />
          <View className="mt-4">
            <PhoneInput label="Mobile number" value={phone} onChangeText={setPhone} editable={false} />
          </View>
          <View className="mt-4">
            <Input label="Email" value={email} onChangeText={setEmail} placeholder="arman@email.com" keyboardType="email-address" autoCapitalize="none" />
          </View>
        </View>

        <Button label="Save changes" size="lg" fullWidth className="mt-6" loading={updateProfile.isPending} onPress={handleSave} />
        <Button label="Cancel" variant="ghost" fullWidth className="mt-2" onPress={() => navigation.goBack()} />
      </ScrollView>
    </Screen>
  );
}
