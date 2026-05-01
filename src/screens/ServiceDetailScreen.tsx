import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  CheckCircle2,
  Minus,
  Phone,
  Plus,
  Sparkles,
  Star,
  Ticket,
  User,
  Users
} from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  BounceIn,
  FadeInDown,
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { CustomButton } from '../components/CustomButton';
import { SalonBackground } from '../components/SalonBackground';
import { Colors } from '../theme/colors';

import { useServices } from '../context/ServiceContext';

const { width } = Dimensions.get('window');

export const ServiceDetailScreen = ({ route, navigation }: any) => {
  const { service: initialService } = route.params;
  const { services, coupons, addOrder } = useServices();

  // Find latest service data from context
  const service = services.find((s: any) => s.id === initialService.id) || initialService;

  // States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [persons, setPersons] = useState(1);
  const [isBooked, setIsBooked] = useState(false);
  const [bookedOrder, setBookedOrder] = useState<any>(null);

  // Coupon & Discount State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCouponDiscount, setAppliedCouponDiscount] = useState(0);
  const [isCouponValid, setIsCouponValid] = useState(false);

  const breathing = useSharedValue(0);
  useEffect(() => {
    breathing.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 5000 }),
        withTiming(0, { duration: 5000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedGlassStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(breathing.value, [0, 1], [1, 1.01]) }]
  }));

  // Price Calculation Logic
  const basePriceNum = useMemo(() => {
    return parseInt(service.price.replace(/[^0-9]/g, ''), 10);
  }, [service.price]);

  const validateCoupon = () => {
    const foundCoupon = coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase());
    if (foundCoupon) {
      setIsCouponValid(true);
      setAppliedCouponDiscount(foundCoupon.discountPercentage);
      Alert.alert('Success', `Coupon code authorized! ${foundCoupon.discountPercentage}% discount applied.`);
    } else {
      setIsCouponValid(false);
      setAppliedCouponDiscount(0);
      Alert.alert('Invalid Code', 'Please enter a valid authorization code from the owner.');
    }
  };

  const pricing = useMemo(() => {
    const rawTotal = basePriceNum * persons;

    // Automated coupon discount
    const finalTotal = Math.round(rawTotal * (1 - appliedCouponDiscount / 100));

    const savings = rawTotal - finalTotal;

    return {
      rawTotal,
      finalTotal,
      savings,
      hasGroupDiscount: false,
      appliedDiscount: appliedCouponDiscount
    };
  }, [basePriceNum, persons, appliedCouponDiscount]);

  const handleBooking = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Details Required', 'Please provide your name and phone number to proceed with the booking.');
      return;
    }

    try {
      const order = await addOrder({
        customerName: name,
        customerPhone: phone,
        serviceName: service.name,
        serviceId: service.id,
        totalAmount: `₹${pricing.finalTotal}`,
        persons: persons
      });
      setBookedOrder(order);
      setIsBooked(true);
    } catch (error) {
      Alert.alert('Booking Error', 'Failed to save booking. Please try again.');
    }
  };

  if (isBooked) {
    return (
      <View style={styles.successContainer}>
        <SalonBackground 
          source={require('../../assets/images/luxury_salon_success_bg.png')} 
          opacity={0.75}
        />
        <Animated.View
          entering={FadeInUp.duration(1000)}
          style={styles.successGlassOuter}
        >
          <View style={styles.successGlassInner}>
            <Animated.View entering={BounceIn.delay(300).duration(800)} style={styles.successIcon}>
              <CheckCircle2 size={80} color={Colors.secondary} strokeWidth={1.5} />
            </Animated.View>
            <Text style={styles.successTitle}>SUCCESSFULLY COMPLETED</Text>
            <View style={styles.successDivider} />
            <Text style={styles.successSubtitle}>
              Experience our world class service! The **{service.name}** for **{name}** has been successfully recorded in the professional management vault.
            </Text>

            {/* Digital Invoice Summary */}
            <View style={styles.invoiceCard}>
              <View style={styles.invoiceHeader}>
                <Ticket size={16} color={Colors.secondary} />
                <Text style={styles.invoiceHeaderTitle}>DIGITAL RECEIPT</Text>
              </View>
              
              <View style={styles.invoiceDivider} />
              
              <View style={styles.invoiceRow}>
                <Text style={styles.invoiceLabel}>INVOICE #</Text>
                <Text style={[styles.invoiceValue, { color: Colors.secondary, fontWeight: '900' }]}>{bookedOrder?.id}</Text>
              </View>
              <View style={styles.invoiceRow}>
                <Text style={styles.invoiceLabel}>SERVICE</Text>
                <Text style={styles.invoiceValue}>{bookedOrder?.serviceName}</Text>
              </View>
              <View style={[styles.invoiceRow, { borderBottomWidth: 1.5, borderBottomColor: Colors.secondary, paddingBottom: 8, marginBottom: 15 }]}>
                <Text style={styles.invoiceLabel}>CLIENT</Text>
                <Text style={styles.invoiceValue}>{bookedOrder?.customerName}</Text>
              </View>
              <View style={styles.invoiceRow}>
                <Text style={styles.invoiceLabel}>TOTAL AMOUNT</Text>
                <Text style={[styles.invoiceValue, { color: Colors.secondary, fontWeight: '900' }]}>{bookedOrder?.totalAmount}</Text>
              </View>

              <View style={styles.invoiceFooter}>
                <Text style={styles.invoiceDate}>{bookedOrder?.date}</Text>
              </View>
            </View>
            <CustomButton
              title="RETURN TO CATALOG"
              onPress={() => navigation.goBack()}
              style={[styles.bookButton, { width: '100%', marginTop: 10 }]}
              gradient={Colors.headerGradient}
            />
            <View style={styles.innerGlow} pointerEvents="none" />
            <View style={styles.goldEdge} pointerEvents="none" />
          </View>
        </Animated.View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SalonBackground 
        source={require('../../assets/images/luxury_service_premium_theme_bg.png')} 
        opacity={0.65} 
      />

      {/* Fixed Header */}
      <View style={styles.fixedHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <ArrowLeft size={22} color={Colors.secondary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Content Section */}
        <View style={styles.content}>
          <Animated.View entering={FadeInDown.delay(100)} style={styles.headerInfo}>
            <LinearGradient
              colors={Colors.headerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.badge}
            >
              <Sparkles size={12} color={Colors.white} fill={Colors.white} />
              <Text style={styles.badgeText}>PREMIUM SERVICE</Text>
            </LinearGradient>
            <View style={styles.ratingRow}>
              <Star size={14} color={Colors.secondary} fill={Colors.secondary} />
              <Text style={styles.ratingText}>4.9/5.0</Text>
            </View>
          </Animated.View>

          <Animated.Text entering={FadeInDown.delay(200)} style={styles.name}>{service.name.toUpperCase()}</Animated.Text>
          <Animated.Text entering={FadeInDown.delay(300)} style={styles.description}>
            {service.description || 'Experience our world-class grooming service designed for luxury and comfort.'}
          </Animated.Text>

          {/* Integrated Form Section */}
          <Animated.View entering={FadeInDown.delay(400)} style={styles.glassSection}>
            <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.glassPanelInner}>
              {/* Client Details */}
              <Text style={styles.sectionLabel}>CLIENT DETAILS</Text>
              <View style={styles.modalInputWrapper}>
                <View style={styles.inputInnerWrapper}>
                  <User size={18} color={Colors.secondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="rgba(245, 245, 245, 0.3)"
                    value={name}
                    onChangeText={setName}
                  />
                </View>
                <View style={[styles.inputCorner, styles.cornerTopLeft]} />
                <View style={[styles.inputCorner, styles.cornerTopRight]} />
                <View style={[styles.inputCorner, styles.cornerBottomLeft]} />
                <View style={[styles.inputCorner, styles.cornerBottomRight]} />
              </View>

              <View style={styles.modalInputWrapper}>
                <View style={styles.inputInnerWrapper}>
                  <Phone size={18} color={Colors.secondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    placeholderTextColor="rgba(245, 245, 245, 0.3)"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                  />
                </View>
                <View style={[styles.inputCorner, styles.cornerTopLeft]} />
                <View style={[styles.inputCorner, styles.cornerTopRight]} />
                <View style={[styles.inputCorner, styles.cornerBottomLeft]} />
                <View style={[styles.inputCorner, styles.cornerBottomRight]} />
              </View>
              <View style={styles.formDivider} />

              {/* Group Size (Label Removed) */}
              <View style={styles.selectorRow}>
                <View style={styles.personInfo}>
                  <Users size={18} color={Colors.secondary} />
                  <Text style={styles.personCount}>{persons} {persons > 1 ? 'People' : 'Person'}</Text>
                </View>

                <View style={styles.counter}>
                  <TouchableOpacity
                    onPress={() => setPersons(Math.max(1, persons - 1))}
                    style={styles.counterBtn}
                  >
                    <Minus size={18} color={Colors.text} />
                  </TouchableOpacity>
                  <View style={styles.countDisplay}>
                    <Text style={styles.countValue}>{persons}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setPersons(persons + 1)}
                    style={styles.counterBtn}
                  >
                    <Plus size={18} color={Colors.text} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formDivider} />

              {/* Available Coupons */}
              {coupons && coupons.filter((c: any) => c.isVisible).length > 0 && (
                <View style={{ marginBottom: 20 }}>
                  <Text style={styles.sectionLabel}>AVAILABLE OFFERS</Text>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    contentContainerStyle={{ gap: 12, paddingVertical: 8 }}
                  >
                    {coupons.filter((c: any) => c.isVisible).map((c: any) => (
                      <TouchableOpacity 
                        key={c.id} 
                        style={styles.couponChip}
                        onPress={() => {
                          setCouponCode(c.code);
                          setIsCouponValid(false);
                          setAppliedCouponDiscount(0);
                        }}
                        activeOpacity={0.8}
                      >
                        <View style={styles.couponChipInner}>
                          <Text style={styles.couponChipText}>{c.code}</Text>
                          <LinearGradient
                            colors={Colors.headerGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.couponDiscountBadge}
                          >
                            <Text style={styles.couponDiscountText}>{c.discountPercentage}%</Text>
                          </LinearGradient>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Coupon Code */}
              <Text style={styles.sectionLabel}>COUPON CODE</Text>
              <View style={styles.discountInputRow}>
                <View style={[styles.modalInputWrapper, { flex: 1, marginBottom: 0 }]}>
                  <View style={styles.inputInnerWrapper}>
                    <Ticket size={18} color={Colors.secondary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Code"
                      placeholderTextColor="rgba(245, 245, 245, 0.3)"
                      value={couponCode}
                      onChangeText={(val) => {
                        setCouponCode(val);
                        setIsCouponValid(false);
                        setAppliedCouponDiscount(0);
                      }}
                      autoCapitalize="characters"
                    />
                  </View>
                  <View style={[styles.inputCorner, styles.cornerTopLeft]} />
                  <View style={[styles.inputCorner, styles.cornerTopRight]} />
                  <View style={[styles.inputCorner, styles.cornerBottomLeft]} />
                  <View style={[styles.inputCorner, styles.cornerBottomRight]} />
                </View>
                <TouchableOpacity
                  onPress={validateCoupon}
                  activeOpacity={0.8}
                  style={styles.applyBtnWrapper}
                >
                  <LinearGradient
                    colors={Colors.headerGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.applyBtnGradient}
                  >
                    <Text style={styles.applyBtnText}>
                      {isCouponValid ? 'VALID' : 'APPLY'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              <View style={styles.formDivider} />

              {/* Price Breakdown */}
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Base Rate ({persons}x)</Text>
                <Text style={styles.priceValue}>₹{pricing.rawTotal}</Text>
              </View>
              {pricing.hasGroupDiscount && (
                <View style={styles.priceRow}>
                  <Text style={[styles.priceLabel, { color: Colors.secondary }]}>Group Benefit (10%)</Text>
                  <Text style={[styles.priceValue, { color: Colors.secondary }]}>- ₹{Math.round(pricing.rawTotal * 0.1)}</Text>
                </View>
              )}
              {pricing.appliedDiscount > 0 && (
                <View style={styles.priceRow}>
                  <Text style={[styles.priceLabel, { color: Colors.secondary }]}>Coupon Discount ({pricing.appliedDiscount}%)</Text>
                  <Text style={[styles.priceValue, { color: Colors.secondary }]}>- ₹{Math.round(pricing.rawTotal * (pricing.appliedDiscount / 100))}</Text>
                </View>
              )}
              <View style={styles.totalDivider} />
              <View style={styles.priceRow}>
                <Text style={styles.totalLabel}>FINAL TOTAL</Text>
                <Text style={styles.totalAmountText}>₹{pricing.finalTotal}</Text>
              </View>
            </View>
          </Animated.View>
          {/* Booking Action */}
          <CustomButton
            title="COMPLETED"
            onPress={handleBooking}
            style={styles.bookButton}
            gradient={Colors.headerGradient}
          />
        </View>
      </ScrollView>

    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 110,
    zIndex: 100,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(201, 161, 74, 0.1)',
  },
  scrollContent: {
    paddingTop: 110, // Adjusted for fixed header
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingBottom: 40,
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: Colors.text,
    fontWeight: '800',
    fontSize: 12,
  },
  name: {
    fontSize: 34,
    fontWeight: '900',
    color: Colors.text,
    marginBottom: 10,
    letterSpacing: 2,
  },
  description: {
    color: 'rgba(245, 245, 245, 0.6)',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 32,
    letterSpacing: 0.5,
  },
  glassSection: {
    marginBottom: 24,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1.5,
    borderColor: 'rgba(201, 161, 74, 0.3)',
    overflow: 'hidden',
  },
  glassPanelInner: {
    padding: 32,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.secondary,
    letterSpacing: 3,
    marginBottom: 15,
    marginLeft: 4,
  },
  modalInputWrapper: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1.5,
    borderColor: 'rgba(201, 161, 74, 0.3)',
    marginBottom: 20,
  },
  inputInnerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 22,
  },
  inputIcon: {
    marginRight: 14,
  },
  input: {
    flex: 1,
    height: 64,
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
  selectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 22,
    height: 60,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.secondary,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  personInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  personCount: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  counterBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(201, 161, 74, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(201, 161, 74, 0.25)',
  },
  countDisplay: {
    width: 30,
    alignItems: 'center',
  },
  countValue: {
    color: Colors.secondary,
    fontSize: 22,
    fontWeight: '900',
  },
  discountBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  discountText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  discountInputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  applyBtnWrapper: {
    height: 60,
    width: 100,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(201, 161, 74, 0.4)',
  },
  applyBtnGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyBtnText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },
  priceGlassContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(201, 161, 74, 0.2)',
    marginBottom: 40,
  },
  priceGlassInner: {
    padding: 24,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceLabel: {
    color: 'rgba(245, 245, 245, 0.6)',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
  priceValue: {
    color: Colors.secondary,
    fontSize: 14,
    fontWeight: '700',
  },
  couponChip: {
    borderRadius: 12,
    backgroundColor: 'rgba(201, 161, 74, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(201, 161, 74, 0.15)',
    overflow: 'hidden',
  },
  couponChipInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 6,
    paddingVertical: 6,
    gap: 8,
  },
  couponChipText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  couponDiscountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  couponDiscountText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '900',
  },
  totalDivider: {
    height: 1,
    backgroundColor: 'rgba(201, 161, 74, 0.25)',
    marginVertical: 16,
  },
  formDivider: {
    height: 1,
    backgroundColor: 'rgba(201, 161, 74, 0.1)',
    marginVertical: 24,
  },
  totalLabel: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 4,
  },
  totalAmountText: {
    color: Colors.secondary,
    fontSize: 28,
    fontWeight: '900',
  },
  bookButton: {
    height: 64,
    marginTop: 10,
  },
  successContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successGlassOuter: {
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  successGlassInner: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: 'rgba(10, 10, 10, 0.7)', // Reduced opacity to show background
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
  },
  successDivider: {
    width: 60,
    height: 3,
    backgroundColor: Colors.secondary,
    marginVertical: 20,
  },
  successSubtitle: {
    color: 'rgba(201, 161, 74, 0.7)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  invoiceCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(201, 161, 74, 0.8)',
    marginBottom: 30,
  },
  invoiceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  invoiceHeaderTitle: {
    color: Colors.text,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },
  invoiceDivider: {
    height: 1,
    backgroundColor: 'rgba(201, 161, 74, 0.1)',
    marginBottom: 15,
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  invoiceLabel: {
    color: 'rgba(245, 245, 245, 0.4)',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
  invoiceValue: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  invoiceFooter: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
  invoiceDate: {
    color: 'rgba(201, 161, 74, 0.3)',
    fontSize: 8,
    fontWeight: '600',
  },
  innerGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(201, 161, 74, 0.15)',
  },
  goldEdge: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(231, 84, 128, 0.15)',
    opacity: 0.5,
  },
  innerGlowSmall: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(201, 161, 74, 0.08)',
  },
  goldEdgeSmall: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(201, 161, 74, 0.15)',
    opacity: 0.5,
  },
});

