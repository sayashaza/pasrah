import React from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, typography } from '../../theme/colors';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Background Image / Placeholder */}
      <ImageBackground 
        source={require('../../assets/images/icon.png')} // Fallback until actual image is placed
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.gradientOverlay}>
          <SafeAreaView style={styles.header}>
            <Text style={styles.headerTitle}>Welcome</Text>
          </SafeAreaView>
        </View>
      </ImageBackground>

      {/* Bottom Sheet Modal Container */}
      <View style={styles.bottomSheet}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>
          Lorem ipsum dolor sit amet, consetetur{'\n'}
          sadipscing elitr, sed diam nonumy
        </Text>

        {/* Continue with Google */}
        <TouchableOpacity style={styles.googleButton}>
          {/* <Image source={require('../../assets/images/icon-google.png')} style={styles.buttonIcon} /> */}
          <View style={styles.placeholderIcon} />
          <Text style={styles.googleButtonText}>Continue with google</Text>
        </TouchableOpacity>

        {/* Create an Account */}
        <TouchableOpacity style={styles.createButton}>
          {/* <Image source={require('../../assets/images/icon-profile.png')} style={styles.buttonIconWhite} /> */}
          <View style={[styles.placeholderIcon, { backgroundColor: 'transparent' }]} />
          <Text style={styles.createButtonText}>Create an account</Text>
        </TouchableOpacity>

        {/* Custom Auth: Phone + PIN */}
        <TouchableOpacity style={[styles.googleButton, { marginBottom: 20 }]} onPress={() => router.push('/(auth)/login-phone')}>
          <View style={styles.placeholderIcon} />
          <Text style={styles.googleButtonText}>Login with Phone (GPM)</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <TouchableOpacity style={styles.loginLinkContainer} onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.loginText}>
            Already have an account ? <Text style={styles.loginTextBold}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  backgroundImage: {
    width: '100%',
    height: height * 0.65, // Takes up ~65% of screen
  },
  gradientOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)', // Simple overlay until gradient is implemented
  },
  header: {
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: typography.title,
    color: colors.white,
    fontWeight: '500',
    marginTop: 10,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: height * 0.45,
    backgroundColor: '#F4F5F9',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: 20,
    paddingTop: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    width: '100%',
    height: 60,
    borderRadius: 5,
    justifyContent: 'center',
    marginBottom: 15,
    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android Elevation
    elevation: 2,
  },
  googleButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 10,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    width: '100%',
    height: 60,
    borderRadius: 5,
    justifyContent: 'center',
    marginBottom: 25,
  },
  createButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
    marginLeft: 10,
  },
  buttonIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  buttonIconWhite: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: colors.white,
  },
  placeholderIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#ddd',
    borderRadius: 10,
  },
  loginLinkContainer: {
    padding: 10,
  },
  loginText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  loginTextBold: {
    fontWeight: '600',
    color: colors.text,
  },
});
