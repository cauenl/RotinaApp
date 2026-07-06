import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getTasks, deleteTask, toggleConcluida } from '../../services/taskService';
import TaskCard from '../../components/TaskCard';
import FilterBar from '../../components/FilterBar';
 
export default function TaskListScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('todas');
  const [prioridade, setPrioridade] = useState('todas');
 
  // ─── Busca de dados ────────────────────────────────────────────────────
 
  async function carregarTarefas({ isRefresh = false } = {}) {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
 
    try {
      const data = await getTasks({ status, prioridade });
      setTasks(data);
    } catch (err) {
      setError('Não foi possível carregar as tarefas. Verifique sua conexão.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }
 
  // Recarrega sempre que a tela ganha foco (ex: voltando do formulário)
  // ou quando os filtros mudam.
  useFocusEffect(
    useCallback(() => {
      carregarTarefas();
    }, [status, prioridade])
  );
 
  // ─── Ações ─────────────────────────────────────────────────────────────
 
  async function handleToggle(task) {
    // Atualização otimista: muda a UI antes da resposta do servidor
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, concluida: !t.concluida } : t))
    );
 
    try {
      await toggleConcluida(task.id, task.concluida);
    } catch (err) {
      // Se falhar, desfaz a mudança local
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, concluida: task.concluida } : t))
      );
      Alert.alert('Erro', 'Não foi possível atualizar a tarefa.');
    }
  }
 
  function handleDelete(task) {
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
              setTasks((prev) => prev.filter((t) => t.id !== task.id));
            } catch (err) {
              Alert.alert('Erro', 'Não foi possível excluir a tarefa.');
            }
          },
        },
      ]
    );
  }
 
  function handleOpenTask(task) {
    navigation.navigate('TaskForm', { task });
  }
 
  // ─── Render ────────────────────────────────────────────────────────────
 
  function renderContent() {
    if (loading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      );
    }
 
    if (error) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => carregarTarefas()}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }
 
    if (tasks.length === 0) {
      const filtrosAtivos = status !== 'todas' || prioridade !== 'todas';
      return (
        <View style={styles.centered}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>
            {filtrosAtivos ? 'Nenhuma tarefa encontrada' : 'Nenhuma tarefa ainda'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {filtrosAtivos
              ? 'Tente mudar os filtros selecionados'
              : 'Toque no botão + para criar sua primeira tarefa'}
          </Text>
        </View>
      );
    }
 
    return (
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onPress={handleOpenTask}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => carregarTarefas({ isRefresh: true })} />
        }
      />
    );
  }
 
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minhas Tarefas</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('TaskForm')}
        >
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>
 
      <FilterBar
        status={status}
        prioridade={prioridade}
        onChangeStatus={setStatus}
        onChangePrioridade={setPrioridade}
      />
 
      {renderContent()}
    </SafeAreaView>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
    marginTop: -2,
  },
  list: {
    padding: 16,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 8,
  },
  retryBtn: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
