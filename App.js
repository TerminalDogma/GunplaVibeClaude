import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import BrowseScreen from './src/screens/BrowseScreen';
import CollectionScreen from './src/screens/CollectionScreen';
import WishlistScreen from './src/screens/WishlistScreen';
import StatsScreen from './src/screens/StatsScreen';
import ModelDetailScreen from './src/screens/ModelDetailScreen';
import AddToCollectionScreen from './src/screens/AddToCollectionScreen';
// import ScanBarcodeScreen from './src/screens/ScanBarcodeScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main tabs navigation
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Browse') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Collection') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Wishlist') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Stats') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#E53935',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Browse" component={BrowseScreen} options={{ title: 'Browse Models' }} />
      <Tab.Screen name="Collection" component={CollectionScreen} options={{ title: 'My Collection' }} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} options={{ title: 'Wishlist' }} />
      <Tab.Screen name="Stats" component={StatsScreen} options={{ title: 'Statistics' }} />
    </Tab.Navigator>
  );
}

// Root navigation with stack for detail screens
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Main" 
          component={MainTabs} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ModelDetail" 
          component={ModelDetailScreen}
          options={{ title: 'Model Details' }}
        />
        <Stack.Screen 
          name="AddToCollection" 
          component={AddToCollectionScreen}
          options={{ title: 'Add to Collection' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
