import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Service } from '../data/services';
import { Colors } from '../theme/colors';

const { width } = Dimensions.get('window');
const GRID_PADDING = 20;
const GAP = 14;
// Perfect 2-column card width
const CARD_WIDTH = (width - GRID_PADDING * 2 - GAP) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.25; // Slightly more compact

interface ServiceCardProps {
  service: Service;
  onPress: () => void;
  index: number;
}

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onPress,
  index,
}) => {
  const scale = useSharedValue(1);
  const breathing = useSharedValue(0);

  useEffect(() => {
    // Each card breathes slightly out of sync for a natural premium feel
    const delay = index * 100;
    setTimeout(() => {
      breathing.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 4500 }),
          withTiming(0, { duration: 4500 })
        ),
        -1,
        true
      );
    }, delay);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const breatheScale = interpolate(breathing.value, [0, 1], [1, 1.02]);
    const breatheTranslate = interpolate(breathing.value, [0, 1], [0, -2]);

    return {
      transform: [
        { scale: scale.value * breatheScale },
        { translateY: breatheTranslate }
      ],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.94, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
  };

  // Alternate entry from left (even) and right (odd) columns
  const enteringAnimation = FadeInDown.delay(index * 80)
    .springify()
    .damping(14)
    .stiffness(100);

  return (
    <AnimatedTouchableOpacity
      entering={enteringAnimation}
      activeOpacity={1}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={false}
      style={[styles.container, animatedStyle]}
    >
      <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill}>
        {/* Glass Reflection Gradient */}
        <LinearGradient
          colors={['rgba(201, 161, 74, 0.1)', 'transparent', 'rgba(201, 161, 74, 0.05)']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* Hero Image */}
        <View style={styles.imageInnerContainer}>
          <Image
            source={{ uri: service.image }}
            style={styles.image}
            contentFit="cover"
            transition={600}
          />
          <LinearGradient
            colors={['transparent', 'rgba(18, 18, 18, 0.4)', 'rgba(18, 18, 18, 0.95)']}
            style={StyleSheet.absoluteFill}
          />
        </View>

        {/* Bottom Content */}
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={2}>
            {service.name}
          </Text>

          {/* Gold divider */}
          <View style={styles.divider} />

          <View style={styles.priceRow}>
            <Text style={styles.rupeeSymbol}>₹</Text>
            <Text style={styles.price}>
              {service.price.replace('₹', '')}
            </Text>
          </View>
        </View>

        {/* Premium Borders */}
        <View style={styles.innerGlow} />
        <View style={styles.goldEdge} />
      </BlurView>
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: GAP,
    elevation: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  imageInnerContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  name: {
    fontSize: 13,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: 1.5,
    lineHeight: 16,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.secondary,
    marginBottom: 6,
    opacity: 0.4,
    borderRadius: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  rupeeSymbol: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.secondary,
  },
  price: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.secondary, // Changed to gold for visibility
    letterSpacing: 1,
  },
  innerGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(201, 161, 74, 0.12)',
  },
  goldEdge: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
    borderWidth: 2.5,
    borderColor: Colors.secondary,
    opacity: 1,
  },
});
