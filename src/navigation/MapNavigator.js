import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapScreen from '../screens/map/MapScreen';
import TaskDetailScreen from '../screens/map/TaskDetailScreen';
 
const Stack = createNativeStackNavigator();
 
export default function MapNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MapView" component={MapScreen} />
      <Stack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}
