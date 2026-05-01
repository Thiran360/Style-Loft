import { BlurView } from 'expo-blur';
import * as FileSystem from 'expo-file-system/legacy';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import {
  ArrowLeft,
  Camera,
  Download,
  Edit2,
  Eye,
  EyeOff,
  History,
  LogOut,
  PlusCircle,
  Scissors,
  Search,
  Share2,
  Tag,
  Trash2,
  UserPlus,
  X
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Image as RNImage,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import Animated, {
  FadeInDown,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { useAuth } from '../context/AuthContext';
import { useServices } from '../context/ServiceContext';
import { Colors } from '../theme/colors';
import { SalonBackground } from '../components/SalonBackground';

const { width } = Dimensions.get('window');

export const OwnerDashboard = ({ navigation }: any) => {
  const { user, employees, signOut, addEmployee, updateEmployee, removeEmployee, fetchEmployees } = useAuth();
  const { services, updateServicePrice, updateServiceImage } = useServices();

  const [activeTab, setActiveTab] = useState<'employees' | 'services' | 'coupons' | 'orders'>('employees');

  // Employee Modal State
  const [empModalVisible, setEmpModalVisible] = useState(false);
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpPass, setNewEmpPass] = useState('');
  const [newEmpGender, setNewEmpGender] = useState('Male');


  // Employee Edit State
  const [editEmpModalVisible, setEditEmpModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [editEmpName, setEditEmpName] = useState('');
  const [editEmpEmail, setEditEmpEmail] = useState('');
  const [editEmpGender, setEditEmpGender] = useState('Male');


  const [serviceModalVisible, setServiceModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [editingPrice, setEditingPrice] = useState('');

  // Add Service State
  const [addServiceModalVisible, setAddServiceModalVisible] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState<string>('Men');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceImage, setNewServiceImage] = useState<string | null>(null);

  // Service Filtering & Search
  const [serviceCategory, setServiceCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Coupon State
  const [couponModalVisible, setCouponModalVisible] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('');

  // Booking Detail Modal State
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const { coupons, addCoupon, removeCoupon, toggleCouponVisibility, orders, removeOrder, addService, removeService, categories } = useServices();

  const breathing = useSharedValue(0);
  useEffect(() => {
    fetchEmployees(); // Sync staff list on mount
    breathing.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 5000 }),
        withTiming(0, { duration: 5000 })
      ),
      -1,
      true
    );
  }, []);

  const openBookingDetails = (booking: any) => {
    setSelectedBooking(booking);
    setBookingModalVisible(true);
  };

  const filteredServices = services.filter((service: any) => {
    const matchesCategory = serviceCategory === 'All' || service.category === serviceCategory;
    const safeName = service.name || '';
    const safeQuery = searchQuery || '';
    const matchesSearch = safeName.toLowerCase().includes(safeQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddEmployee = async () => {
    if (!newEmpName || !newEmpEmail || !newEmpPass || !newEmpGender) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newEmpEmail.length > 30) {
      Alert.alert('Email Too Long', 'The email address is too long. Maximum 30 characters allowed.');
      return;
    }

    await addEmployee(newEmpName, newEmpEmail, newEmpPass, newEmpGender);
    Alert.alert(
      'Success',
      'Employee added successfully',
      [{ 
        text: 'OK', 
        onPress: () => {
          setEmpModalVisible(false);
          setNewEmpName('');
          setNewEmpEmail('');
          setNewEmpPass('');
          setNewEmpGender('Male');

        }
      }]
    );
  };

  const openEmployeeEdit = (employee: any) => {
    setSelectedEmployee(employee);
    setEditEmpName(employee.name);
    setEditEmpEmail(employee.email);
    setEditEmpGender(employee.gender || 'Male');

    setEditEmpModalVisible(true);
  };

  const handleUpdateEmployee = async () => {
    if (!editEmpName || !editEmpEmail) {
      Alert.alert('Error', 'Please fill in name and email');
      return;
    }
    await updateEmployee(selectedEmployee.id, {
      name: editEmpName,
      email: editEmpEmail,
      gender: editEmpGender,

    });
    Alert.alert(
      'Success',
      'Employee updated successfully!',
      [{ text: 'OK', onPress: () => setEditEmpModalVisible(false) }]
    );
  };

  const handleRemoveEmployee = (employeeId: string | number, employeeName: string) => {
    Alert.alert(
      'Remove Employee',
      `Are you sure you want to remove ${employeeName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await removeEmployee(employeeId);
          }
        }
      ]
    );
  };















  const handleAddNewService = async () => {
    if (!newServiceName || !newServicePrice || !newServiceImage) {
      Alert.alert('Error', 'Please provide a name, price, and an image for the new service.');
      return;
    }
    await addService({
      name: newServiceName,
      category: newServiceCategory,
      price: newServicePrice.startsWith('₹') ? newServicePrice : `₹${newServicePrice}`,
      image: newServiceImage
    });
    Alert.alert(
      'Success',
      'New service added successfully!',
      [{
        text: 'OK',
        onPress: () => {
          setAddServiceModalVisible(false);
          setNewServiceName('');
          setNewServicePrice('');
          setNewServiceImage(null);
        }
      }]
    );
  };

  const handleRemoveService = (serviceId: string, serviceName: string) => {
    Alert.alert(
      'Remove Service',
      `Are you sure you want to remove ${serviceName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await removeService(serviceId);
          }
        }
      ]
    );
  };

  const handlePickNewServiceImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        setNewServiceImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const openServiceEdit = (service: any) => {
    setSelectedService(service);
    setEditingPrice(service.price.replace('₹', ''));
    setServiceModalVisible(true);
  };

  const handleUpdatePrice = async () => {
    if (!editingPrice || isNaN(Number(editingPrice))) {
      Alert.alert('Invalid Price', 'Please enter a valid numeric amount.');
      return;
    }
    await updateServicePrice(selectedService.id, `₹${editingPrice}`);
    Alert.alert(
      'Success',
      'Price updated successfully!',
      [{
        text: 'OK',
        onPress: () => {
          setServiceModalVisible(false);
        }
      }]
    );
  };

  const handleUpdateImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        await updateServiceImage(selectedService.id, result.assets[0].uri);
        // Update local state for immediate feedback
        setSelectedService({ ...selectedService, image: result.assets[0].uri });
        Alert.alert('Success', 'Image updated successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleDownloadPDF = async (action: 'download' | 'share' = 'download') => {
    if (!selectedBooking) return;

    let logoDataUrl = '';
    try {
      const assetSource = RNImage.resolveAssetSource(require('../../assets/images/logo.jpg'));
      const localLogoPath = FileSystem.documentDirectory + 'temp_pdf_logo.jpg';
      await FileSystem.downloadAsync(assetSource.uri, localLogoPath);
      const base64Logo = await FileSystem.readAsStringAsync(localLogoPath, { encoding: 'base64' });
      logoDataUrl = `data:image/jpeg;base64,${base64Logo}`;
    } catch (e) {
      console.log('Failed to load local logo for PDF. Falling back to default.');
      logoDataUrl = `https://ui-avatars.com/api/?name=Style+Loft&background=E75480&color=000&size=256`;
    }

    const html = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body { 
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
              padding: 40px; 
              color: #333;
              background-color: #fff;
            }
            .header { 
              text-align: center; 
              margin-bottom: 50px; 
              border-bottom: 2px solid #E75480;
              padding-bottom: 20px;
            }
            .title { 
              font-size: 32px; 
              font-weight: bold; 
              color: #000;
              letter-spacing: 4px;
              margin: 0;
            }
            .subtitle { 
              font-size: 14px; 
              color: #E75480; 
              font-weight: 700;
              margin-top: 5px;
            }
            .order-info { 
              margin-bottom: 40px; 
            }
            .row { 
              display: flex; 
              justify-content: space-between; 
              margin-bottom: 15px;
              border-bottom: 1px solid #1A1A1A;
              padding-bottom: 5px;
            }
            .label { 
              color: #A1A1AA; 
              font-size: 12px; 
              font-weight: 700;
              text-transform: uppercase;
            }
            .value { 
              font-weight: 600; 
              font-size: 16px; 
              color: #1A1A1A;
            }
            .total-box { 
              background-color: #FDF4F6; 
              padding: 25px; 
              border-radius: 12px; 
              text-align: center;
              margin-top: 40px;
              border: 1px solid #7B1E3A;
            }
            .total-label { 
              font-size: 12px; 
              font-weight: 900; 
              color: #7B1E3A;
              letter-spacing: 1px;
            }
            .total-value { 
              font-size: 36px; 
              font-weight: 900; 
              color: #7B1E3A;
              margin-top: 5px;
            }
            .footer { 
              text-align: center; 
              margin-top: 60px; 
              font-size: 12px; 
              color: #999;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div style="text-align: center; margin-bottom: 15px;">
              <img src="${logoDataUrl}" style="height: 120px; width: 120px; border-radius: 50%; object-fit: cover; border: 3px solid #7B1E3A; box-shadow: 0 4px 8px rgba(0,0,0,0.5);" alt="Style Loft Logo" />
            </div>
            <h1 class="title">STYLE LOFT</h1>
            <div class="subtitle">PREMIUM SALON EXPERIENCE</div>
          </div>
          
          <div class="order-info">
            <div class="row">
              <span class="label">Order ID</span>
              <span class="value">#${selectedBooking.id}</span>
            </div>
            <div class="row">
              <span class="label">Customer Name</span>
              <span class="value">${selectedBooking.customerName}</span>
            </div>
            <div class="row">
              <span class="label">Phone Number</span>
              <span class="value">${selectedBooking.customerPhone}</span>
            </div>
            <div class="row">
              <span class="label">Service</span>
              <span class="value">${selectedBooking.serviceName}</span>
            </div>
            <div class="row">
              <span class="label">Group Size</span>
              <span class="value">${selectedBooking.persons} People</span>
            </div>
            <div class="row">
              <span class="label">Date</span>
              <span class="value">${selectedBooking.date}</span>
            </div>
          </div>

          <div class="total-box">
            <div class="total-label">FINAL SETTLEMENT</div>
            <div class="total-value">${selectedBooking.totalAmount}</div>
          </div>

          <div class="footer">
            <p>Thank you for choosing Style Loft.</p>
            <p>This is a computer generated receipt.</p>
          </div>
        </body>
      </html>
    `;

    try {
      if (action === 'share') {
        const { uri } = await Print.printToFileAsync({ html });
        await Sharing.shareAsync(uri, {
          UTI: '.pdf',
          mimeType: 'application/pdf',
          dialogTitle: 'Share Receipt'
        });
      } else {
        // Direct print triggers the system "Save as PDF" natively, avoiding permission errors
        await Print.printAsync({ html });
      }
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to process PDF receipt.');
    }
  };

  const handleAddCoupon = async () => {
    if (!newCouponCode || !newCouponDiscount || isNaN(Number(newCouponDiscount))) {
      Alert.alert('Error', 'Please enter a valid code and numeric discount percentage.');
      return;
    }
    await addCoupon(newCouponCode, Number(newCouponDiscount));
    setCouponModalVisible(false);
    setNewCouponCode('');
    setNewCouponDiscount('');
    Alert.alert('Success', 'Coupon code added successfully');
  };

  const handleRemoveCoupon = (couponId: string, code: string) => {
    Alert.alert(
      'Remove Coupon',
      `Are you sure you want to remove coupon ${code}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await removeCoupon(couponId);
          }
        }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out of the Owner Portal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            signOut();
            navigation.navigate('Home');
          }
        }
      ]
    );
  };

  const handleRemoveOrder = (orderId: string) => {
    Alert.alert(
      'Remove Order',
      `Are you sure you want to remove this order?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await removeOrder(orderId);
          }
        }
      ]
    );
  };

  const renderEmployee = ({ item, index }: any) => {
    console.log("Staff item:", item);
    return (
      <Animated.View entering={FadeInDown.delay(index * 100)}>
      <TouchableOpacity
        style={styles.cardOuter}
        activeOpacity={0.9}
      >
        <BlurView intensity={35} tint="dark" style={styles.cardInner}>
          <View style={[styles.cardInfo, { justifyContent: 'space-between' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15, flex: 1 }}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{(item.name || '?').charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardName}>{item.name || 'Unnamed Staff'}</Text>
                <Text style={styles.cardSubtitle} numberOfLines={1}>{item.email}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <TouchableOpacity
                style={styles.editButtonSmall}
                onPress={() => openEmployeeEdit(item)}
              >
                <Edit2 size={16} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveEmployee(item.id, item.name)}
              >
                <Trash2 size={16} color="#FF4444" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.innerGlowSmall} pointerEvents="none" />
          <View style={styles.goldEdgeSmall} pointerEvents="none" />
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
    );
  };

  const renderService = ({ item, index }: any) => (
    <Animated.View entering={FadeInDown.delay(index * 100)}>
      <TouchableOpacity
        style={styles.cardOuter}
        activeOpacity={0.9}
        onPress={() => openServiceEdit(item)}
      >
        <BlurView intensity={35} tint="dark" style={styles.cardInner}>
          <View style={[styles.cardInfo, { justifyContent: 'space-between' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15, flex: 1 }}>
              <Image
                source={{ uri: item.image }}
                style={styles.serviceThumb}
                contentFit="cover"
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.categoryLabel}>{item.category.toUpperCase()}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={styles.priceContainer}>
                <Text style={styles.priceText}>{item.price}</Text>
              </View>
              <TouchableOpacity
                style={styles.editButtonSmall}
                onPress={() => openServiceEdit(item)}
              >
                <Edit2 size={16} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveService(item.id, item.name)}
              >
                <Trash2 size={16} color="#FF4444" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.innerGlowSmall} pointerEvents="none" />
          <View style={styles.goldEdgeSmall} pointerEvents="none" />
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderCoupon = ({ item, index }: any) => (
    <Animated.View entering={FadeInDown.delay(index * 100)}>
      <TouchableOpacity
        style={styles.cardOuter}
        activeOpacity={0.9}
      >
        <BlurView intensity={35} tint="dark" style={styles.cardInner}>
          <View style={styles.cardInfo}>
            <View style={styles.avatar}>
              <Tag size={20} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.cardName}>{item.code}</Text>
              <Text style={styles.cardSubtitle}>Unlock {item.discountPercentage}% Discount</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <TouchableOpacity
              style={styles.editButtonSmall}
              onPress={() => toggleCouponVisibility(item.id)}
            >
              {item.isVisible ? (
                <Eye size={16} color={Colors.secondary} />
              ) : (
                <EyeOff size={16} color="rgba(255, 255, 245, 0.2)" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveCoupon(item.id, item.code)}
            >
              <Trash2 size={16} color="#FF4444" />
            </TouchableOpacity>
          </View>
          <View style={styles.innerGlowSmall} pointerEvents="none" />
          <View style={styles.goldEdgeSmall} pointerEvents="none" />
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderOrder = ({ item, index }: any) => (
    <Animated.View entering={FadeInDown.delay(index * 100)}>
      <TouchableOpacity
        style={styles.cardOuter}
        onPress={() => openBookingDetails(item)}
        activeOpacity={0.9}
      >
        <BlurView intensity={35} tint="dark" style={styles.cardInner}>
          <View style={styles.cardInfo}>
            <View style={styles.avatar}>
              <History size={20} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardName}>{item.customerName}</Text>
              <View style={styles.orderLabelRow}>
                <Scissors size={10} color={Colors.textSecondary} />
                <Text style={styles.orderServiceText}>{item.serviceName}</Text>
              </View>
              <Text style={styles.orderDateText}>{item.date}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={[styles.priceContainer, { marginRight: 0 }]}>
                <Text style={styles.priceText}>{item.totalAmount}</Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveOrder(item.id)}
              >
                <Trash2 size={16} color="#FF4444" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.innerGlowSmall} pointerEvents="none" />
          <View style={styles.goldEdgeSmall} pointerEvents="none" />
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );

  const ServicesHeader = React.useMemo(() => {
    if (activeTab !== 'services') return null;
    return (
      <View style={styles.servicesHeader}>
        {/* Category Filter */}
        <View style={styles.filterRow}>
          {(['All', ...categories.map(c => c.name)]).map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setServiceCategory(cat)}
              style={[styles.filterChip, serviceCategory === cat && styles.activeFilterChip]}
              activeOpacity={0.8}
            >
              {serviceCategory === cat ? (
                <LinearGradient
                  colors={Colors.headerGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.filterChipGradient}
                >
                  <Text style={styles.activeFilterText}>{cat}</Text>
                </LinearGradient>
              ) : (
                <Text style={styles.filterText}>{cat}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Search Bar */}
        <View style={styles.searchBox}>
          <Search size={18} color="rgba(201, 161, 74, 0.6)" />
          <TextInput
            placeholder="Search hairstyles, services..."
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color={Colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }, [activeTab, serviceCategory, searchQuery]);

  return (
    <View style={styles.container}>
      <SalonBackground 
        source={require('../../assets/images/luxury_salon_owner_admin_bg.png')} 
      />
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerInner}>
          <TouchableOpacity onPress={() => navigation.navigate('AdminLogin')} style={styles.backBtn}>
            <ArrowLeft size={22} color={Colors.secondary} />
          </TouchableOpacity>
          <View style={styles.headerMeta}>
            <View style={{ height: 4 }} />
            <Text style={styles.businessText} numberOfLines={1} adjustsFontSizeToFit>OWNER DASHBOARD</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <LogOut size={20} color={Colors.error} />
          </TouchableOpacity>
          <View style={styles.goldEdgeBottom} />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScrollContent}
        >
          {(['employees', 'services', 'coupons', 'orders'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={styles.tabOuter}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.8}
            >
              <BlurView
                intensity={activeTab === tab ? 50 : 20}
                tint="dark"
                style={[styles.tabInner, activeTab === tab && styles.activeTabBorder]}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                  {tab.toUpperCase()}
                </Text>
                {activeTab === tab && <View style={styles.activeTabIndicator} />}
                <View style={styles.innerGlowSmall} pointerEvents="none" />
              </BlurView>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Summary Stat */}
      <Animated.View entering={FadeInDown.delay(200)} style={styles.summaryContainer}>
        <BlurView intensity={35} tint="dark" style={styles.summaryInner}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>
              {activeTab === 'employees'
                ? employees.length
                : activeTab === 'services'
                  ? filteredServices.length
                  : activeTab === 'coupons'
                    ? coupons.length
                    : orders.length}
            </Text>
            <Text style={styles.summaryLabel}>
              BUSINESS PULSE • {activeTab.toUpperCase()}
            </Text>
          </View>
          {activeTab !== 'orders' && (
            <TouchableOpacity
              onPress={() => {
                if (activeTab === 'employees') setEmpModalVisible(true);
                else if (activeTab === 'coupons') setCouponModalVisible(true);
                else if (activeTab === 'services') setAddServiceModalVisible(true);
              }}
              activeOpacity={0.8}
              style={styles.actionBtnOuter}
            >
              <LinearGradient
                colors={Colors.headerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionBtnGradient}
              >
                <PlusCircle size={18} color={Colors.white} />
                <Text style={styles.actionBtnText}>
                  ADD {activeTab === 'employees' ? 'STAFF' : activeTab === 'coupons' ? 'COUPON' : activeTab === 'services' ? 'SERVICE' : 'NEW'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
          <View style={styles.innerGlow} pointerEvents="none" />
          <View style={styles.goldEdge} pointerEvents="none" />
        </BlurView>
      </Animated.View>

      {/* List content */}
      <FlatList
        data={
          activeTab === 'employees'
            ? [...employees].reverse()
            : activeTab === 'services'
              ? filteredServices
              : activeTab === 'coupons'
                ? coupons
                : orders
        }
        keyExtractor={(item: any, index: number) => item?.id?.toString() || index.toString()}
        renderItem={
          activeTab === 'employees'
            ? renderEmployee
            : activeTab === 'services'
              ? renderService
              : activeTab === 'coupons'
                ? renderCoupon
                : renderOrder
        }
        ListHeaderComponent={ServicesHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No items found.</Text>
          </View>
        }
      />

      {/* Add Team Member Modal */}
      <Modal visible={empModalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <View style={[styles.modalBody, { maxHeight: '80%', overflow: 'hidden' }]}>
                <SalonBackground 
                  source={require('../../assets/images/luxury_salon_bg.png')} 
                  opacity={0.6}
                />
                <ScrollView 
                  showsVerticalScrollIndicator={false} 
                  bounces={true}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
                >
                  <View style={styles.modalHeaderRow}>
                    <View style={styles.modalHeaderTitleBox}>
                      <UserPlus size={24} color={Colors.primary} />
                      <Text style={styles.modalHeaderText}>NEW TEAM MEMBER</Text>
                    </View>
                    <TouchableOpacity onPress={() => setEmpModalVisible(false)} style={styles.modalCloseBtnInline}>
                      <X size={20} color={Colors.error} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.formSection}>
                    <Text style={styles.inputLabel}>NAME</Text>
                    <View style={styles.modalInputWrapper}>
                      <TextInput
                        placeholder="Enter stylist name"
                        placeholderTextColor="rgba(245, 245, 245, 0.5)"
                        style={styles.modalInput}
                        value={newEmpName}
                        onChangeText={setNewEmpName}
                        autoFocus
                      />
                      <View style={[styles.inputCorner, styles.cornerTopLeft]} />
                      <View style={[styles.inputCorner, styles.cornerTopRight]} />
                      <View style={[styles.inputCorner, styles.cornerBottomLeft]} />
                      <View style={[styles.inputCorner, styles.cornerBottomRight]} />
                    </View>
                  </View>

                  <View style={styles.formSection}>
                    <Text style={styles.inputLabel}>GENDER</Text>
                    <View style={styles.genderRow}>
                      {['Male', 'Female', 'Other'].map((g) => (
                        <TouchableOpacity
                          key={g}
                          onPress={() => setNewEmpGender(g)}
                          style={[
                            styles.genderChip,
                            newEmpGender === g && styles.activeGenderChip
                          ]}
                          activeOpacity={0.8}
                        >
                          {newEmpGender === g ? (
                            <LinearGradient
                              colors={Colors.headerGradient}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 1 }}
                              style={styles.genderChipGradient}
                            >
                              <Text style={styles.activeGenderText}>{g}</Text>
                            </LinearGradient>
                          ) : (
                            <Text style={styles.genderText}>{g}</Text>
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.formSection}>
                    <Text style={styles.inputLabel}>EMAIL ID</Text>
                    <View style={styles.modalInputWrapper}>
                      <TextInput
                        placeholder="email@styleloft.com"
                        placeholderTextColor="rgba(245, 245, 245, 0.5)"
                        style={styles.modalInput}
                        value={newEmpEmail}
                        onChangeText={setNewEmpEmail}
                        autoCapitalize="none"
                      />
                      <View style={[styles.inputCorner, styles.cornerTopLeft]} />
                      <View style={[styles.inputCorner, styles.cornerTopRight]} />
                      <View style={[styles.inputCorner, styles.cornerBottomLeft]} />
                      <View style={[styles.inputCorner, styles.cornerBottomRight]} />
                    </View>
                  </View>

                  <View style={styles.formSection}>
                    <Text style={styles.inputLabel}>PASSWORD</Text>
                    <View style={styles.modalInputWrapper}>
                      <TextInput
                        placeholder="Set 4-digit code"
                        placeholderTextColor="rgba(245, 245, 245, 0.5)"
                        style={styles.modalInput}
                        value={newEmpPass}
                        onChangeText={setNewEmpPass}
                        secureTextEntry
                        keyboardType="numeric"
                        maxLength={4}
                      />
                      <View style={[styles.inputCorner, styles.cornerTopLeft]} />
                      <View style={[styles.inputCorner, styles.cornerTopRight]} />
                      <View style={[styles.inputCorner, styles.cornerBottomLeft]} />
                      <View style={[styles.inputCorner, styles.cornerBottomRight]} />
                    </View>
                  </View>

                  <View style={styles.modalFooter}>
                    <TouchableOpacity onPress={() => setEmpModalVisible(false)} style={styles.receiptCancelBtn}>
                      <Text style={styles.receiptCancelTxt}>ABORT</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleAddEmployee} style={styles.receiptConfirmBtn}>
                      <LinearGradient
                        colors={Colors.headerGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.receiptConfirmGradient}
                      >
                        <Text style={styles.receiptConfirmTxt}>REGISTER STAFF</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      {/* Edit Team Member Modal */}
      <Modal visible={editEmpModalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <View style={[styles.modalBody, { maxHeight: '80%', overflow: 'hidden' }]}>
                <SalonBackground 
                  source={require('../../assets/images/luxury_salon_bg.png')} 
                  opacity={0.6}
                />
                <ScrollView 
                  showsVerticalScrollIndicator={false} 
                  bounces={true}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
                >
                  <View style={styles.modalHeaderRow}>
                    <View style={styles.modalHeaderTitleBox}>
                      <Edit2 size={24} color={Colors.primary} />
                      <Text style={styles.modalHeaderText}>EDIT TEAM MEMBER</Text>
                    </View>
                    <TouchableOpacity onPress={() => setEditEmpModalVisible(false)} style={styles.modalCloseBtnInline}>
                      <X size={20} color={Colors.error} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.formSection}>
                    <Text style={styles.inputLabel}>NAME</Text>
                    <View style={styles.modalInputWrapper}>
                      <TextInput
                        placeholder="Enter stylist name"
                        placeholderTextColor="rgba(245, 245, 245, 0.5)"
                        style={styles.modalInput}
                        value={editEmpName}
                        onChangeText={setEditEmpName}
                      />
                      <View style={[styles.inputCorner, styles.cornerTopLeft]} />
                      <View style={[styles.inputCorner, styles.cornerTopRight]} />
                      <View style={[styles.inputCorner, styles.cornerBottomLeft]} />
                      <View style={[styles.inputCorner, styles.cornerBottomRight]} />
                    </View>
                  </View>

                  <View style={styles.formSection}>
                    <Text style={styles.inputLabel}>GENDER</Text>
                    <View style={styles.genderRow}>
                      {['Male', 'Female', 'Other'].map((g) => (
                        <TouchableOpacity
                          key={g}
                          onPress={() => setEditEmpGender(g)}
                          style={[
                            styles.genderChip,
                            editEmpGender === g && styles.activeGenderChip
                          ]}
                          activeOpacity={0.8}
                        >
                          {editEmpGender === g ? (
                            <LinearGradient
                              colors={Colors.headerGradient}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 1 }}
                              style={styles.genderChipGradient}
                            >
                              <Text style={styles.activeGenderText}>{g}</Text>
                            </LinearGradient>
                          ) : (
                            <Text style={styles.genderText}>{g}</Text>
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.formSection}>
                    <Text style={styles.inputLabel}>EMAIL ID</Text>
                    <View style={styles.modalInputWrapper}>
                      <TextInput
                        placeholder="email@styleloft.com"
                        placeholderTextColor="rgba(245, 245, 245, 0.5)"
                        style={styles.modalInput}
                        value={editEmpEmail}
                        onChangeText={setEditEmpEmail}
                        autoCapitalize="none"
                      />
                      <View style={[styles.inputCorner, styles.cornerTopLeft]} />
                      <View style={[styles.inputCorner, styles.cornerTopRight]} />
                      <View style={[styles.inputCorner, styles.cornerBottomLeft]} />
                      <View style={[styles.inputCorner, styles.cornerBottomRight]} />
                    </View>
                  </View>

                  <View style={styles.modalFooter}>
                    <TouchableOpacity onPress={() => setEditEmpModalVisible(false)} style={styles.receiptCancelBtn}>
                      <Text style={styles.receiptCancelTxt}>CANCEL</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleUpdateEmployee} style={styles.receiptConfirmBtn}>
                      <LinearGradient
                        colors={Colors.headerGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.receiptConfirmGradient}
                      >
                        <Text style={styles.receiptConfirmTxt}>SAVE CHANGES</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      {/* Edit Service Modal */}
      <Modal visible={serviceModalVisible} animationType="fade" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <View style={[styles.modalBody, { maxHeight: '80%', overflow: 'hidden' }]}>
                <SalonBackground 
                  source={require('../../assets/images/luxury_salon_bg.png')} 
                  opacity={0.6}
                />
                <ScrollView 
                  showsVerticalScrollIndicator={false} 
                  bounces={true}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
                >
                  <View style={styles.modalHeaderRow}>
                    <View style={styles.modalHeaderTitleBox}>
                      <Scissors size={24} color={Colors.primary} />
                      <Text style={styles.modalHeaderText}>UPDATE PRICING</Text>
                    </View>
                    <TouchableOpacity onPress={() => setServiceModalVisible(false)} style={styles.modalCloseBtnInline}>
                      <X size={20} color={Colors.error} />
                    </TouchableOpacity>
                  </View>

                  {selectedService && (
                    <>
                      <View style={styles.receiptImageContainer}>
                        <Image
                          source={{ uri: selectedService.image }}
                          style={styles.receiptPreview}
                          contentFit="cover"
                        />
                        <TouchableOpacity style={styles.pickImageBtnOuter} onPress={handleUpdateImage}>
                          <LinearGradient
                            colors={Colors.headerGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.pickImageBtn}
                          >
                            <Camera size={18} color={Colors.secondary} />
                            <Text style={[styles.pickImageTxt, { color: Colors.text }]}>CHANGE IMAGE</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>

                      <View style={styles.formSection}>
                        <Text style={styles.inputLabel}>SERVICE TITLE</Text>
                        <Text style={styles.receiptTitleText}>{selectedService.name}</Text>
                        <Text style={styles.receiptCategoryText}>{selectedService.category.toUpperCase()} COLLECTION</Text>
                      </View>

                      <View style={styles.formSection}>
                        <Text style={styles.inputLabel}>NEW PRICE (INR)</Text>
                        <View style={styles.modalInputWrapper}>
                          <TextInput
                            placeholder="e.g. ₹250"
                            placeholderTextColor="rgba(245, 245, 245, 0.5)"
                            style={styles.modalInput}
                            keyboardType="numeric"
                            value={editingPrice}
                            onChangeText={setEditingPrice}
                            autoFocus
                          />
                          <View style={[styles.inputCorner, styles.cornerTopLeft]} />
                          <View style={[styles.inputCorner, styles.cornerTopRight]} />
                          <View style={[styles.inputCorner, styles.cornerBottomLeft]} />
                          <View style={[styles.inputCorner, styles.cornerBottomRight]} />
                        </View>
                      </View>

                      <View style={styles.modalFooter}>
                        <TouchableOpacity onPress={() => setServiceModalVisible(false)} style={styles.receiptCancelBtn}>
                          <Text style={styles.receiptCancelTxt}>ABORT</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleUpdatePrice} style={styles.receiptConfirmBtn}>
                          <LinearGradient
                            colors={Colors.headerGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.receiptConfirmGradient}
                          >
                            <Text style={styles.receiptConfirmTxt}>UPDATE PRICING</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </ScrollView>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      {/* Add New Service Modal */}
      <Modal visible={addServiceModalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <View style={[styles.modalBody, { maxHeight: '85%', overflow: 'hidden' }]}>
                <SalonBackground 
                  source={require('../../assets/images/luxury_salon_bg.png')} 
                  opacity={0.6}
                />
                <View style={styles.modalHeaderRow}>
                  <View style={styles.modalHeaderTitleBox}>
                    <PlusCircle size={24} color={Colors.primary} />
                    <Text style={styles.modalHeaderText}>NEW SERVICE ENTRY</Text>
                  </View>
                  <TouchableOpacity onPress={() => setAddServiceModalVisible(false)} style={styles.modalCloseBtnInline}>
                    <X size={20} color={Colors.error} />
                  </TouchableOpacity>
                </View>

                <ScrollView 
                  showsVerticalScrollIndicator={false} 
                  contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
                  keyboardShouldPersistTaps="handled"
                >
                  <View style={styles.receiptImageContainer}>
                    {newServiceImage ? (
                      <Image
                        source={{ uri: newServiceImage }}
                        style={styles.receiptPreview}
                        contentFit="cover"
                      />
                    ) : (
                      <View style={styles.receiptPreviewPlaceholder}>
                        <Scissors size={32} color={Colors.primary} />
                        <Text style={styles.placeholderText}>NO IMAGE SELECTED</Text>
                      </View>
                    )}
                    <TouchableOpacity style={styles.pickImageBtnOuter} onPress={handlePickNewServiceImage}>
                      <LinearGradient
                        colors={Colors.headerGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.pickImageBtn}
                      >
                        <Camera size={18} color={Colors.secondary} />
                        <Text style={[styles.pickImageTxt, { color: Colors.text }]}>{newServiceImage ? 'UPDATE PHOTO' : 'UPLOAD PHOTO'}</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.formSection}>
                    <Text style={styles.inputLabel}>SERVICE TITLE</Text>
                    <View style={styles.modalInputWrapper}>
                      <TextInput
                        placeholder="Enter service name"
                        placeholderTextColor="rgba(245, 245, 245, 0.5)"
                        style={styles.modalInput}
                        value={newServiceName}
                        onChangeText={setNewServiceName}
                      />
                      <View style={[styles.inputCorner, styles.cornerTopLeft]} />
                      <View style={[styles.inputCorner, styles.cornerTopRight]} />
                      <View style={[styles.inputCorner, styles.cornerBottomLeft]} />
                      <View style={[styles.inputCorner, styles.cornerBottomRight]} />
                    </View>
                  </View>

                  <View style={styles.formSection}>
                    <Text style={styles.inputLabel}>CATEGORY</Text>
                    <View style={styles.genderRow}>
                      {['Men', 'Women', 'Kids'].map((cat) => (
                        <TouchableOpacity
                          key={cat}
                          onPress={() => setNewServiceCategory(cat)}
                          style={[
                            styles.genderChip,
                            newServiceCategory === cat && styles.activeGenderChip
                          ]}
                          activeOpacity={0.8}
                        >
                          {newServiceCategory === cat ? (
                            <LinearGradient
                              colors={Colors.headerGradient}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 1 }}
                              style={styles.genderChipGradient}
                            >
                              <Text style={styles.activeGenderText}>{cat}</Text>
                            </LinearGradient>
                          ) : (
                            <Text style={styles.genderText}>{cat}</Text>
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.formSection}>
                    <Text style={styles.inputLabel}>BASE PRICE (INR)</Text>
                    <View style={styles.modalInputWrapper}>
                      <TextInput
                        placeholder="e.g. 500"
                        placeholderTextColor="rgba(245, 245, 245, 0.5)"
                        style={styles.modalInput}
                        value={newServicePrice}
                        onChangeText={setNewServicePrice}
                        keyboardType="numeric"
                      />
                      <View style={[styles.inputCorner, styles.cornerTopLeft]} />
                      <View style={[styles.inputCorner, styles.cornerTopRight]} />
                      <View style={[styles.inputCorner, styles.cornerBottomLeft]} />
                      <View style={[styles.inputCorner, styles.cornerBottomRight]} />
                    </View>
                  </View>

                  <View style={styles.modalFooter}>
                    <TouchableOpacity onPress={() => setAddServiceModalVisible(false)} style={styles.receiptCancelBtn}>
                      <Text style={styles.receiptCancelTxt}>ABORT</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleAddNewService} style={styles.receiptConfirmBtn}>
                      <LinearGradient
                        colors={Colors.headerGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.receiptConfirmGradient}
                      >
                        <Text style={styles.receiptConfirmTxt}>PUBLISH SERVICE</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      {/* Add Coupon Modal */}
      <Modal visible={couponModalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <View style={[styles.modalBody, { maxHeight: '80%', overflow: 'hidden' }]}>
                <SalonBackground 
                  source={require('../../assets/images/luxury_salon_bg.png')} 
                  opacity={0.6}
                />
                <ScrollView 
                  showsVerticalScrollIndicator={false} 
                  bounces={true}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
                >
                  <View style={styles.modalHeaderRow}>
                    <View style={styles.modalHeaderTitleBox}>
                      <Tag size={20} color={Colors.primary} />
                      <Text style={styles.modalHeaderText}>NEW VOUCHER</Text>
                    </View>
                    <TouchableOpacity onPress={() => setCouponModalVisible(false)} style={styles.modalCloseBtnInline}>
                      <X size={20} color={Colors.error} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.formSection}>
                    <Text style={styles.inputLabel}>COUPON CODE</Text>
                    <View style={styles.modalInputWrapper}>
                      <TextInput
                        placeholder="e.g. SAVE50"
                        placeholderTextColor="rgba(245, 245, 245, 0.5)"
                        style={styles.modalInput}
                        value={newCouponCode}
                        onChangeText={setNewCouponCode}
                        autoCapitalize="characters"
                        autoFocus
                      />
                      <View style={[styles.inputCorner, styles.cornerTopLeft]} />
                      <View style={[styles.inputCorner, styles.cornerTopRight]} />
                      <View style={[styles.inputCorner, styles.cornerBottomLeft]} />
                      <View style={[styles.inputCorner, styles.cornerBottomRight]} />
                    </View>
                  </View>

                  <View style={styles.formSection}>
                    <Text style={styles.inputLabel}>DISCOUNT PERCENTAGE</Text>
                    <View style={styles.modalInputWrapper}>
                      <TextInput
                        placeholder="e.g. 15"
                        placeholderTextColor="rgba(245, 245, 245, 0.5)"
                        style={styles.modalInput}
                        keyboardType="numeric"
                        value={newCouponDiscount}
                        onChangeText={setNewCouponDiscount}
                      />
                      <View style={[styles.inputCorner, styles.cornerTopLeft]} />
                      <View style={[styles.inputCorner, styles.cornerTopRight]} />
                      <View style={[styles.inputCorner, styles.cornerBottomLeft]} />
                      <View style={[styles.inputCorner, styles.cornerBottomRight]} />
                    </View>
                  </View>

                  <View style={styles.modalFooter}>
                    <TouchableOpacity onPress={() => setCouponModalVisible(false)} style={styles.receiptCancelBtn}>
                      <Text style={styles.receiptCancelTxt}>ABORT</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleAddCoupon} style={styles.receiptConfirmBtn}>
                      <LinearGradient
                        colors={Colors.headerGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.receiptConfirmGradient}
                      >
                        <Text style={styles.receiptConfirmTxt}>CREATE CODE</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      {/* Booking Detail Modal */}
      <Modal visible={bookingModalVisible} animationType="fade" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <View style={[styles.modalBody, { maxHeight: '90%', padding: 0, overflow: 'hidden' }]}>
                <SalonBackground 
                  source={require('../../assets/images/luxury_salon_bg.png')} 
                  opacity={0.6}
                />
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                  contentContainerStyle={{ padding: 32 }}
                >
                  <View style={styles.modalHeaderRow}>
                    <View style={styles.modalHeaderTitleBox}>
                      <View>
                        <Text style={styles.modalHeaderText}>ORDER RECEIPT</Text>
                        <Text style={{ fontSize: 10, color: Colors.secondary, letterSpacing: 2 }}>{selectedBooking?.date}</Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => setBookingModalVisible(false)} style={styles.modalCloseBtnInline}>
                      <X size={20} color={Colors.error} />
                    </TouchableOpacity>
                  </View>

                  {selectedBooking && (
                    <View style={styles.detailContent}>
                      <View style={[styles.cardOuter, { borderColor: Colors.secondary, borderWidth: 2 }]}>
                        <View style={{ padding: 20 }}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 2, borderBottomColor: Colors.secondary, paddingBottom: 15, marginBottom: 15 }}>
                            <View style={{ flex: 1 }}>
                              <Text style={styles.detailLabel}>CLIENT NAME</Text>
                              <Text style={[styles.detailValue, { fontSize: 18 }]}>{selectedBooking.customerName}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                              <Text style={styles.detailLabel}>CONTACT</Text>
                              <Text style={styles.detailValue}>{selectedBooking.customerPhone}</Text>
                            </View>
                          </View>

                          <View style={{ marginBottom: 15 }}>
                            <Text style={styles.detailLabel}>SERVICE RENDERED</Text>
                            <View style={[styles.serviceTag, { backgroundColor: 'rgba(201, 161, 74, 0.1)', alignSelf: 'flex-start', marginTop: 8 }]}>
                              <Scissors size={14} color={Colors.primary} />
                              <Text style={[styles.serviceTagText, { color: Colors.primary }]}>{selectedBooking.serviceName}</Text>
                            </View>
                          </View>

                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10 }}>
                            <View>
                              <Text style={styles.detailLabel}>PERSONS</Text>
                              <Text style={styles.detailValue}>{selectedBooking.persons}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                              <Text style={styles.detailLabel}>ORDER ID</Text>
                              <Text style={[styles.detailValue, { color: 'rgba(201, 161, 74, 0.4)' }]}>#{selectedBooking.id?.toString().substring(0, 8)}</Text>
                            </View>
                          </View>
                        </View>
                      </View>

                      <View style={styles.totalDetailBox}>
                        <Text style={styles.totalDetailLabel}>TOTAL SETTLEMENT</Text>
                        <Text style={[styles.totalDetailValue, { color: Colors.text, fontSize: 32 }]}>{selectedBooking.totalAmount}</Text>
                        <View style={styles.innerGlow} />
                        <View style={styles.goldEdge} />
                      </View>

                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 20, marginBottom: 20 }}>
                        <TouchableOpacity style={{ flex: 1 }} onPress={() => handleDownloadPDF('download')}>
                          <LinearGradient
                            colors={Colors.headerGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={[styles.receiptConfirmGradient, { height: 54, borderRadius: 16 }]}
                          >
                            <Download size={18} color={Colors.white} />
                            <Text style={[styles.receiptConfirmTxt, { fontSize: 12 }]}>DOWNLOAD</Text>
                          </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity 
                          style={{ flex: 1, height: 54, borderRadius: 16, overflow: 'hidden' }} 
                          onPress={() => handleDownloadPDF('share')}
                        >
                          <LinearGradient
                            colors={Colors.headerGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 8 }}
                          >
                            <Share2 size={18} color={Colors.white} />
                            <Text style={{ color: Colors.white, fontSize: 12, fontWeight: '900', letterSpacing: 1 }}>SHARE</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </ScrollView>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
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
    justifyContent: 'space-between',
  },
  headerMeta: {
    flex: 1,
    marginLeft: 16,
  },
  welcomeText: {
    fontSize: 9,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: 4,
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
  logoutBtn: {
    padding: 10,
  },
  editButtonSmall: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(201, 161, 74, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(201, 161, 74, 0.3)',
  },
  removeButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(201, 161, 74, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(201, 161, 74, 0.3)',
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

  tabsContainer: {
    marginTop: 20,
  },
  tabScrollContent: {
    paddingHorizontal: 24,
    gap: 12,
    paddingBottom: 4,
  },
  tabOuter: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(201, 161, 74, 0.2)',
  },
  tabInner: {
    height: 48,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  activeTabBorder: {
    borderColor: 'rgba(123, 30, 58, 0.3)',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '60%',
    height: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 4,
  },
  tabText: {
    fontSize: 10,
    fontWeight: '900',
    color: 'rgba(245, 245, 245, 1)',
    letterSpacing: 2,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '900',
  },

  summaryContainer: {
    marginHorizontal: 24,
    marginTop: 24,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(201, 161, 74, 0.5)',
  },
  summaryInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
  },
  summaryItem: {
    flex: 1,
  },
  summaryValue: {
    fontSize: 34,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: -1,
  },
  summaryLabel: {
    fontSize: 9,
    color: 'rgba(201, 161, 74, 0.8)',
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 2,
  },
  actionBtnOuter: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  actionBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    gap: 10,
  },
  actionBtnText: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 1.5,
  },

  listContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 120,
  },
  cardOuter: {
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(201, 161, 74, 0.4)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 22,
    backgroundColor: 'transparent',
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(201, 161, 74, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(201, 161, 74, 0.1)',
  },
  avatarText: {
    color: Colors.primary,
    fontWeight: '900',
    fontSize: 20,
  },
  serviceThumb: {
    width: 54,
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(201, 161, 74, 0.1)',
  },
  cardName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  cardSubtitle: {
    color: 'rgba(245, 245, 245, 0.7)',
    fontSize: 12,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  categoryLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: 'rgba(245, 245, 245, 0.8)',
    letterSpacing: 1.5,
    marginTop: 4,
  },
  priceContainer: {
    backgroundColor: 'rgba(201, 161, 74, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(201, 161, 74, 0.3)',
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '900',
  },
  orderLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  orderServiceText: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  orderDateText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
    marginTop: 8,
    letterSpacing: 1,
  },


  servicesHeader: {
    marginBottom: 20,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(201, 161, 74, 0.1)',
  },
  activeFilterChip: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderColor: 'rgba(123, 30, 58, 0.5)',
    overflow: 'hidden',
    elevation: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  filterChipGradient: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterText: {
    fontSize: 11,
    fontWeight: '900',
    color: 'rgba(245, 245, 245, 0.8)',
    letterSpacing: 1,
  },
  activeFilterText: {
    color: Colors.white,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    paddingHorizontal: 18,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(201, 161, 74, 0.6)',
  },
  searchInput: {
    flex: 1,
    color: Colors.white,
    fontSize: 14,
    marginLeft: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  emptyState: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    color: 'rgba(201, 161, 74, 0.7)',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    padding: 24,
  },
  modalBody: {
    backgroundColor: '#0A0A0A',
    padding: 32,
    borderRadius: 45,
    borderWidth: 2.5,
    borderColor: 'rgba(201, 161, 74, 0.95)',
    maxHeight: '85%',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(201, 161, 74, 0.2)',
  },
  modalHeaderTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 45
  },
  modalCloseBtnInline: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalHeaderText: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.text, // Soft White Headers
    letterSpacing: 4,
  },
  formSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.secondary,
    letterSpacing: 3,
    marginBottom: 10,
    marginLeft: 4,
  },
  modalInputWrapper: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1.5,
    borderColor: 'rgba(201, 161, 74, 0.3)',
  },
  modalInput: {
    height: 64,
    paddingHorizontal: 22,
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: 'transparent',
  },
  inputCorner: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderColor: Colors.secondary,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 2.5,
    borderLeftWidth: 2.5,
    borderTopLeftRadius: 16,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 2.5,
    borderRightWidth: 2.5,
    borderTopRightRadius: 16,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 2.5,
    borderLeftWidth: 2.5,
    borderBottomLeftRadius: 16,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 2.5,
    borderRightWidth: 2.5,
    borderBottomRightRadius: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 10,
  },
  receiptCancelBtn: {
    flex: 1,
    height: 64,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(201, 161, 74, 0.1)',
  },
  receiptCancelTxt: {
    fontSize: 11,
    fontWeight: '900',
    color: 'rgba(201, 161, 74, 0.8)',
    letterSpacing: 2,
  },
  receiptConfirmBtn: {
    flex: 2,
    height: 64,
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  receiptConfirmGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  receiptConfirmTxt: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 2,
  },

  receiptImageContainer: {
    marginBottom: 30,
    alignItems: 'center',
    position: 'relative',
  },
  receiptPreview: {
    width: '100%',
    height: 220,
    borderRadius: 24,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: 'rgba(201, 161, 74, 0.1)',
  },
  receiptPreviewPlaceholder: {
    width: '100%',
    height: 220,
    borderRadius: 24,
    backgroundColor: 'rgba(201, 161, 74, 0.08)',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(201, 161, 74, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  placeholderText: {
    fontSize: 10,
    fontWeight: '900',
    color: 'rgba(245, 245, 245, 0.4)',
    letterSpacing: 2,
  },
  pickImageBtnOuter: {
    position: 'absolute',
    bottom: -18,
    borderRadius: 30,
    elevation: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    overflow: 'hidden',
  },
  pickImageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 14,
    gap: 10,
  },
  pickImageTxt: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.black,
    letterSpacing: 2,
  },
  receiptTitleText: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.text,
    marginTop: 10,
    letterSpacing: 0.5,
  },
  receiptCategoryText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 3,
    marginTop: 6,
    opacity: 0.7,
  },
  receiptPriceInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(201, 161, 74, 0.04)',
    height: 80,
    borderRadius: 18,
    paddingHorizontal: 24,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(201, 161, 74, 0.15)',
  },
  receiptCurrency: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.primary,
    marginRight: 20,
  },
  priceTextInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '900',
    color: Colors.text,
    height: '100%',
  },
  chipGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  categoryChip: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(201, 161, 74, 0.12)',
  },
  categoryChipActive: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderColor: 'rgba(201, 161, 74, 0.4)', // Gold active border
    overflow: 'hidden',
  },
  categoryChipGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryChipText: {
    fontSize: 11,
    fontWeight: '900',
    color: 'rgba(245, 245, 245, 0.9)',
    letterSpacing: 2,
  },
  categoryChipTextActive: {
    color: Colors.white,
  },

  detailHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailContent: {
    marginTop: 10,
  },
  detailLabel: {
    color: 'rgba(245, 245, 245, 0.7)',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 3,
    marginBottom: 8,
  },
  detailValue: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  serviceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 10,
  },
  serviceTagText: {
    fontWeight: '900',
    fontSize: 16,
  },
  totalDetailBox: {
    backgroundColor: 'rgba(123, 30, 58, 0.05)',
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    marginVertical: 20,
    borderWidth: 1,
    borderColor: 'rgba(201, 161, 74, 0.8)',
    position: 'relative',
    overflow: 'hidden',
  },
  totalDetailLabel: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 8,
  },
  totalDetailValue: {
    fontWeight: '900',
    letterSpacing: -1,
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 18,
    gap: 10,
  },
  downloadBtnText: {
    fontWeight: '900',
    letterSpacing: 2,
  },

  genderRow: {
    flexDirection: 'row',
    gap: 12,
  },
  genderChip: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(201, 161, 74, 0.12)',
  },
  activeGenderChip: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderColor: 'rgba(201, 161, 74, 0.4)', // Gold active border
    overflow: 'hidden',
  },
  genderChipGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderText: {
    fontSize: 12,
    fontWeight: '900',
    color: 'rgba(245, 245, 245, 0.9)',
    letterSpacing: 2,
  },
  activeGenderText: {
    color: Colors.white,
  },
  innerGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(201, 161, 74, 0.1)',
  },
  goldEdge: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(201, 161, 74, 0.15)',
    opacity: 0.5,
  },
  innerGlowSmall: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(201, 161, 74, 0.05)',
  },
  goldEdgeSmall: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(201, 161, 74, 0.1)',
    opacity: 0.5,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(201, 161, 74, 0.08)',
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(201, 161, 74, 0.3)',
    marginBottom: 20,
    borderStyle: 'dashed',
    gap: 10,
  },
  uploadButtonText: {
    color: Colors.primary,
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
    borderColor: Colors.primary,
  },
  removePhoto: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.primary,
  },

});
