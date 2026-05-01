import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import { Sparkle } from 'lucide-react-native';
import { Colors } from '../theme/colors';

interface StyleLoftLogoProps {
  scale?: number;
}

export const StyleLoftLogo: React.FC<StyleLoftLogoProps> = ({ scale: baseScale = 1 }) => {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1500 }),
        withTiming(1, { duration: 1500 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value * baseScale }],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={[styles.logoCircle, { width: 120 * baseScale, height: 120 * baseScale, borderRadius: 60 * baseScale }]}>
        <Sparkle size={60 * baseScale} color={Colors.secondary} />
      </View>
      <Text style={[styles.text, { fontSize: 42 * baseScale, letterSpacing: 12 * baseScale }]}>STYLE LOFT</Text>
      <View style={[styles.underline, { width: 60 * baseScale, height: 3 * baseScale }]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logoCircle: {
    borderWidth: 2,
    borderColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(201, 161, 74, 0.05)',
  },
  text: {
    fontWeight: '900',
    color: Colors.text,
  },
  underline: {
    backgroundColor: Colors.secondary,
    marginTop: 10,
  },
});
