import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Switch, KeyboardAvoidingView, Platform, LayoutAnimation, UIManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../theme/colors';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const mockAddresses = [
  {
    id: '1',
    name: 'Russell Austin',
    address: '2811 Crescent Day. LA Port',
    location: 'California, United States 77571',
    phone: '+1 202 555 0142',
    isDefault: true,
  },
  {
    id: '2',
    name: 'Jissca Simpson',
    address: '2811 Crescent Day. LA Port',
    location: 'California, United States 77571',
    phone: '+1 202 555 0142',
    isDefault: false,
  }
];

export default function MyAddressScreen() {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>('1');
  const [isDefaultToggle, setIsDefaultToggle] = useState(true);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Address</Text>
        <TouchableOpacity style={styles.addButton}>
          <Feather name="plus-circle" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {mockAddresses.map((addr) => {
            const isExpanded = expandedId === addr.id;
            return (
              <View key={addr.id} style={styles.addressCard}>
                
                {addr.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                  </View>
                )}

                <TouchableOpacity 
                  style={[styles.addressTop, addr.isDefault ? styles.defaultPadding : null]} 
                  disabled={isExpanded} // Prevent closing active one according to design style or keep it toggleable
                  onPress={() => toggleExpand(addr.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.addressLeft}>
                    <View style={styles.iconBox}>
                      <Feather name="map-pin" size={24} color={colors.primary} />
                    </View>
                    <View style={styles.infoBox}>
                      <Text style={styles.nameText}>{addr.name}</Text>
                      <Text style={styles.addressText}>{addr.address}</Text>
                      <Text style={styles.addressText}>{addr.location}</Text>
                      <Text style={styles.phoneText}>{addr.phone}</Text>
                    </View>
                  </View>
                  <View style={styles.chevronBox}>
                    <Feather name={isExpanded ? 'chevron-up' : 'chevron-down'} size={20} color={colors.primary} />
                  </View>
                </TouchableOpacity>

                {/* Expanded Form Area */}
                {isExpanded && (
                  <View style={styles.expandedForm}>
                    <View style={styles.inputRow}>
                      <Feather name="user" size={20} color="#868889" style={styles.inputIcon} />
                      <TextInput style={styles.input} defaultValue={addr.name} placeholder="Name" placeholderTextColor="#868889" />
                    </View>
                    <View style={styles.inputRow}>
                      <Feather name="map-pin" size={20} color="#868889" style={styles.inputIcon} />
                      <TextInput style={styles.input} defaultValue={addr.address} placeholder="Address" placeholderTextColor="#868889" />
                    </View>
                    
                    <View style={styles.splitRow}>
                      <View style={[styles.inputRow, styles.halfInput]}>
                        <Feather name="map" size={20} color="#868889" style={styles.inputIcon} />
                        <TextInput style={styles.input} defaultValue="LA Port" placeholder="City" placeholderTextColor="#868889" />
                      </View>
                      <View style={{ width: 10 }} />
                      <View style={[styles.inputRow, styles.halfInput]}>
                        <Feather name="credit-card" size={20} color="#868889" style={styles.inputIcon} />
                        <TextInput style={styles.input} defaultValue="77571" placeholder="Zip code" placeholderTextColor="#868889" />
                      </View>
                    </View>

                    <View style={styles.inputRow}>
                      <Feather name="globe" size={20} color="#868889" style={styles.inputIcon} />
                      <TextInput style={styles.input} defaultValue="United States" placeholder="Country" placeholderTextColor="#868889" />
                      <Feather name="chevron-down" size={20} color="#868889" />
                    </View>

                    <View style={styles.inputRow}>
                      <Feather name="phone" size={20} color="#868889" style={styles.inputIcon} />
                      <TextInput style={styles.input} defaultValue={addr.phone} placeholder="Phone number" placeholderTextColor="#868889" />
                    </View>

                    <View style={styles.switchRow}>
                      <Switch
                        trackColor={{ false: '#EAEAEA', true: colors.primary }}
                        thumbColor="#FFFFFF"
                        ios_backgroundColor="#EAEAEA"
                        onValueChange={setIsDefaultToggle}
                        value={isDefaultToggle}
                      />
                      <Text style={styles.switchText}>Make default</Text>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </KeyboardAvoidingView>

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
  addButton: {
    padding: 8,
    marginRight: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  scrollContent: {
    padding: 20,
  },
  addressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
  },
  defaultBadge: {
    backgroundColor: '#e3fad6',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomRightRadius: 8,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
  },
  defaultBadgeText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  defaultPadding: {
    paddingTop: 35,
  },
  addressTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  addressLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ebfdf0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoBox: {
    flex: 1,
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 5,
  },
  addressText: {
    fontSize: 14,
    color: '#868889',
    marginBottom: 2,
    lineHeight: 20,
  },
  phoneText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginTop: 5,
  },
  chevronBox: {
    paddingTop: 10,
  },
  expandedForm: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F4F5F9',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F5F9',
    height: 60,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  splitRow: {
    flexDirection: 'row',
  },
  halfInput: {
    flex: 1,
  },
  inputIcon: {
    marginRight: 15,
  },
  input: {
    flex: 1,
    height: '100%',
    color: colors.text,
    fontSize: 15,
    fontWeight: '500',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  switchText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 10,
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
