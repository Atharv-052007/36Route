import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../context/AppContext';
import { Typography, Shadows } from '../constants/theme';
import { AppInput } from '../components/ui/AppInput';
import { AppButton } from '../components/ui/AppButton';

const FAQS = [
  {
    q: 'How is cab allocation done for shift commutes?',
    a: 'Cabs are automatedly routed based on office shifts, employee roster bookings, and optimized geofenced pickup clusters to minimize travel time.',
  },
  {
    q: 'Where do I find my boarding OTP?',
    a: 'Your boarding OTP is visible on your Active Trip card on the Home dashboard and inside Live Tracking 15 minutes before pickup.',
  },
  {
    q: 'What is the cutoff time for cancelling or rescheduling?',
    a: 'Corporate policy allows free cancellations up to 2 hours prior to your scheduled pickup time.',
  },
  {
    q: 'How do I report a lost item in the cab?',
    a: 'You can use the Lost & Found section below to submit details. Our corporate transport team will contact the driver and escort team immediately.',
  },
];

export default function HelpScreen() {
  const router = useRouter();
  const { themeColors } = useApp();

  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [issueText, setIssueText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitIssue = () => {
    if (!issueText.trim()) {
      Alert.alert('Error', 'Please describe your query or issue.');
      return;
    }
    setSubmitted(true);
    setIssueText('');
    setTimeout(() => {
      setSubmitted(false);
      Alert.alert('Ticket Raised', 'Your query has been logged with Transport Desk (Ticket #36-TK-9021).');
    }, 500);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={themeColors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: themeColors.text }]}>Help & Support Desk</Text>
        </View>

        {/* Support Hotline Banner */}
        <View
          style={[
            styles.banner,
            { backgroundColor: themeColors.primaryLight, borderColor: themeColors.border },
          ]}
        >
          <Ionicons name="headset" size={28} color={themeColors.primary} />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={[styles.bannerTitle, { color: themeColors.primary }]}>
              24/7 Corporate Transport Desk
            </Text>
            <Text style={[styles.bannerSub, { color: themeColors.textSecondary }]}>
              Toll Free: 1800-36-ROUTE • support@36route.corp
            </Text>
          </View>
        </View>

        {/* FAQs Section */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          Frequently Asked Questions
        </Text>

        {FAQS.map((faq, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              style={[
                styles.faqCard,
                {
                  backgroundColor: themeColors.cardBackground,
                  borderColor: themeColors.border,
                },
                Shadows.small,
              ]}
              onPress={() => setExpandedIndex(isExpanded ? null : index)}
            >
              <View style={styles.faqHeader}>
                <Text style={[styles.faqQ, { color: themeColors.text }]}>{faq.q}</Text>
                <Ionicons
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={themeColors.textMuted}
                />
              </View>
              {isExpanded && (
                <View style={[styles.faqBody, { borderTopColor: themeColors.border }]}>
                  <Text style={[styles.faqA, { color: themeColors.textSecondary }]}>{faq.a}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Report Issue Form */}
        <Text style={[styles.sectionTitle, { color: themeColors.text, marginTop: 14 }]}>
          Report an Issue or Request Support
        </Text>
        <View
          style={[
            styles.card,
            { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border },
            Shadows.medium,
          ]}
        >
          <AppInput
            label="Describe your feedback or issue"
            placeholder="e.g. Cab arrived late, driver behavior, lost property..."
            value={issueText}
            onChangeText={setIssueText}
            multiline
            numberOfLines={4}
            style={{ height: 90, textAlignVertical: 'top' }}
          />

          <AppButton title="Submit Support Ticket" onPress={handleSubmitIssue} size="md" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    padding: 18,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backBtn: {
    marginRight: 12,
  },
  title: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.weights.bold as any,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 20,
  },
  bannerTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.bold as any,
  },
  bannerSub: {
    fontSize: Typography.fontSizes.xs,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.bold as any,
    marginBottom: 10,
  },
  faqCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQ: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold as any,
    flex: 1,
    marginRight: 10,
  },
  faqBody: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  faqA: {
    fontSize: Typography.fontSizes.xs,
    lineHeight: 18,
  },
  card: {
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    marginTop: 6,
  },
});
