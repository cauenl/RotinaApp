import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import * as Location from 'expo-location';
import { verificarProximidade } from '../services/proximityService';

const INTERVALO_MS = 30000; // verifica a cada 30 segundos

export function useProximityWatcher(ativo, raioMetros) {
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!ativo) {
      return;
    }

    let cancelado = false;

    async function iniciar() {
      if (intervalRef.current || cancelado) return;

      // Garante que temos permissão de localização em primeiro plano
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted' || cancelado) return;

      const rodar = () => verificarProximidade(raioMetros);
      rodar(); // roda uma vez imediatamente ao ativar
      intervalRef.current = setInterval(rodar, INTERVALO_MS);
    }

    function parar() {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    iniciar();

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') iniciar();
      else parar();
    });

    return () => {
      cancelado = true;
      parar();
      subscription.remove();
    };
  }, [ativo, raioMetros]);
}