import React, { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

import MapScreen from './src/screens/MapScreen';
import InventoryScreen from './src/screens/InventoryScreen';
import CraftingScreen from './src/screens/CraftingScreen';
import ShopScreen from './src/screens/ShopScreen';
import QuestLogScreen from './src/screens/QuestLogScreen';

const Stack = createNativeStackNavigator();

// Prevent auto hide immediately
SplashScreen.preventAutoHideAsync().catch(() => {});

// Global JS Crash Reporter
const defaultErrorHandler = global.ErrorUtils?.getGlobalHandler();
global.ErrorUtils?.setGlobalHandler(async (error, isFatal) => {
  try {
    const crashReport = `CRASH REPORT\nTime: ${new Date().toISOString()}\nFatal: ${isFatal}\nMessage: ${error.message}\nStack: ${error.stack}`;
    await AsyncStorage.setItem('@last_crash_report', crashReport);
  } catch (e) {
    console.log("Failed to save crash report", e);
  }
  if (defaultErrorHandler) {
    defaultErrorHandler(error, isFatal);
  }
});

import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

// ... (Rest of imports remain)

export default function App() {
  useEffect(() => {
    // Check for previous crashes
    AsyncStorage.getItem('@last_crash_report').then(report => {
      if (report) {
        Alert.alert("Spiel abgestürzt!", "Das Spiel wurde zuvor unerwartet beendet. Crash-Details wurden gesichert.", [
          { text: "Verwerfen", style: "cancel", onPress: () => AsyncStorage.removeItem('@last_crash_report') },
          { text: "Datei speichern", onPress: async () => {
              try {
                const fileUri = FileSystem.documentDirectory + 'crash_report.txt';
                await FileSystem.writeAsStringAsync(fileUri, report, { encoding: FileSystem.EncodingType.UTF8 });
                if (await Sharing.isAvailableAsync()) {
                  await Sharing.shareAsync(fileUri, { dialogTitle: 'Crashreport speichern' });
                } else {
                  Alert.alert("Fehler", "Teilen ist auf diesem Gerät nicht verfügbar. Die Datei liegt in: " + fileUri);
                }
                await AsyncStorage.removeItem('@last_crash_report');
              } catch (e) {
                console.error("Konnte Datei nicht speichern", e);
              }
            } 
          }
        ]);
      }
    });

    // Hide splash screen safely after mount
    setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
    }, 500);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Inventory" component={InventoryScreen} />
        <Stack.Screen name="Crafting" component={CraftingScreen} />
        <Stack.Screen name="Shop" component={ShopScreen} />
        <Stack.Screen name="QuestLog" component={QuestLogScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
