import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, KeySquare, Upload, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { CustomButton } from '../components/CustomButton';
import { SalonBackground } from '../components/SalonBackground';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../theme/colors';

const { height } = Dimensions.get('window');

export const StylistLoginScreen = ({ route, navigation }: any) => {
  const { employee } = route.params;
  const { updateEmployeeProfile } = useAuth();

  const [currentEmployee, setCurrentEmployee] = useState(employee);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Edit Profile States
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editedName, setEditedName] = useState(employee.name);
  const [customAvatarUrl, setCustomAvatarUrl] = useState(employee.avatar || '');

  const handleSaveProfile = async () => {
    await updateEmployeeProfile(editedName, customAvatarUrl, currentEmployee.id);
    setCurrentEmployee({ ...currentEmployee, name: editedName, avatar: customAvatarUrl });
    setEditModalVisible(false);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setCustomAvatarUrl(result.assets[0].uri);
    }
  };

  const handleLogin = () => {
    if (!password) {
      Alert.alert('Access Required', 'Please enter your access code.');
      return;
    }

    setLoading(true);
    const correctPassword = currentEmployee.password;
    console.log('DEBUG: Attempting login for', currentEmployee.name);
    console.log('DEBUG: Input Password:', password);
    console.log('DEBUG: Correct Password:', correctPassword);
    
    setTimeout(() => {
      setLoading(false);
      // Strict string comparison
      if (password && correctPassword && password.toString().trim() === correctPassword.toString().trim()) {
        navigation.navigate('ServiceCategory');
      } else {
        console.log('DEBUG: Password mismatch!');
        Alert.alert('Invalid Code', 'The access code you entered is incorrect.');
        setPassword('');
      }
    }, 800);
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
      <SalonBackground 
        source={require('../../assets/images/employee_login_bg.png')} 
        overlayColor="rgba(10, 10, 12, 0.75)"
      />
      {/* Header with Back Button */}
      <View style={styles.headerContainer}>
        <View style={styles.headerInner}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
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
              STYLE LOFT
            </Text>
          </View>
          <View style={styles.goldEdgeBottom} />
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.circularLogoContainer}>
              <Image
                source={{
                  uri: currentEmployee.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(currentEmployee.name)}&background=1A1A1A&color=C9A14A&bold=true&size=256`,
                }}
                style={styles.logo}
                contentFit="cover"
              />
            </View>
            <Text style={styles.title}>{currentEmployee.name.toUpperCase()}</Text>
            
            <TouchableOpacity
              onPress={() => {
                setEditedName(currentEmployee.name);
                setCustomAvatarUrl(currentEmployee.avatar || '');
                setEditModalVisible(true);
              }}
              style={styles.editProfileTrigger}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={Colors.headerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.editProfileGradient}
              >
                <Text style={styles.editProfileText}>EDIT YOUR PROFILE</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <Text style={styles.inputLabel}>ENTER YOUR ACCESS CODE</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="• • • •"
                placeholderTextColor="rgba(201, 161, 74, 0.2)"
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                keyboardType="numeric"
                secureTextEntry
                maxLength={4}
              />
              <KeySquare size={22} color={Colors.secondary} style={styles.inputIcon} />
            </View>

            <CustomButton
              title="ENTER PORTAL"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
              gradient={Colors.headerGradient}
            />

            <Text style={styles.hint}>Please contact the salon owner if you forgot your code.</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={styles.modalContent}>
            <View style={StyleSheet.absoluteFill}>
              <Image
                source={require('../../assets/images/luxury_salon_bg.png')}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
              />
              <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
              <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(10, 10, 10, 0.6)' }]} />
            </View>

            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>EDIT YOUR PROFILE</Text>
                <View style={styles.modalTitleUnderline} />
              </View>
              <TouchableOpacity
                style={[styles.modalCloseBtn, { marginLeft: 20 }]}
                onPress={() => setEditModalVisible(false)}
              >
                <X size={18} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabelModal}>EMPLOYEE NAME</Text>
              <View style={styles.modalInputContainer}>
                <TextInput
                  style={styles.modalInput}
                  value={editedName}
                  onChangeText={setEditedName}
                  placeholder="Enter employee name"
                  placeholderTextColor="rgba(245,245,245,0.3)"
                />
              </View>

              <Text style={styles.inputLabelModal}>PUT ON</Text>
              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <Upload size={18} color={Colors.primary} />
                <Text style={styles.uploadButtonText}>
                  {customAvatarUrl ? 'CHANGE PHOTO' : 'CHOOSE FROM GALLERY'}
                </Text>
              </TouchableOpacity>

              {customAvatarUrl ? (
                <View style={styles.previewContainer}>
                  <Image source={{ uri: customAvatarUrl }} style={styles.previewImage} />
                  <TouchableOpacity
                    style={styles.removePhoto}
                    onPress={() => setCustomAvatarUrl('')}
                  >
                    <X size={14} color={Colors.text} />
                  </TouchableOpacity>
                </View>
              ) : null}

              <CustomButton
                title="SAVE CHANGES"
                onPress={handleSaveProfile}
                style={styles.saveButton}
                gradient={[Colors.primary, Colors.background]}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    letterSpacing: 10,
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
    marginTop: height * 0.05,
    marginBottom: 40,
  },
  circularLogoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(201, 161, 74, 0.4)',
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
    marginTop: 20,
    marginBottom: 10,
  },
  editProfileTrigger: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(201, 161, 74, 0.3)',
  },
  editProfileGradient: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editProfileText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },
  form: {
    width: '100%',
    paddingBottom: 40,
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '95%',
    borderRadius: 32,
    padding: 30,
    maxHeight: '88%',
    borderWidth: 1.5,
    borderColor: Colors.secondary,
    overflow: 'hidden',
    backgroundColor: Colors.background,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(201,161,74,0.4)',
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: 4,
    marginBottom: 8,
  },
  modalTitleUnderline: {
    width: 36,
    height: 2,
    backgroundColor: Colors.secondary,
    borderRadius: 1,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(201,161,74,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(201,161,74,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputLabelModal: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.secondary,
    letterSpacing: 2,
    marginBottom: 10,
  },
  modalInputContainer: {
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.secondary,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  modalInput: {
    backgroundColor: 'transparent',
    padding: 16,
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(201,161,74,0.08)',
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(201,161,74,0.3)',
    marginBottom: 20,
    borderStyle: 'dashed',
    gap: 10,
  },
  uploadButtonText: {
    color: Colors.secondary,
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 2,
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
    alignSelf: 'center',
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.secondary,
  },
  removePhoto: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  saveButton: {
    height: 58,
    marginBottom: 20,
    borderRadius: 14,
  },
});
