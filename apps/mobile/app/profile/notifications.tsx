import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../theme/colors';

export default function NotificationsScreen() {
  const router = useRouter();

  const [allowNav, setAllowNav] = useState(true);
  const [emailNav, setEmailNav] = useState(false);
  const [orderNav, setOrderNav] = useState(false);
  const [generalNav, setGeneralNav] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Allow Notifications */}
        <View style={styles.toggleCard}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleTitle}>Allow Notifications</Text>
            <Text style={styles.toggleDesc}>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumym
            </Text>
          </View>
          <Switch
            trackColor={{ false: '#EAEAEA', true: colors.primary }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#EAEAEA"
            onValueChange={setAllowNav}
            value={allowNav}
          />
        </View>

        {/* Email Notifications */}
        <View style={styles.toggleCard}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleTitle}>Email Notifications</Text>
            <Text style={styles.toggleDesc}>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumym
            </Text>
          </View>
          <Switch
            trackColor={{ false: '#EAEAEA', true: colors.primary }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#EAEAEA"
            onValueChange={setEmailNav}
            value={emailNav}
          />
        </View>

        {/* Order Notifications */}
        <View style={styles.toggleCard}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleTitle}>Order Notifications</Text>
            <Text style={styles.toggleDesc}>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumym
            </Text>
          </View>
          <Switch
            trackColor={{ false: '#EAEAEA', true: colors.primary }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#EAEAEA"
            onValueChange={setOrderNav}
            value={orderNav}
          />
        </View>

        {/* General Notifications */}
        <View style={styles.toggleCard}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleTitle}>General Notifications</Text>
            <Text style={styles.toggleDesc}>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumym
            </Text>
          </View>
          <Switch
            trackColor={{ false: '#EAEAEA', true: colors.primary }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#EAEAEA"
            onValueChange={setGeneralNav}
            value={generalNav}
          />
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={() => router.back()}>
          <Text style={styles.saveButtonText}>Save settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    height: 60,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  scrollContent: {
    padding: 20,
  },
  toggleCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 8,
    marginBottom: 15,
  },
  toggleInfo: {
    flex: 1,
    paddingRight: 15,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  toggleDesc: {
    fontSize: 13,
    color: '#868889',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    backgroundColor: '#F4F5F9',
  },
  saveButton: {
    backgroundColor: colors.primary,
    height: 60,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
