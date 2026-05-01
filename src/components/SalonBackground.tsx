import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface SalonBackgroundProps {
  source?: any;
  opacity?: number;
  overlayColor?: string;
}

export const SalonBackground = ({ source, opacity = 0.7, overlayColor }: SalonBackgroundProps) => {
  const finalOverlayColor = overlayColor || `rgba(10, 10, 12, ${opacity})`;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Image
        source={source || require('../../assets/images/luxury_salon_dashboard_bg.png')}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: finalOverlayColor }]} />
    </View>
  );
};

const styles = StyleSheet.create({
});
