import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableOpacity,
  Alert,
  ScrollView 
} from 'react-native';
import { useAuth, UserRole } from '../context/AuthContext';
import { Colors } from '../theme/colors';
import { CustomButton } from '../components/CustomButton';
import { User, Lock, Mail, Briefcase } from 'lucide-react-native';

export const RegisterScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Employee');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const success = await signUp(name, email, password, role);
    setLoading(false);

    if (success) {
      Alert.alert('Success', 'Account created successfully!');
    } else {
      Alert.alert('Failed', 'Registration failed. Email might already be in use.');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ backgroundColor: Colors.background }}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={styles.title}>JOIN US</Text>
          <Text style={styles.subtitle}>CREATE YOUR ACCOUNT</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.roleContainer}>
            <TouchableOpacity 
              style={[styles.roleButton, role === 'Owner' && styles.roleButtonActive]}
              onPress={() => setRole('Owner')}
            >
              <Text style={[styles.roleText, role === 'Owner' && styles.roleTextActive]}>OWNER</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.roleButton, role === 'Employee' && styles.roleButtonActive]}
              onPress={() => setRole('Employee')}
            >
              <Text style={[styles.roleText, role === 'Employee' && styles.roleTextActive]}>EMPLOYEE</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <User size={20} color={Colors.primary} style={styles.inputIcon} />
            <TextInput
              placeholder="Full Name"
              placeholderTextColor="rgba(245, 245, 220, 0.5)"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          </View>
          
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
            title="REGISTER" 
            onPress={handleRegister} 
            loading={loading}
            style={styles.registerButton}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.linkText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: Colors.secondary,
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
  roleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginBottom: 24,
    padding: 6,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  roleButtonActive: {
    backgroundColor: Colors.primary,
  },
  roleText: {
    color: 'rgba(245, 245, 220, 0.5)',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 1,
  },
  roleTextActive: {
    color: Colors.white,
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
    borderColor: Colors.cardBorder,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
  },
  registerButton: {
    marginTop: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 40,
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
