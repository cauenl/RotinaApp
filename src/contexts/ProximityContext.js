import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_RAIO = 'rotinaapp:raio_metros';
const CHAVE_NOTIFICACOES_ATIVAS = 'rotinaapp:notificacoes_ativas';

const ProximityContext = createContext({});

export function ProximityProvider({ children }) {
  const [ativo, setAtivoState] = useState(false);
  const [raioMetros, setRaioMetrosState] = useState(200);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    (async () => {
      const raioSalvo = await AsyncStorage.getItem(CHAVE_RAIO);
      const notifSalvo = await AsyncStorage.getItem(CHAVE_NOTIFICACOES_ATIVAS);
      if (raioSalvo) setRaioMetrosState(parseInt(raioSalvo));
      if (notifSalvo !== null) setAtivoState(notifSalvo === 'true');
      setCarregado(true);
    })();
  }, []);

  async function setAtivo(valor) {
    setAtivoState(valor);
    await AsyncStorage.setItem(CHAVE_NOTIFICACOES_ATIVAS, String(valor));
  }

  async function setRaioMetros(valor) {
    setRaioMetrosState(valor);
    await AsyncStorage.setItem(CHAVE_RAIO, String(valor));
  }

  return (
    <ProximityContext.Provider value={{ ativo, raioMetros, setAtivo, setRaioMetros, carregado }}>
      {children}
    </ProximityContext.Provider>
  );
}

export function useProximity() {
  return useContext(ProximityContext);
}