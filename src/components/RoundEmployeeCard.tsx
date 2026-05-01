import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  Extrapolate,
  FadeInDown,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { User } from '../context/AuthContext';
import { Colors } from '../theme/colors';

const { width } = Dimensions.get('window');
export const ITEM_WIDTH = width / 3 - 30;

interface RoundEmployeeCardProps {
  employee: User;
  onPress: () => void;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const RoundEmployeeCard: React.FC<RoundEmployeeCardProps> = ({ employee, onPress }) => {
  console.log('RoundEmployeeCard employee:', employee);
  const scale = useSharedValue(1);
  const pressed = useSharedValue(0);
  const breathing = useSharedValue(0);

  useEffect(() => {
    // Animations removed as per user request
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateY: interpolate(pressed.value, [0, 1], [0, -5], Extrapolate.CLAMP) }
      ],
    };
  });

  const onPressIn = () => {
    scale.value = withSpring(0.95);
    pressed.value = withSpring(1);
  };

  const onPressOut = () => {
    scale.value = withSpring(1);
    pressed.value = withSpring(0);
  };

  const firstName = employee?.name?.split(' ')[0] || 'Staff';

  return (
    <View style={styles.wrapper}>
      <AnimatedTouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[styles.container, animatedStyle]}
      >
        <BlurView intensity={20} tint="dark" style={styles.glassContainer}>
          <LinearGradient
            colors={['rgba(26, 26, 26, 0.8)', 'rgba(18, 18, 18, 0.6)', 'rgba(26, 26, 26, 0.7)']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <Image
            source={{ uri: (employee && employee.avatar) || `https://ui-avatars.com/api/?name=${encodeURIComponent(employee?.name || 'Staff')}&background=1A1A1A&color=C9A14A&bold=true&size=128` }}
            style={styles.image}
            contentFit="cover"
          />
          <View style={styles.innerGlow} />
          <View style={styles.goldBorder} />
        </BlurView>
      </AnimatedTouchableOpacity>
      <Text style={styles.name} numberOfLines={1}>{firstName.toUpperCase()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  container: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.05, // Slightly less tall
    borderRadius: 16, // Reduced from 24
    backgroundColor: 'transparent',
    elevation: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    overflow: 'visible', // Changed to allow soft shadow
  },
  glassContainer: {
    flex: 1,
    padding: 6,
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12, // Reduced from 18
  },
  innerGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  goldBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.secondary,
  },
  name: {
    marginTop: 6,
    color: Colors.text,
    fontSize: 9, // Reduced from 10
    fontWeight: '800',
    letterSpacing: 1.5,
  },
});
