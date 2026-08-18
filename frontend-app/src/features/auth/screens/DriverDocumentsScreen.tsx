import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthLayout } from '../components/AuthLayout';
import { Button } from '@/components/buttons/Button';
import { Badge } from '@/components/ui/Badge';
import { useRegistrationStore } from '@/store/registration-store';
import { cn } from '@/utils/cn';
import type { DocumentUpload } from '../types';
import type { AuthStackParamList } from '@/navigation/types';
import React from 'react';

type Navigation = NativeStackNavigationProp<AuthStackParamList, 'DriverDocuments'>;

const initialDocuments: Omit<DocumentUpload, 'fileName' | 'status'>[] = [
  { key: 'license', label: "Driver's License", description: 'Professional / Non-professional license' },
  { key: 'orcr', label: 'ORCR', description: 'Official receipt and certificate of registration' },
  { key: 'nbi', label: 'NBI Clearance', description: 'National Bureau of Investigation clearance' },
];

export function DriverDocumentsScreen() {
  const navigation = useNavigation<Navigation>();
  const stored = useRegistrationStore((state) => state.draft.documents);
  const setDocuments = useRegistrationStore((state) => state.setDocuments);
  const [documents, setLocalDocuments] = useState<DocumentUpload[]>(() =>
    initialDocuments.map((doc) => {
      const existing = stored.find((s) => s.key === doc.key);
      return existing ? { ...doc, fileName: existing.fileName, status: existing.status } : { ...doc, fileName: '', status: 'uploading' as const };
    }),
  );

  const handleUpload = (index: number) => {
    const doc = documents[index];
    if (doc.status === 'uploading') return;
    setLocalDocuments((prev) => prev.map((d, i) => (i === index ? { ...d, status: 'uploading' as const } : d)));
    setTimeout(() => {
      setLocalDocuments((prev) =>
        prev.map((d, i) => (i === index ? { ...d, status: 'uploaded' as const, fileName: `${d.key}_proof.jpg` } : d)),
      );
    }, 1200);
  };

  const allUploaded = documents.every((doc) => doc.status === 'uploaded');

  const handleSubmit = () => {
    setDocuments(documents);
    navigation.navigate('DriverReview');
  };

  return (
    <AuthLayout
      title="Upload documents"
      subtitle="Provide the required documents so we can verify your identity."
      onBack={() => navigation.goBack()}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-8">
        <View className="gap-3">
          {documents.map((doc, index) => {
            const uploaded = doc.status === 'uploaded';
            return (
              <View key={doc.key} className="rounded-2xl border border-line bg-white p-4">
                <View className="flex-row items-center gap-3">
                  <View
                    className={cn(
                      'h-11 w-11 items-center justify-center rounded-xl',
                      uploaded ? 'bg-green-100' : doc.status === 'uploading' ? 'bg-orange-100' : 'bg-slate-100',
                    )}
                  >
                    <Feather
                      name={uploaded ? 'check-circle' : doc.status === 'uploading' ? 'loader' : 'file-text'}
                      size={20}
                      color={uploaded ? '#16A34A' : doc.status === 'uploading' ? '#F97316' : '#94A3B8'}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[14px] font-bold text-ink">{doc.label}</Text>
                    <Text className="mt-0.5 text-[11.5px] leading-4 text-ink-muted">{doc.description}</Text>
                    {uploaded ? <Text className="mt-1 text-[11px] font-semibold text-success">{doc.fileName}</Text> : null}
                  </View>
                  <Badge
                    label={uploaded ? 'Uploaded' : doc.status === 'uploading' ? 'Uploading' : 'Required'}
                    tone={uploaded ? 'success' : doc.status === 'uploading' ? 'warning' : 'neutral'}
                  />
                </View>
                <Pressable
                  onPress={() => handleUpload(index)}
                  disabled={doc.status === 'uploading'}
                  className={cn(
                    'mt-3 h-11 flex-row items-center justify-center gap-2 rounded-xl border border-dashed',
                    uploaded ? 'border-success' : doc.status === 'uploading' ? 'border-line bg-slate-50' : 'border-primary',
                  )}
                >
                  {doc.status === 'uploading' ? (
                    <Text className="text-[13px] font-semibold text-ink-muted">Uploading…</Text>
                  ) : (
                    <>
                      <Feather name={uploaded ? 'refresh-cw' : 'upload'} size={15} color={uploaded ? '#16A34A' : '#F97316'} />
                      <Text className={cn('text-[13px] font-semibold', uploaded ? 'text-success' : 'text-primary')}>
                        {uploaded ? 'Upload again' : 'Upload file'}
                      </Text>
                    </>
                  )}
                </Pressable>
              </View>
            );
          })}
        </View>

        <View className="mt-6">
          <Button
            label="Submit documents"
            size="lg"
            fullWidth
            disabled={!allUploaded}
            onPress={handleSubmit}
            leftIcon={<Feather name="check" size={18} color="#FFFFFF" />}
          />
        </View>
      </ScrollView>
    </AuthLayout>
  );
}