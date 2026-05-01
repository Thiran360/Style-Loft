import React from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  Text 
} from 'react-native';
import { Colors } from '../theme/colors';
import { StyleLoftLogo } from '../components/StyleLoftLogo';

const { width, height } = Dimensions.get('window');

/**
 * @deprecated This screen is not used in the current Direct-Entry flow.
 */
export const LandingScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.touchArea}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('Home')}
      >
        <StyleLoftLogo scale={1} />
        <Text style={styles.entryText}>TAP TO ENTER</Text>
      </TouchableOpacity>
      
      <View style={styles.bottomDecoration}>
        <View style={styles.line} />
        <View style={styles.diamond} />
        <View style={styles.line} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchArea: {
    width: '100%',
    height: '60%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  entryText: {
    color: Colors.secondary,
    fontSize: 10,
    letterSpacing: 4,
    marginTop: 40,
    opacity: 0.6,
    fontWeight: '700',
  },
  bottomDecoration: {
    position: 'absolute',
    bottom: 60,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 40,
    opacity: 0.2,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.secondary,
  },
  diamond: {
    width: 6,
    height: 6,
    backgroundColor: Colors.secondary,
    transform: [{ rotate: '45deg' }],
    marginHorizontal: 15,
  },
});

