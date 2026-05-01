import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableOpacity,
  Alert 
} from 'react-native';
import { useAuth, UserRole } from '../context/AuthContext';
import { Colors } from '../theme/colors';
import { CustomButton } from '../components/CustomButton';
import { User, Lock, Mail } from 'lucide-react-native';

export const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const success = await signIn(email, password);
    setLoading(false);

    if (!success) {
      Alert.alert('Login Failed', 'Invalid email or password');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.title}>LUXURY</Text>
        <Text style={styles.subtitle}>SALON MANAGEMENT</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.welcomeText}>Welcome Back</Text>
        
        <View style={styles.inputContainer}>
          <Mail size={20} color={Colors.primary} style={styles.inputIcon} />
          <TextInput
            placeholder="Email Address"
            placeholderTextColor="rgba(245, 245, 220, 0.5)"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Lock size={20} color={Colors.primary} style={styles.inputIcon} />
          <TextInput
            placeholder="Password"
            placeholderTextColor="rgba(245, 245, 220, 0.5)"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <CustomButton 
          title="LOGIN" 
          onPress={handleLogin} 
          loading={loading}
          style={styles.loginButton}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don&apos;t have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.linkText}>Register Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text,
    letterSpacing: 4,
    marginTop: -5,
    opacity: 0.8,
  },
  form: {
    width: '100%',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 60,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0, 0.05)',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
  },
  loginButton: {
    marginTop: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: 'rgba(245, 245, 220, 0.7)',
    fontSize: 14,
  },
  linkText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
