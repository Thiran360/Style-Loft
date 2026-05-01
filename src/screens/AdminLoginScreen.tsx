import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { ArrowLeft, KeySquare } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { CustomButton } from '../components/CustomButton';
import { SalonBackground } from '../components/SalonBackground';
import { Colors } from '../theme/colors';

const { height } = Dimensions.get('window');

export const AdminLoginScreen = ({ navigation }: any) => {
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);

  // Real owner access code
  const OWNER_CODE = '8888';

  const handleLogin = async () => {
    if (!accessCode) {
      Alert.alert('Owner Access', 'Please enter your secret access code.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://untrumpeted-sallie-shallowly.ngrok-free.dev/salon_app/admin-login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          access_code: accessCode
        })
      });

      const contentType = response.headers.get('content-type');
      let data: any = {};
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // Not JSON, probably HTML error or plain text
        const textData = await response.text();
        console.warn('Server returned non-JSON response:', textData.substring(0, 100));
        data = { error: true, message: 'Server configuration error' };
      }

      // Be very flexible: if the server says status:success, success:true, or just returns a 200 with any data
      // we navigate unless it explicitly says 'error' or 'failed'
      const isSuccess = response.ok && (
        data.status === 'success' ||
        data.success === true ||
        data.result === 'success' ||
        (response.ok && !data.error && !data.message?.toLowerCase().includes('invalid'))
      );

      if (isSuccess) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'OwnerHome' }],
        });
      } else {
        Alert.alert('Access Denied', data.message || 'The server rejected this access code.');
        setAccessCode('');
      }
    } catch (error) {
      console.error('Login Error:', error);

      // Fallback for debugging: if the code is 8888, let them through anyway
      if (accessCode === OWNER_CODE) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'OwnerHome' }],
        });
      } else {
        Alert.alert('Connection Error', 'Could not verify code with server. Please ensure your ngrok tunnel is active.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
      <SalonBackground 
        source={require('../../assets/images/luxury_salon_owner_admin_bg.png')} 
        overlayColor="rgba(10, 10, 12, 0.7)"
      />
      <View style={styles.headerContainer}>
        <View style={styles.headerInner}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.navigate('Home')}
          >
            <ArrowLeft size={22} color={Colors.secondary} />
          </TouchableOpacity>
          <View style={styles.headerMeta}>
            <View style={{ height: 4 }} />
            <Text 
              style={styles.businessText}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              OWNER ACCESS
            </Text>
          </View>
          <View style={styles.goldEdgeBottom} />
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >

        <View style={styles.header}>
          <View style={styles.circularLogoContainer}>
            <Image
              source={require('../../assets/images/logo.jpg')}
              style={styles.logo}
              contentFit="cover"
            />
          </View>
          <Text style={styles.title}>SECURE PORTAL</Text>
          <Text style={styles.subtitle}>SALON OPERATIONS & OWNER PORTAL</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.inputLabel}>ENTER ACCESS CODE</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="• • • •"
              placeholderTextColor="rgba(201, 161, 74, 0.2)"
              style={styles.input}
              value={accessCode}
              onChangeText={setAccessCode}
              keyboardType="numeric"
              secureTextEntry
              maxLength={4}
            />
            <KeySquare size={22} color={Colors.secondary} style={styles.inputIcon} />
          </View>

          <CustomButton
            title="GRANT ACCESS"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
            gradient={Colors.headerGradient}
          />

          <Text style={styles.hint}>This area is restricted to the salon owner only.</Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 30,
  },
  headerContainer: {
    paddingTop: 60,
    backgroundColor: 'transparent',
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  headerMeta: {
    flex: 1,
    marginLeft: 16,
  },
  businessText: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.secondary,
    letterSpacing: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 6,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(201, 161, 74, 0.1)',
  },
  goldEdgeBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: Colors.secondary,
    opacity: 0.15,
  },
  header: {
    alignItems: 'center',
    marginTop: height * 0.1,
    marginBottom: 50,
  },
  circularLogoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(201, 161, 74, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.secondary,
    overflow: 'hidden',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: 4,
    marginTop: 25,
  },
  subtitle: {
    fontSize: 10,
    color: Colors.textSecondary,
    letterSpacing: 2,
    marginTop: 8,
    opacity: 0.8,
  },
  form: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.secondary,
    letterSpacing: 2,
    marginBottom: 15,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 18,
    marginBottom: 24,
    paddingHorizontal: 24,
    height: 65,
    borderWidth: 1.5,
    borderColor: Colors.secondary,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  inputIcon: {
    position: 'absolute',
    left: 20,
  },
  input: {
    flex: 1,
    color: Colors.white,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 18,
    textAlign: 'center',
    paddingLeft: 0,
    textShadowColor: Colors.secondary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    backgroundColor: 'transparent',
  },
  loginButton: {
    marginTop: 10,
    height: 60,
  },
  hint: {
    fontSize: 10,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 30,
    lineHeight: 18,
    opacity: 0.6,
  },
});
