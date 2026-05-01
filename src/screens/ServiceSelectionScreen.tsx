import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated as RNAnimated,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInLeft,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';
import { useServices } from '../context/ServiceContext';
import { ServiceCard } from '../components/ServiceCard';
import { ArrowLeft, Sparkles, Scissors, ShoppingBag } from 'lucide-react-native';
import { SalonBackground } from '../components/SalonBackground';

const GRID_PADDING = 20;
const GAP = 14;
const CARD_WIDTH = (Dimensions.get('window').width - GRID_PADDING * 2 - GAP) / 2;

export const ServiceSelectionScreen = ({ route, navigation }: any) => {
  const { category } = route.params;
  const { services } = useServices();
  const bgSource = { uri: 'https://i.pinimg.com/736x/92/01/41/920141767598682942.jpg' };

  const filteredServices = services.filter((s) => s.category === category);
  const scrollY = useRef(new RNAnimated.Value(0)).current;

  // Header shrink animation on scroll
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const stickyScale = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  const renderHeader = () => (
    <View style={styles.headerWrapper}>
      {/* Back button */}
      <Animated.View entering={FadeIn.duration(400)}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <ArrowLeft size={22} color={Colors.secondary} />
        </TouchableOpacity>
      </Animated.View>

      {/* Title block */}
      <RNAnimated.View
        style={[
          styles.titleBlock,
          { opacity: headerOpacity, transform: [{ scale: stickyScale }] },
        ]}
      >
        <Animated.View entering={FadeInLeft.delay(100).duration(500)}>
          <LinearGradient
            colors={Colors.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.categoryChip}
          >
            <Scissors size={12} color={Colors.white} strokeWidth={2.5} />
            <Text style={styles.chipLabel}>{category.toUpperCase()}</Text>
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInLeft.delay(200).duration(500)}>
          <Text style={styles.titleMain}>
            {category === 'Men'
              ? 'Gentlemen\'s'
              : category === 'Women'
              ? 'Ladies\''
              : 'Kids\''}
          </Text>
          <Text style={styles.titleAccent}>CATALOG</Text>
        </Animated.View>

        <Animated.View
          entering={FadeInLeft.delay(300).duration(500)}
          style={styles.subtitleRow}
        >
          <Sparkles size={14} color={Colors.primary} />
          <Text style={styles.subtitle}>
            {filteredServices.length} Premium Services
          </Text>
        </Animated.View>
      </RNAnimated.View>

      {/* Gold divider */}
      <Animated.View
        entering={FadeIn.delay(400).duration(600)}
        style={styles.goldDivider}
      />
    </View>
  );

  // Render 2 items side-by-side per row
  const renderRow = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.row}>
      <ServiceCard
        service={item[0]}
        onPress={() => navigation.navigate('ServiceDetail', { service: item[0] })}
        index={index * 2}
      />
      {item[1] ? (
        <ServiceCard
          service={item[1]}
          onPress={() => navigation.navigate('ServiceDetail', { service: item[1] })}
          index={index * 2 + 1}
        />

      ) : (
        <View style={styles.emptyCard} />
      )}
    </View>
  );

  // Chunk filtered services into pairs
  const pairedServices: any[] = [];
  for (let i = 0; i < filteredServices.length; i += 2) {
    pairedServices.push([filteredServices[i], filteredServices[i + 1]]);
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SalonBackground 
        source={require('../../assets/images/luxury_service_premium_theme_bg.png')} 
        opacity={0.6}
      />

      <RNAnimated.FlatList
        data={pairedServices}
        keyExtractor={(_, i) => `row-${i}`}
        renderItem={renderRow}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onScroll={RNAnimated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  // ── Header ─────────────────────────────────────────────────────────────
  headerWrapper: {
    paddingTop: 60,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(201, 161, 74, 0.15)',
  },
  titleBlock: {
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
    marginBottom: 4,
  },
  chipLabel: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },
  titleMain: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: 4,
    lineHeight: 36,
  },
  titleAccent: {
    fontSize: 42,
    fontWeight: '900',
    color: Colors.secondary,
    letterSpacing: 8,
    lineHeight: 48,
    marginTop: -4,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: '900',
    letterSpacing: 3,
  },
  goldDivider: {
    width: 60,
    height: 3,
    backgroundColor: Colors.secondary,
    marginTop: 20,
    borderRadius: 2,
  },
  // ── Grid ───────────────────────────────────────────────────────────────
  listContent: {
    paddingBottom: 50,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  emptyCard: {
    width: CARD_WIDTH,
  },
});
