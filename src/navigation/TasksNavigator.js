import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TaskListScreen from '../screens/tasks/TaskListScreen';
import TaskFormScreen from '../screens/tasks/TaskFormScreen';
import LocationPickerScreen from '../screens/map/LocationPickerScreen';
 
const Stack = createNativeStackNavigator();
 
export default function TasksNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TaskList" component={TaskListScreen} />
      <Stack.Screen
        name="TaskForm"
        component={TaskFormScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="LocationPicker"
        component={LocationPickerScreen}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}
