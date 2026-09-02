import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { Typography, BorderRadius } from '@/constants/theme';
import { AppInput } from '@/components/ui/AppInput';
import { AppButton } from '@/components/ui/AppButton';

const FAQS = [
  { q: 'How is my cab allocated?', a: 'Based on your pickup locality, shift timing and route availability, our system auto-assigns the optimal vehicle.' },
  { q: 'How does boarding OTP work?', a: 'A 4-digit OTP is shown on your app. Share it with the driver to verify boarding. This ensures you board the right vehicle.' },
  { q: 'Can I cancel my booking?', a: 'Yes, cancellations are permitted up to 2 hours before your scheduled pickup time.' },
  { q: 'I left something in the cab', a: 'Contact Transport Control immediately at 1800-36-ROUTE. We will coordinate with the driver to retrieve your item.' },
];

export default function HelpScreen() {
  const router = useRouter();
  const { themeColors } = useApp();
  const [expanded, setExpanded] = useState<number | null>(null);
  const [issue, setIssue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!issue.trim()) return;
    setTimeout(() => {
      setSubmitted(true);
      setIssue('');
      Alert.alert('Ticket Submitted', 'Your issue has been logged. Ticket #36-TK-9021');
      setTimeout(() => setSubmitted(false), 2000);
    }, 500);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}
          >
            <Ionicons name="arrow-back" size={20} color={themeColors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: themeColors.text }]}>Help & Support</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Support Banner */}
        <View style={[styles.banner, { backgroundColor: themeColors.secondary }]}>
          <Ionicons name="headset" size={24} color="#FFF" />
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>24/7 Support</Text>
            <Text style={styles.bannerSub}>1800-36-ROUTE • support@36route.com</Text>
          </View>
        </View>

        {/* FAQs */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Frequently Asked</Text>
        {FAQS.map((faq, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.faq, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}
            onPress={() => setExpanded(expanded === i ? null : i)}
          >
            <View style={styles.faqRow}>
              <Text style={[styles.faqQ, { color: themeColors.text }]}>{faq.q}</Text>
              <Ionicons name={expanded === i ? 'chevron-up' : 'chevron-down'} size={18} color={themeColors.textMuted} />
            </View>
            {expanded === i && (
              <Text style={[styles.faqA, { color: themeColors.textSecondary }]}>{faq.a}</Text>
            )}
          </TouchableOpacity>
        ))}

        {/* Issue Form */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Report an Issue</Text>
        <View style={[styles.formCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
          <AppInput
            placeholder="Describe your issue..."
            value={issue}
            onChangeText={setIssue}
            multiline
          />
          <AppButton title="Submit Issue" onPress={handleSubmit} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 18, paddingBottom: 40 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, borderWidth: 1,
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSizes.lg, fontWeight: Typography.weights.bold as any,
  },
  banner: {
    flexDirection: 'row', alignItems: 'center', padding: 16,
    borderRadius: BorderRadius.md, gap: 12, marginBottom: 20,
  },
  bannerTitle: { color: '#FFF', fontSize: Typography.fontSizes.md, fontWeight: Typography.weights.bold as any },
  bannerSub: { color: 'rgba(255,255,255,0.8)', fontSize: Typography.fontSizes.xs, marginTop: 2 },
  sectionTitle: {
    fontSize: Typography.fontSizes.md, fontWeight: Typography.weights.bold as any, marginBottom: 10,
  },
  faq: {
    borderRadius: BorderRadius.md, borderWidth: 1, padding: 14, marginBottom: 8,
  },
  faqRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  faqQ: { fontSize: Typography.fontSizes.md, fontWeight: Typography.weights.semibold as any, flex: 1, marginRight: 8 },
  faqA: { fontSize: Typography.fontSizes.sm, marginTop: 10, lineHeight: 20 },
  formCard: {
    borderRadius: BorderRadius.md, borderWidth: 1, padding: 16,
  },
});
