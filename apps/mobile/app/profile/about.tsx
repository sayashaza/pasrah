import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../theme/colors';
import { useAuthStore } from '../../store/useAuthStore';

export default function AboutMeScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About me</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Personal Details */}
          <Text style={styles.sectionTitle}>Personal Details</Text>
          
          <View style={styles.inputCard}>
            <Feather name="user" size={20} color="#868889" style={styles.icon} />
            <Text style={styles.staticInputText}>{user?.displayName || 'Russell Austin'}</Text>
          </View>
          
          <View style={styles.inputCard}>
            <Feather name="mail" size={20} color="#868889" style={styles.icon} />
            <Text style={styles.staticInputText}>{user?.email || 'russell.partner@gmail.com'}</Text>
          </View>

          <View style={styles.inputCard}>
            <Feather name="phone" size={20} color="#868889" style={styles.icon} />
            <Text style={styles.staticInputText}>+1 202 555 0142</Text>
          </View>

          {/* Change Password */}
          <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Change Password</Text>

          <View style={styles.inputCard}>
            <Feather name="lock" size={20} color="#868889" style={styles.icon} />
            <TextInput 
              style={styles.textInput}
              placeholder="Current password"
              placeholderTextColor="#868889"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
          </View>

          <View style={[styles.inputCard, styles.passwordCard]}>
            <Feather name="lock" size={20} color="#868889" style={styles.icon} />
            <TextInput 
              style={styles.textInput}
              placeholder="New password"
              placeholderTextColor="#868889"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Feather name="eye" size={20} color="#868889" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputCard}>
            <Feather name="lock" size={20} color="#868889" style={styles.icon} />
            <TextInput 
              style={styles.textInput}
              placeholder="Confirm password"
              placeholderTextColor="#868889"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton}>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 15,
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  passwordCard: {
    justifyContent: 'space-between',
  },
  icon: {
    marginRight: 15,
  },
  staticInputText: {
    fontSize: 15,
    color: '#868889',
    fontWeight: '500',
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    height: '100%',
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
