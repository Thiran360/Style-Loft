import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { ArrowLeft, ChevronRight, Sparkles } from 'lucide-react-native';
import React from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { Colors } from '../theme/colors';
import { SalonBackground } from '../components/SalonBackground';
import { useServices } from '../context/ServiceContext';

const { width } = Dimensions.get('window');

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const ServiceCategoryScreen = ({ navigation }: any) => {
  const { categories, loading } = useServices();

  if (loading && categories.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: Colors.secondary }}>Loading categories...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SalonBackground 
        source={require('../../assets/images/luxury_salon_choose_bg_v2.png')} 
        opacity={0.35}
      />

      <Animated.View
        entering={FadeInUp.duration(800).springify()}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={22} color={Colors.secondary} />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.titleOutline}>CHOOSE</Text>
          <Text style={styles.title}>CHOOSE</Text>
        </View>
        <View style={styles.subtitleRow}>
          <Sparkles size={14} color={Colors.primary} style={{ marginRight: 8 }} />
          <Text style={styles.subtitle}>SELECT SERVICE CATEGORY</Text>
        </View>
        <View style={styles.titleUnderlineWrapper}>
          <LinearGradient
            colors={Colors.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.titleUnderline}
          />
        </View>
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {categories.map((cat, index) => (
          <CategoryCard
            key={cat.name}
            cat={cat}
            index={index}
            onPress={() => navigation.navigate('ServiceSelection', { category: cat.name })}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const CategoryCard = ({ cat, index, onPress }: any) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <AnimatedTouchableOpacity
      entering={FadeInDown.delay(index * 200).duration(800).springify()}
      style={[styles.categoryCard, animatedStyle]}
      activeOpacity={1}
      onPress={onPress}
      onPressIn={() => scale.value = withSpring(0.96)}
      onPressOut={() => scale.value = withSpring(1)}
    >
      <BlurView intensity={10} tint="dark" style={styles.cardBlur}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: cat.image }} style={styles.categoryImage} contentFit="cover" />
          <View style={styles.imageOverlay} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.categoryName}>{cat.name.toUpperCase()}</Text>
          <Text style={styles.categoryTag}>PREMIUM COLLECTION</Text>
        </View>
        <LinearGradient
          colors={Colors.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.chevronContainer}
        >
          <ChevronRight size={18} color={Colors.white} />
        </LinearGradient>
      </BlurView>
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 30,
    paddingTop: 60,
    marginBottom: 30,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(201, 161, 74, 0.1)',
  },
  titleContainer: {
    position: 'relative',
    marginBottom: 5,
    justifyContent: 'center',
  },
  titleOutline: {
    position: 'absolute',
    fontSize: 90,
    fontWeight: '900',
    color: 'rgba(123, 30, 58, 0.05)',
    letterSpacing: 15,
    top: -25,
    left: -10,
    zIndex: -1,
  },
  title: {
    fontSize: 54,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: 12,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 10,
    color: Colors.primary,
    letterSpacing: 4,
    fontWeight: '800',
  },
  titleUnderlineWrapper: {
    marginTop: 15,
    width: 80,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  titleUnderline: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  categoryCard: {
    borderRadius: 30,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 3.5,
    borderColor: Colors.secondary,
  },
  cardBlur: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: 85,
    height: 85,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 3.5,
    borderColor: 'rgba(201, 161, 74, 0.35)',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 20,
  },
  categoryName: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: 3,
    marginBottom: 4,
  },
  categoryTag: {
    fontSize: 8,
    color: 'rgba(201, 161, 74, 0.7)',
    fontWeight: '800',
    letterSpacing: 2,
  },
  chevronContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(201, 161, 74, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(201, 161, 74, 0.3)',
  },
});
