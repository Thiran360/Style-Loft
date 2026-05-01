import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Clock, LogOut, Scissors, Settings, Sparkle, Upload, User, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Dimensions,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { CustomButton } from '../components/CustomButton';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../theme/colors';

const { width } = Dimensions.get('window');

export const StyleLoftEmployeeDashboard = () => {
  const { user, signOut, updateEmployeeProfile } = useAuth();
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [customAvatarUrl, setCustomAvatarUrl] = useState(user?.avatar || '');

  const handleSaveProfile = async () => {
    await updateEmployeeProfile(editedName, customAvatarUrl);
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Professional Deep Black Background */}
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: Colors.background }]} />

      {/* Subtle vignette overlay */}
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.header}>
        <View style={styles.headerLogoRow}>
          <Sparkle size={24} color={Colors.primary} fill={Colors.primary} />
          <Text style={styles.headerBrand}>STYLE LOFT</Text>
        </View>
        <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
          <LogOut size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Glass Card */}
        <View style={styles.profileCardWrapper}>
          <BlurView intensity={30} tint="dark" style={styles.profileGlassCard}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarOuterRing} />
              <View style={styles.avatarInnerRing}>
                <Image
                  source={{ uri: user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Stylist')}&background=1E1E1E&color=C8A27A&bold=true&size=256` }}
                  style={styles.avatar}
                  contentFit="cover"
                />
              </View>
              <TouchableOpacity
                style={styles.editBadge}
                onPress={() => {
                  setEditedName(user?.name || '');
                  setCustomAvatarUrl(user?.avatar || '');
                  setEditModalVisible(true);
                }}
              >
                <User size={14} color={Colors.background} />
              </TouchableOpacity>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.welcomeText}>WELCOME BACK,</Text>
              <Text style={styles.stylistName}>{user?.name?.toUpperCase() || 'STYLIST'}</Text>

              <View style={styles.badgesRow}>
                <View style={styles.statusBadge}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>ACTIVE SESSION</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setEditModalVisible(true)}
                  style={styles.settingsBadge}
                >
                  <Settings size={12} color={Colors.primary} />
                  <Text style={styles.settingsText}>SETTINGS</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </View>

        {/* Dashboard Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>MANAGEMENT HUB</Text>
          <View style={styles.sectionUnderline} />
        </View>

        <View style={styles.grid}>
          <TouchableOpacity style={styles.cardOuter} activeOpacity={0.8}>
            <BlurView intensity={30} tint="dark" style={styles.cardInner}>
              <View style={styles.cardIconBox}>
                <Scissors size={28} color={Colors.primary} />
              </View>
              <Text style={styles.cardLabel}>SERVICES</Text>
              <Text style={styles.cardSublabel}>Configure your catalog</Text>
            </BlurView>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cardOuter} activeOpacity={0.8}>
            <BlurView intensity={30} tint="dark" style={styles.cardInner}>
              <View style={styles.cardIconBox}>
                <Calendar size={28} color={Colors.primary} />
              </View>
              <Text style={styles.cardLabel}>SCHEDULE</Text>
              <Text style={styles.cardSublabel}>Manage appointments</Text>
            </BlurView>
          </TouchableOpacity>
        </View>

        <CustomButton
          title="START NEW SESSION"
          onPress={() => { }}
          style={styles.mainButton}
        />

        <View style={styles.footer}>
          <Clock size={14} color={Colors.textSecondary} />
          <Text style={styles.footerText}>Shift started 2h 15m ago</Text>
        </View>
      </ScrollView>

      {/* Profile Edit Modal */}
      <Modal
        visible={isEditModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <BlurView intensity={40} tint="dark" style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>EDIT PROFILE</Text>
                <View style={styles.modalTitleUnderline} />
              </View>
              <TouchableOpacity
                style={[styles.modalCloseBtn, { marginLeft: 20 }]}
                onPress={() => setEditModalVisible(false)}
              >
                <X size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>YOUR NAME</Text>
              <TextInput
                style={styles.input}
                value={editedName}
                onChangeText={setEditedName}
                placeholder="Enter your name"
                placeholderTextColor="rgba(201, 161, 74, 0.4)"
              />

              <Text style={styles.inputLabel}>DEVICE PHOTO</Text>
              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <Upload size={20} color={Colors.primary} />
                <Text style={styles.uploadButtonText}>
                  {customAvatarUrl ? 'Change Selected Photo' : 'Choose from Gallery'}
                </Text>
              </TouchableOpacity>

              {customAvatarUrl ? (
                <View style={styles.previewContainer}>
                  <Image source={{ uri: customAvatarUrl }} style={styles.previewImage} />
                  <TouchableOpacity
                    style={styles.removePhoto}
                    onPress={() => setCustomAvatarUrl('')}
                  >
                    <X size={16} color={Colors.text} />
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
          </BlurView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    height: 380,
    backgroundColor: Colors.background,
  },
  headerGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerBrand: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: 4,
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(201, 161, 74, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  profileCardWrapper: {
    marginVertical: 10,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: Colors.cardBorder,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: Colors.cardBorder,
    backgroundColor: Colors.surface,
  },
  profileGlassCard: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(201, 161, 74, 0.03)',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 20,
  },
  avatarOuterRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    top: -5,
    left: -5,
  },
  avatarInnerRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: Colors.primary,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  editBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: Colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
    elevation: 4,
  },
  profileInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 10,
    color: Colors.primary,
    letterSpacing: 3,
    fontWeight: '800',
    marginBottom: 4,
  },
  stylistName: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: 1,
    marginBottom: 12,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 0, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 0, 0.2)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00FF00',
    marginRight: 6,
  },
  statusText: {
    fontSize: 8,
    color: '#00FF00',
    fontWeight: '900',
    letterSpacing: 1,
  },
  settingsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(201, 161, 74, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 4,
  },
  settingsText: {
    fontSize: 8,
    color: Colors.primary,
    fontWeight: '900',
    letterSpacing: 1,
  },
  sectionHeader: {
    marginTop: 30,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: Colors.secondary,
    letterSpacing: 4,
  },
  sectionUnderline: {
    width: 30,
    height: 2,
    backgroundColor: Colors.primary,
    marginTop: 6,
  },
  grid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 30,
  },
  cardOuter: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(201, 161, 74, 0.2)',
  },
  cardInner: {
    padding: 20,
    alignItems: 'flex-start',
    height: '100%',
  },
  cardIconBox: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: 'rgba(123, 30, 58, 0.15)', // Wine Red tint
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(123, 30, 58, 0.3)',
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: 1,
    marginBottom: 4,
  },
  cardSublabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  mainButton: {
    height: 64,
    borderRadius: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    gap: 8,
    opacity: 0.6,
  },
  footerText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: Colors.background,
    width: '95%',
    borderRadius: 32,
    padding: 30,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
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
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: 4,
    marginBottom: 8,
  },
  modalTitleUnderline: {
    width: 40,
    height: 2,
    backgroundColor: Colors.secondary, // Changed from primary to gold
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: 3,
    marginBottom: 10,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 14,
    padding: 16,
    color: Colors.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(201, 161, 74, 0.25)',
    marginBottom: 20,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(200, 162, 122, 0.05)',
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: 20,
    borderStyle: 'dashed',
    gap: 10,
  },
  uploadButtonText: {
    color: Colors.primary,
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 1,
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
    borderColor: Colors.primary,
  },
  removePhoto: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  saveButton: {
    height: 60,
    marginBottom: 20,
    borderRadius: 14,
  },
});
