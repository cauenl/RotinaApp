import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { toggleConcluida, deleteTask } from '../../services/taskService';
import PriorityBadge from '../../components/PriorityBadge';
 
export default function TaskDetailScreen({ navigation, route }) {
  const { task: taskInicial } = route.params;
  const [task, setTask] = useState(taskInicial);
  const [loading, setLoading] = useState(false);
 
  // ─── Ações ─────────────────────────────────────────────────────────────
 
  async function handleToggle() {
    setLoading(true);
    try {
      const atualizada = await toggleConcluida(task.id, task.concluida);
      setTask(atualizada);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível atualizar a tarefa.');
    } finally {
      setLoading(false);
    }
  }
 
  function handleEdit() {
    // Navega para a aba "Tasks" e abre o formulário já preenchido.
    // getParent() pega o Tab Navigator, que é quem conhece a aba "Tasks".
    navigation.getParent()?.navigate('Tasks', {
      screen: 'TaskForm',
      params: { task },
    });
  }
 
  function handleDelete() {
    Alert.alert(
      'Excluir tarefa',
      `Tem certeza que deseja excluir "${task.titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(task.id);
              navigation.goBack();
            } catch (err) {
              Alert.alert('Erro', 'Não foi possível excluir a tarefa.');
            }
          },
        },
      ]
    );
  }
 
  // ─── Render ────────────────────────────────────────────────────────────
 
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
      </View>
 
      {/* Mini-mapa centrado na tarefa */}
      <MapView
        style={styles.miniMap}
        initialRegion={{
          latitude: task.latitude,
          longitude: task.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        scrollEnabled={false}
        zoomEnabled={false}
      >
        <Marker coordinate={{ latitude: task.latitude, longitude: task.longitude }} />
      </MapView>
 
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, task.concluida && styles.titleDone]}>
            {task.titulo}
          </Text>
          <PriorityBadge prioridade={task.prioridade} />
        </View>
 
        {task.descricao ? (
          <Text style={styles.description}>{task.descricao}</Text>
        ) : null}
 
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Status:</Text>
          <Text style={[styles.statusValue, task.concluida ? styles.statusDone : styles.statusPending]}>
            {task.concluida ? '✅ Concluída' : '⏳ Pendente'}
          </Text>
        </View>
 
        {/* Ações */}
        <TouchableOpacity
          style={[styles.actionBtn, styles.toggleBtn]}
          onPress={handleToggle}
          disabled={loading}
        >
          <Text style={styles.toggleBtnText}>
            {task.concluida ? 'Marcar como pendente' : 'Marcar como concluída'}
          </Text>
        </TouchableOpacity>
 
        <TouchableOpacity style={[styles.actionBtn, styles.editBtn]} onPress={handleEdit}>
          <Text style={styles.editBtnText}>Editar tarefa</Text>
        </TouchableOpacity>
 
        <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={handleDelete}>
          <Text style={styles.deleteBtnText}>Excluir tarefa</Text>
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
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backText: {
    fontSize: 15,
    color: '#6366F1',
    fontWeight: '500',
  },
  miniMap: {
    height: 180,
  },
  content: {
    padding: 20,
    gap: 14,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  statusValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  statusDone: {
    color: '#10B981',
  },
  statusPending: {
    color: '#F59E0B',
  },
  actionBtn: {
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 6,
  },
  toggleBtn: {
    backgroundColor: '#6366F1',
  },
  toggleBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  editBtn: {
    backgroundColor: '#F3F4F6',
  },
  editBtnText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 14,
  },
  deleteBtn: {
    backgroundColor: '#FEE2E2',
  },
  deleteBtnText: {
    color: '#EF4444',
    fontWeight: '600',
    fontSize: 14,
  },
});
