import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

// ─────────────────────────────────────────────────────────────────────────
// Hook que cuida de:
// 1. Pedir permissão de localização ao usuário
// 2. Buscar a posição atual (uma vez)
// Retorna: { location, errorMsg, loading, permissionGranted }
// ─────────────────────────────────────────────────────────────────────────
export function useUserLocation() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setErrorMsg('Permissão de localização negada. Algumas funções do app ficarão limitadas.');
        setPermissionGranted(false);
        setLoading(false);
        return;
      }

      setPermissionGranted(true);

      try {
        const current = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setLocation(current.coords);
      } catch (err) {
        setErrorMsg('Não foi possível obter sua localização atual.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { location, errorMsg, loading, permissionGranted };
}