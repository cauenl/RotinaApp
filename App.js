import 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';
import { AuthProvider } from './src/contexts/AuthContext';
import { ProximityProvider, useProximity } from './src/contexts/ProximityContext';
import { useProximityWatcher } from './src/hooks/useProximityWatcher';
import RootNavigator from './src/navigation/RootNavigator';

// ─── Silencia o aviso do expo-notifications no Expo Go ────────────────────
// (só afasta push remoto, que não usamos — notificações locais continuam OK)
LogBox.ignoreLogs(['expo-notifications: Android Push notifications']);

const originalError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('expo-notifications: Android Push')) {
    return;
  }
  originalError(...args);
};

// ─────────────────────────────────────────────────────────────────────────
// Componente "invisível" que só existe para manter o watcher de proximidade
// rodando enquanto o app estiver aberto. Precisa estar dentro do
// ProximityProvider para ter acesso ao estado ativo/raio.
// ─────────────────────────────────────────────────────────────────────────
function ProximityWatcherMount() {
  const { ativo, raioMetros, carregado } = useProximity();
  useProximityWatcher(carregado ? ativo : false, raioMetros);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <ProximityProvider>
        <ProximityWatcherMount />
        <StatusBar style="dark" />
        <RootNavigator />
      </ProximityProvider>
    </AuthProvider>
  );
}