import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useFocusEffect } from '@react-navigation/native';
import { getTasksComLocalizacao } from '../../services/taskService';
import { PRIORITY_COLORS } from '../../components/PriorityBadge';
import { useUserLocation } from '../../hooks/useUserLocation';
 
const REGIAO_PADRAO = {
  latitude: -23.5505,
  longitude: -46.6333,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};
 
export default function MapScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  const mapRef = useRef(null);
  const { location } = useUserLocation();
 
  // ─── Busca de dados ────────────────────────────────────────────────────
 
  async function carregarTasks() {
    setLoading(true);
    setError(null);
    try {
      const data = await getTasksComLocalizacao();
      setTasks(data);
    } catch (err) {
      setError('Não foi possível carregar as tarefas no mapa.');
    } finally {
      setLoading(false);
    }
  }
 
  // Recarrega sempre que a aba do mapa ganha foco — assim, tarefas criadas
  // ou editadas na aba de Tarefas aparecem atualizadas aqui.
  useFocusEffect(
    useCallback(() => {
      carregarTasks();
    }, [])
  );
 
  // ─── Ações ─────────────────────────────────────────────────────────────
 
  function centralizarNaLocalizacaoAtual() {
    if (!location || !mapRef.current) return;
    mapRef.current.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  }
 
  function abrirDetalhe(task) {
    navigation.navigate('TaskDetail', { task });
  }
 
  // ─── Render ────────────────────────────────────────────────────────────
 
  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#6366F1" />
      </SafeAreaView>
    );
  }
 
  const regiaoInicial = location
    ? { latitude: location.latitude, longitude: location.longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 }
    : REGIAO_PADRAO;
 
  return (
    <SafeAreaView style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={regiaoInicial}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {tasks.map((task) => (
          <Marker
            key={task.id}
            coordinate={{ latitude: task.latitude, longitude: task.longitude }}
            pinColor={PRIORITY_COLORS[task.prioridade] || '#9CA3AF'}
            onCalloutPress={() => abrirDetalhe(task)}
          >
            <Callout onPress={() => abrirDetalhe(task)}>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle} numberOfLines={1}>{task.titulo}</Text>
                <Text style={styles.calloutSubtitle}>
                  {task.concluida ? '✅ Concluída' : '⏳ Pendente'} · Toque para detalhes
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
 
      {/* Botão de centralizar na localização atual */}
      <TouchableOpacity style={styles.locateBtn} onPress={centralizarNaLocalizacaoAtual}>
        <Text style={styles.locateBtnIcon}>🎯</Text>
      </TouchableOpacity>
 
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    flex: 1,
  },
  callout: {
    minWidth: 160,
    padding: 4,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  calloutSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  locateBtn: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  locateBtnIcon: {
    fontSize: 20,
  },
  errorBanner: {
    position: 'absolute',
    top: 12,
    left: 16,
    right: 16,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 10,
  },
  errorText: {
    fontSize: 12,
    color: '#B91C1C',
    textAlign: 'center',
  },
});
