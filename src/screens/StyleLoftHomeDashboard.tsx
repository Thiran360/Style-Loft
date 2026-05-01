import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { ITEM_WIDTH, RoundEmployeeCard } from '../components/RoundEmployeeCard';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../theme/colors';

const { width } = Dimensions.get('window');

const AnimatedExpoImage = Animated.createAnimatedComponent(Image);

const BACKGROUND_IMAGES = [
  'https://i.pinimg.com/736x/28/89/34/288934132364834705.jpg',
  'https://i.pinimg.com/736x/56/01/35/56013589126144757.jpg',
  'https://i.pinimg.com/736x/63/19/11/631911391509446353.jpg',
  'https://i.pinimg.com/736x/14/53/81/145381894220575228.jpg',
  'https://i.pinimg.com/1200x/15/25/b5/1525b5d8519af44f31e9b9be2243fec7.jpg'
];

const PAN_IMAGES = [...BACKGROUND_IMAGES, BACKGROUND_IMAGES[0]];

export const StyleLoftHomeDashboard = ({ navigation }: any) => {
  const { employees } = useAuth();

  const breathing = useSharedValue(0);
  useEffect(() => {
    breathing.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 15000 }),
        withTiming(0, { duration: 15000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedBgStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(breathing.value, [0, 1], [1, 1.05]) }]
  }));

  // Pulse animation removed as per user request for cleaner background





  // Panning animation removed as per user request
  useEffect(() => {
  }, []);

  const panningStyle = useAnimatedStyle(() => ({
    flexDirection: 'row',
    width: width,
  }));

  const renderHeader = () => (
    <View style={styles.headerWrapper}>
      {/* Top section with background slideshow */}
      <View style={styles.topLogoSection}>
        <LinearGradient
          colors={Colors.headerGradient as any}
          style={styles.headerBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={StyleSheet.absoluteFillObject}>
            <Image
              source={{ uri: BACKGROUND_IMAGES[0] }}
              style={{ width, height: '120%', bottom: -40, opacity: 0.3 }}
              contentFit="cover"
            />
          </View>
        </LinearGradient>

        <View style={styles.logoPressArea}>
          <TouchableOpacity
            activeOpacity={0.7}
            onLongPress={() => {
              navigation.navigate('AdminLogin');
            }}
            delayLongPress={3000}
          >
            <View style={styles.circularLogoContainer}>
              <Image
                source={require('../../assets/images/logo.jpg')}
                style={styles.circularLogo}
                contentFit="contain"
              />
            </View>
          </TouchableOpacity>
          <Text style={styles.brandTitle}>STYLE LOFT</Text>
          <View style={styles.brandUnderline} />
        </View>
      </View>

      {/* Simple Title section without box */}
      <View style={styles.simpleSectionHeader}>
        <Text style={styles.sectionTitle}>OUR EMPLOYEES</Text>
        <View style={styles.sectionUnderline} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Background for Our Employees section */}
      <View style={styles.employeeSectionBgWrapper}>
        <Image
          source={require('../../assets/images/employee_bg.png')}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
        />
        {/* Surface tint for the employee section */}
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(10, 10, 10, 0.85)' }]} />
      </View>

      <View style={{ flex: 1 }}>

        <FlatList
          key="3-columns"
          data={[...employees, ...Array(employees.length % 3 === 0 ? 0 : 3 - (employees.length % 3)).fill({ id: 'spacer', isSpacer: true })]}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => {
            if (item.isSpacer) {
              return <View style={{ width: ITEM_WIDTH, marginHorizontal: 0 }} />;
            }
            return (
              <RoundEmployeeCard
                employee={item}
                onPress={() => navigation.navigate('StylistLogin', { employee: item })}
              />
            );
          }}
          numColumns={3}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  employeeSectionBgWrapper: {
    ...StyleSheet.absoluteFillObject,
    top: 270, // Adjusted to match new topLogoSection height
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
  },
  headerWrapper: {
    marginBottom: 20,
    alignItems: 'center',
  },
  topLogoSection: {
    width: '100%',
    height: 270,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 20,
  },
  headerBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  logoPressArea: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  circularLogoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.primary,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  circularLogo: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.secondary,
    letterSpacing: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 6,
  },
  brandUnderline: {
    width: 80,
    height: 4,
    backgroundColor: Colors.secondary,
    marginTop: 12,
    borderRadius: 2,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  simpleSectionHeader: {
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  glassHeader: {
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: Colors.glassBackground,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 4,
    textAlign: 'center',
  },
  sectionUnderline: {
    width: 40,
    height: 2,
    backgroundColor: Colors.primary,
    marginTop: 8,
    alignSelf: 'center',
  },
  listContent: {
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
});
