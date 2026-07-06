import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PriorityBadge, { PRIORITY_COLORS } from './PriorityBadge';

export default function TaskCard({ task, onPress, onToggle, onDelete }) {
  const corPrioridade = PRIORITY_COLORS[task.prioridade] || '#9CA3AF';

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: corPrioridade }, task.concluida && styles.cardDone]}
      onPress={() => onPress(task)}
      activeOpacity={0.7}
    >
      {/* Checkbox de conclusão */}
      <TouchableOpacity
        style={[styles.checkbox, task.concluida && styles.checkboxChecked]}
        onPress={() => onToggle(task)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        {task.concluida && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>

      {/* Conteúdo */}
      <View style={styles.content}>
        <Text style={[styles.title, task.concluida && styles.titleDone]} numberOfLines={1}>
          {task.titulo}
        </Text>
        {task.descricao ? (
          <Text style={styles.description} numberOfLines={1}>
            {task.descricao}
          </Text>
        ) : null}
        <View style={styles.footer}>
          <PriorityBadge prioridade={task.prioridade} />
          {task.latitude ? <Text style={styles.pinIcon}>📍</Text> : null}
        </View>
      </View>

      {/* Excluir */}
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => onDelete(task)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.deleteIcon}>🗑️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardDone: { opacity: 0.6 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: { backgroundColor: '#6366F1', borderColor: '#6366F1' },
  checkmark: { color: '#fff', fontSize: 12, fontWeight: '700' },
  content: { flex: 1, gap: 4 },
  title: { fontSize: 15, fontWeight: '600', color: '#111827' },
  titleDone: { textDecorationLine: 'line-through', color: '#9CA3AF' },
  description: { fontSize: 13, color: '#6B7280' },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  pinIcon: { fontSize: 11 },
  deleteBtn: { padding: 8 },
  deleteIcon: { fontSize: 16 },
});
