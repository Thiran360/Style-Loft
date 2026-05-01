import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '../theme/colors';

// Screens
import { StyleLoftHomeDashboard } from '../screens/StyleLoftHomeDashboard';
import { StyleLoftEmployeeDashboard } from '../screens/StylistDashboard';
import { OwnerDashboard } from '../screens/OwnerDashboard';
import { StylistLoginScreen } from '../screens/StylistLoginScreen';
import { ServiceCategoryScreen } from '../screens/ServiceCategoryScreen';
import { ServiceSelectionScreen } from '../screens/ServiceSelectionScreen';
import { ServiceDetailScreen } from '../screens/ServiceDetailScreen';
import { AdminLoginScreen } from '../screens/AdminLoginScreen';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary,
    background: Colors.background,
    card: Colors.background,
    text: Colors.text,
    border: Colors.surface,
    notification: Colors.primary,
  },
};

const Stack = createNativeStackNavigator();

const MainStack = () => (
  <Stack.Navigator 
    screenOptions={{ 
      headerShown: false,
      contentStyle: { backgroundColor: Colors.background },
      animation: 'fade',
      animationDuration: 300,
      animationTypeForReplace: 'pop',
    }}
  >
    {/* Initial Entry Point */}
    <Stack.Screen name="Home" component={StyleLoftHomeDashboard} />
    
    {/* Stylist Login Flow */}
    <Stack.Screen name="StylistLogin" component={StylistLoginScreen} />
    
    {/* Service Portal Screens */}
    <Stack.Screen name="ServiceCategory" component={ServiceCategoryScreen} />
    <Stack.Screen name="ServiceSelection" component={ServiceSelectionScreen} />
    <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
    
    {/* Other Screens */}
    <Stack.Screen 
      name="AdminLogin" 
      component={AdminLoginScreen} 
      options={{ animation: 'none' }}
    />
    <Stack.Screen name="EmployeeHome" component={StyleLoftEmployeeDashboard} />
    <Stack.Screen name="OwnerHome" component={OwnerDashboard} />
  </Stack.Navigator>
);

export const RootNavigator = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={MyTheme}>
      <MainStack />
    </NavigationContainer>
  );
};
