import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TasksNavigator from './TasksNavigator';
import MapNavigator from './MapNavigator';
import SettingsScreen from '../screens/settings/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#E5E7EB',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarIcon: ({ focused }) => {
          const icons = {
            Tasks:    focused ? '📋' : '📄',
            Map:      focused ? '🗺️' : '🗾',
            Settings: focused ? '⚙️' : '🔧',
          };
          return <Text style={{ fontSize: 20 }}>{icons[route.name]}</Text>;
        },
      })}
    >
      <Tab.Screen name="Tasks"    component={TasksNavigator}  options={{ tabBarLabel: 'Tarefas' }} />
      <Tab.Screen name="Map"      component={MapNavigator}    options={{ tabBarLabel: 'Mapa' }} />
      <Tab.Screen name="Settings" component={SettingsScreen}  options={{ tabBarLabel: 'Config.' }} />
    </Tab.Navigator>
  );
}
