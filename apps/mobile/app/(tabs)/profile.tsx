import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Feather, Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { useAuthStore } from '../../store/useAuthStore';
import { auth } from '../../utils/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);

  const [authView, setAuthView] = useState<'welcome' | 'login' | 'register'>('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthAction = async () => {
    if (!email || !password) {
      Toast.show({ type: 'error', text1: 'Please enter email and password', position: 'top' });
      return;
    }
    
    setIsLoading(true);
    try {
      if (authView === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        Toast.show({ type: 'success', text1: 'Logged in successfully!', position: 'top' });
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        Toast.show({ type: 'success', text1: 'Account created successfully!', position: 'top' });
      }
    } catch (error: any) {
      Toast.show({ type: 'error', text1: error.message || 'Authentication failed', position: 'top' });
    } finally {
      setIsLoading(false);
    }
  };

  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
  };

  // Array mapping for Figma list items 91:1535
  const profileMenuItems = [
    { id: '1', title: 'About me', icon: 'user' as const, action: () => router.push('/profile/about') },
    { id: '2', title: 'My Orders', icon: 'package' as const, action: () => router.push('/profile/orders') },
    { id: '3', title: 'My Favorites', icon: 'heart' as const, action: () => router.push('/(tabs)/favorites') },
    { id: '4', title: 'My Address', icon: 'map-pin' as const, action: () => router.push('/profile/address') },
    { id: '5', title: 'Credit Cards', icon: 'credit-card' as const, action: () => router.push('/profile/cards') },
    { id: '6', title: 'Transactions', icon: 'refresh-ccw' as const, action: () => router.push('/profile/transactions') },
    { id: '7', title: 'Notifications', icon: 'bell' as const, action: () => router.push('/profile/notifications') },
    { id: '8', title: 'Sign out', icon: 'log-out' as const, action: handleLogout },
  ];

  if (user) {
    // New Authenticated Profile View (91:1535)
    return (
      <View style={styles.container}>
        <View style={styles.profileTopBackground} />
        
        <SafeAreaView style={styles.profileSafeArea}>
          <ScrollView contentContainerStyle={styles.profileScrollContent} showsVerticalScrollIndicator={false}>
            {/* Header Block with Overlapping Avatar */}
            <View style={styles.profileHeaderBlock}>
              <View style={styles.avatarWrapper}>
                <Image
                  source={{ uri: user.photoURL || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80' }} // Mock/Fallback avatar per Figma
                  style={styles.avatarImage}
                  contentFit="cover"
                />
                <View style={styles.avatarCameraBadge}>
                  <Feather name="camera" size={12} color="#FFFFFF" />
                </View>
              </View>
              <Text style={styles.profileNameText}>{user.displayName || 'Olivia Austin'}</Text>
              <Text style={styles.profileEmailText}>{user.email || 'oliviaaustin@gmail.com'}</Text>
            </View>

            {/* List Menu Items Mapping array */}
            <View style={styles.listContainer}>
              {profileMenuItems.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.listItem} 
                  onPress={item.action}
                  activeOpacity={0.7}
                >
                  <View style={styles.listItemLeft}>
                    <Feather name={item.icon} size={22} color={colors.primary} />
                    <Text style={styles.listItemText}>{item.title}</Text>
                  </View>
                  <Feather name="chevron-right" size={20} color="#868889" />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  if (authView === 'login' || authView === 'register') {
    // Email / Password Login View
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.loginContent}>
            <TouchableOpacity style={styles.backArrow} onPress={() => setAuthView('welcome')}>
              <Feather name="arrow-left" size={24} color={colors.text} />
            </TouchableOpacity>

            <Text style={styles.welcomeHeading}>
              {authView === 'login' ? 'Welcome back !' : 'Create Account'}
            </Text>
            <Text style={styles.welcomeSub}>
              {authView === 'login' ? 'Sign in to your account' : 'Quickly create account'}
            </Text>

            <View style={styles.inputContainer}>
              <Feather name="mail" size={20} color="#868889" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#868889"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Feather name="lock" size={20} color="#868889" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#868889"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TouchableOpacity style={styles.eyeIcon}>
                <Feather name="eye-off" size={20} color="#868889" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={handleAuthAction} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {authView === 'login' ? 'Login' : 'Sign Up'}
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.bottomTextContainer}>
              <Text style={styles.bottomText}>
                {authView === 'login' ? "Don't have an account? " : "Already have an account? "}
              </Text>
              <TouchableOpacity onPress={() => setAuthView(authView === 'login' ? 'register' : 'login')}>
                <Text style={styles.bottomLink}>
                  {authView === 'login' ? 'Sign up' : 'Login'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Welcome View from Figma (10:133)
  return (
    <View style={styles.container}>
      {/* Background Grocery Image */}
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80' }}
        style={styles.backgroundImage}
        contentFit="cover"
      />
      <View style={styles.overlay} />

      <SafeAreaView style={styles.welcomeSafeArea}>
        {/* Top Header */}
        <View style={styles.welcomeHeader}>
          <TouchableOpacity style={styles.welcomeBackButton}>
             {/* Invisible placeholder for alignment if needed, or actual back button if this pushes from somewhere */}
             <Feather name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.welcomeHeaderTitle}>Welcome</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Bottom Card */}
        <View style={styles.bottomCard}>
          <Text style={styles.bottomCardTitle}>Welcome</Text>
          <Text style={styles.bottomCardDesc}>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
          </Text>

          {/* Google Button */}
          <TouchableOpacity style={styles.googleButton} onPress={() => Toast.show({ type: 'info', text1: 'OAuth requires native configuration', position: 'top' })}>
            <Ionicons name="logo-google" size={20} color="#DB4437" style={styles.btnIcon} />
            <Text style={styles.googleButtonText}>Continue with google</Text>
          </TouchableOpacity>

          {/* Create Account Button */}
          <TouchableOpacity style={styles.createAccountButton} onPress={() => setAuthView('register')}>
            <Feather name="user" size={20} color="#FFFFFF" style={styles.btnIcon} />
            <Text style={styles.createAccountButtonText}>Create an account</Text>
          </TouchableOpacity>

          <View style={styles.alreadyAccountRow}>
            <Text style={styles.alreadyAccountText}>Already have an account ? </Text>
            <TouchableOpacity onPress={() => setAuthView('login')}>
              <Text style={styles.loginLinkText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F9',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  welcomeSafeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  welcomeBackButton: {
    padding: 8,
    marginLeft: -8,
  },
  welcomeHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  bottomCard: {
    backgroundColor: '#F4F5F9',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
    alignItems: 'center',
  },
  bottomCardTitle: {
    fontSize: 25,
    fontWeight: '700',
    color: colors.text,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  bottomCardDesc: {
    fontSize: 15,
    color: '#868889',
    lineHeight: 22,
    alignSelf: 'flex-start',
    marginBottom: 30,
  },
  googleButton: {
    width: '100%',
    height: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  btnIcon: {
    position: 'absolute',
    left: 30,
  },
  googleButtonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '500',
  },
  createAccountButton: {
    width: '100%',
    height: 60,
    backgroundColor: colors.primary,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  createAccountButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
  alreadyAccountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alreadyAccountText: {
    color: '#868889',
    fontSize: 14,
  },
  loginLinkText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  // Sub-screens
  authHeader: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  authTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  profileContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarText: {
    fontSize: 40,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#868889',
    marginBottom: 40,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee4e4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutText: {
    color: '#F56262',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  loginContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backArrow: {
    padding: 8,
    marginLeft: -8,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  welcomeHeading: {
    fontSize: 25,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  welcomeSub: {
    fontSize: 15,
    color: '#868889',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: 60,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    color: colors.text,
    fontSize: 15,
  },
  eyeIcon: {
    padding: 5,
  },
  primaryButton: {
    width: '100%',
    height: 60,
    backgroundColor: colors.primary,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  bottomTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomText: {
    color: '#868889',
    fontSize: 14,
  },
  bottomLink: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  // --- New Authenticated Profile Styles (Figma 91:1535) ---
  profileTopBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: '#FFFFFF',
  },
  profileSafeArea: {
    flex: 1,
  },
  profileScrollContent: {
    paddingBottom: 40,
  },
  profileHeaderBlock: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 15,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    backgroundColor: '#EAEAEA',
  },
  avatarCameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    backgroundColor: colors.primary,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileNameText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  profileEmailText: {
    fontSize: 14,
    color: '#868889',
    marginBottom: 20,
  },
  listContainer: {
    marginTop: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginHorizontal: 15,
    marginBottom: 5,
    backgroundColor: 'transparent',
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 15,
  },
});
