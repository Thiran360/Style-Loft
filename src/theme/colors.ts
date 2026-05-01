export const Colors = {
  // 1. Base (Deep Black)
  background: '#0A0A0A', // Main background (70% of UI)
  backgroundSection: '#121212', // Section background
  surface: '#0A0A0A', // Deep Black Surface
  
  // 2. Wine Red (Royal Feel) - 15% only
  primary: '#7B1E3A', // Primary Wine Red
  primaryGradient: '#A8324A', // Gradient mix
  
  // 3. Gold (Luxury Highlight)
  secondary: '#C9A14A', // Main Gold
  accentLight: '#E5C100', // Bright Gold
  accentDark: '#A67C52', // Dark Gold
  
  // 4. White (Soft)
  text: '#F5F5F5', // Main Text
  textSecondary: '#D1D5DB', // Secondary Text
  
  // Utility & Gradients
  headerGradient: ['#7B1E3A', '#0A0A0A'] as const,
  goldGradient: ['#C9A14A', '#E5C100'] as const,
  
  // Borders & Effects
  cardBorder: 'rgba(201, 161, 74, 0.2)',
  glassBackground: 'rgba(255, 255, 255, 0.05)',
  
  // Status
  error: '#FF5252',
  success: '#4CAF50',
  white: '#FFFFFF',
  black: '#000000',

  // Alias for backward compatibility
  primaryGold: '#C9A14A',
};
