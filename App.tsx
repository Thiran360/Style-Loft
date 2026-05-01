import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { ServiceProvider } from './src/context/ServiceContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Colors } from './src/theme/colors';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.background }}>
      <AuthProvider>
        <ServiceProvider>
          <SafeAreaProvider>
            <StatusBar style="light" />
            <RootNavigator />
          </SafeAreaProvider>
        </ServiceProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
