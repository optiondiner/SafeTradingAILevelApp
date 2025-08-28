import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GannLevelsScreen from './screens/GannLevelsScreen';
import OptionSellingScreen from './screens/OptionSellingScreen';
import RangeCalculatorScreen from './screens/RangeCalculatorScreen';
import AstroBreakoutScreen from './screens/AstroBreakout';
import AboutScreen from './screens/AboutScreen';
import { StyleSheet } from 'react-native';
import { Text } from "react-native";

export type RootStackParamList = {
  GannLevels: undefined;
  OptionSelling: { closingPrice: number };
  RangeCalculator: { niftyValue: number };
  AstroBreakOut: undefined; 
  About: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// ✅ Properly typed styles
const styles = StyleSheet.create({
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    letterSpacing: 1,
    color: '#fff',
  },
});

const commonHeaderStyle = {
  headerTitleStyle: styles.headerTitle,
  headerTitleAlign: 'center' as const,
  headerTintColor: '#fff',
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="GannLevels">
        
        {/* Gann Levels */}
        <Stack.Screen
  name="GannLevels"
  component={GannLevelsScreen}
  options={{
    headerStyle: { backgroundColor: '#dde2e1ff' },
    ...commonHeaderStyle,
     headerTitleAlign: "center",
    headerTitle: () => (
      <Text style={{ fontSize: 28, fontWeight: "700" }}>
         <Text style={{ color: "#2E8BEB" }}>Sa</Text>
                    <Text style={{ color: "#00A86B" }}>fe</Text>
                    <Text style={{ color: "#E53935" }}>T</Text>
                    <Text style={{ color: "#F57C00" }}>ra</Text>
                    <Text style={{ color: "#F57C00" }}>d</Text>
                    <Text style={{ color: "#E53935" }}>i</Text>
                    <Text style={{ color: "#F57C00" }}>n</Text>
                    <Text style={{ color: "#E53935" }}>g</Text>
      </Text>
    ),
  }}
/>

        {/* Option Selling */}
        <Stack.Screen
          name="OptionSelling"
          component={OptionSellingScreen}
          options={{
            title: 'Community Calculator',
            headerStyle: { backgroundColor: '#1e3a8a' }, // blue
            ...commonHeaderStyle,
          }}
        />

        {/* Range Calculator */}
        <Stack.Screen
          name="RangeCalculator"
          component={RangeCalculatorScreen}
          options={{
            title: 'Vix Range Calculator',
            headerStyle: { backgroundColor: '#b45309' }, // orange/brown
            ...commonHeaderStyle,
          }}
        />

        {/* Astro Breakout */}
        <Stack.Screen
          name="AstroBreakOut"
          component={AstroBreakoutScreen}
          options={{
            title: 'Astro Timing',
            headerStyle: { backgroundColor: '#6d28d9' }, // purple
            ...commonHeaderStyle,
          }}
        />

        {/* About */}
        <Stack.Screen 
          name="About" 
          component={AboutScreen} 
          options={{
            title: "Know Us & Customize",
            headerStyle: { backgroundColor: '#334155' }, // slate gray
            ...commonHeaderStyle,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
