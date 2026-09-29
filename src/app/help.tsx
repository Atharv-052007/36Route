import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { AppSafeAreaView } from '@/components/ui/AppSafeAreaView';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { Typography, BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { Header } from '@/components/ui/Header';
import { AppInput } from '@/components/ui/AppInput';
import { AnimatedAppButton } from '@/components/ui/AnimatedAppButton';

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
    <AppSafeAreaView style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <Header title="Help & Support" showBack />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Support Banner */}
        <View style={[styles.banner, { backgroundColor: themeColors.secondary }]}>
          <View style={styles.bannerIconWrap}>
            <Ionicons name="headset" size={24} color="#FFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>24/7 Support</Text>
            <Text style={styles.bannerSub}>Always here to help you</Text>
          </View>
        </View>

        {/* Quick Contact */}
        <View style={styles.contactRow}>
          <TouchableOpacity
            style={[styles.contactCard, { backgroundColor: themeColors.cardBackground }, Shadows.small]}
            onPress={() => Alert.alert('Calling', 'Calling 1800-36-ROUTE...')}
            activeOpacity={0.7}
          >
            <View style={[styles.contactIcon, { backgroundColor: themeColors.accentLight }]}>
              <Ionicons name="call" size={20} color={themeColors.accent} />
            </View>
            <Text style={[styles.contactLabel, { color: themeColors.text }]}>Call Us</Text>
            <Text style={[styles.contactDetail, { color: themeColors.textSecondary }]}>1800-36-ROUTE</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.contactCard, { backgroundColor: themeColors.cardBackground }, Shadows.small]}
            onPress={() => Alert.alert('Email', 'Opening email client...')}
            activeOpacity={0.7}
          >
            <View style={[styles.contactIcon, { backgroundColor: themeColors.primaryLight }]}>
              <Ionicons name="mail" size={20} color={themeColors.primary} />
            </View>
            <Text style={[styles.contactLabel, { color: themeColors.text }]}>Email</Text>
            <Text style={[styles.contactDetail, { color: themeColors.textSecondary }]}>support@36route.com</Text>
          </TouchableOpacity>
        </View>

        {/* FAQs */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Frequently Asked</Text>
        <View style={[styles.faqCard, { backgroundColor: themeColors.cardBackground }, Shadows.card]}>
          {FAQS.map((faq, i) => (
            <View key={i}>
              <TouchableOpacity
                style={[styles.faqItem, i > 0 && { borderTopColor: themeColors.borderLight, borderTopWidth: 1 }]}
                onPress={() => setExpanded(expanded === i ? null : i)}
                activeOpacity={0.7}
              >
                <View style={styles.faqContent}>
                  <Ionicons name="help-circle-outline" size={18} color={themeColors.secondary} />
                  <Text style={[styles.faqQ, { color: themeColors.text }]}>{faq.q}</Text>
                </View>
                <Ionicons
                  name={expanded === i ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={themeColors.textMuted}
                />
              </TouchableOpacity>
              {expanded === i && (
                <View style={[styles.faqAnswer, { borderLeftColor: themeColors.secondary }]}>
                  <Text style={[styles.faqA, { color: themeColors.textSecondary }]}>{faq.a}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Issue Form */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Report an Issue</Text>
        <View style={[styles.formCard, { backgroundColor: themeColors.cardBackground }, Shadows.card]}>
          <AppInput
            placeholder="Describe your issue..."
            value={issue}
            onChangeText={setIssue}
            multiline
          />
          <AnimatedAppButton title={submitted ? 'Submitted!' : 'Submit Issue'} onPress={handleSubmit} />
        </View>
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: Spacing.base, paddingBottom: 40 },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: BorderRadius.lg,
    gap: 14,
    marginBottom: 16,
  },
  bannerIconWrap: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerTitle: { color: '#FFF', fontSize: Typography.fontSizes.lg, fontWeight: Typography.weights.bold as any },
  bannerSub: { color: 'rgba(255,255,255,0.85)', fontSize: Typography.fontSizes.sm, marginTop: 2 },
  contactRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  contactCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactLabel: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold as any,
  },
  contactDetail: {
    fontSize: Typography.fontSizes.xs,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.bold as any,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  faqCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    padding: 4,
    marginBottom: 20,
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  faqContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  faqQ: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold as any,
    flex: 1,
  },
  faqAnswer: {
    marginLeft: 14,
    marginRight: 14,
    marginBottom: 14,
    paddingLeft: 12,
    borderLeftWidth: 2,
  },
  faqA: {
    fontSize: Typography.fontSizes.sm,
    lineHeight: 20,
  },
  formCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    padding: 16,
  },
});
