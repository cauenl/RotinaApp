import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useUserLocation } from '../../hooks/useUserLocation';
 
// Região padrão caso a localização do usuário não esteja disponível
// (ex: permissão negada) — usamos um valor genérico só para o mapa abrir.
const REGIAO_PADRAO = {
  latitude: -23.5505,
  longitude: -46.6333,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};
 
export default function LocationPickerScreen({ navigation, route }) {
  // Se a tarefa já tinha uma localização salva, começamos o pin nela;
  // senão, começamos na localização atual do usuário.
  const localExistente = route.params?.latitude && route.params?.longitude
    ? { latitude: route.params.latitude, longitude: route.params.longitude }
    : null;
 
  const { location, loading: loadingLocation } = useUserLocation();
 
  const [marcador, setMarcador] = useState(localExistente);
 
  // Região inicial do mapa: local já salvo > localização atual > padrão
  const regiaoInicial = localExistente
    ? { ...localExistente, latitudeDelta: 0.01, longitudeDelta: 0.01 }
    : location
      ? { latitude: location.latitude, longitude: location.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 }
      : REGIAO_PADRAO;
 
  function handleMapPress(event) {
    setMarcador(event.nativeEvent.coordinate);
  }
 
function handleConfirm() {
  if (!marcador) return;
  // Volta para a tela TaskForm já existente na pilha, enviando o local escolhido
  navigation.popTo('TaskForm', { selectedLocation: marcador });
}
 
  if (loadingLocation) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Obtendo sua localização...</Text>
      </SafeAreaView>
    );
  }
 
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Escolher local</Text>
        <View style={{ width: 60 }} />
      </View>
 
      <MapView
        style={styles.map}
        initialRegion={regiaoInicial}
        onPress={handleMapPress}
      >
        {marcador && (
          <Marker
            coordinate={marcador}
            draggable
            onDragEnd={(e) => setMarcador(e.nativeEvent.coordinate)}
            pinColor="#6366F1"
          />
        )}
      </MapView>
 
      <View style={styles.footer}>
        <Text style={styles.hint}>
          {marcador
            ? 'Arraste o pin para ajustar, ou toque em outro ponto do mapa'
            : 'Toque em um ponto do mapa para marcar o local da tarefa'}
        </Text>
        <TouchableOpacity
          style={[styles.confirmBtn, !marcador && styles.confirmBtnDisabled]}
          onPress={handleConfirm}
          disabled={!marcador}
        >
          <Text style={styles.confirmBtnText}>Confirmar local</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cancelText: {
    fontSize: 15,
    color: '#6B7280',
    width: 60,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  map: {
    flex: 1,
  },
  footer: {
    padding: 16,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  hint: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  confirmBtn: {
    backgroundColor: '#6366F1',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmBtnDisabled: {
    opacity: 0.5,
  },
  confirmBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
