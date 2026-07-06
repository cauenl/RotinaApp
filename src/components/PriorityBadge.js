import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
 
// Mapa de cores por prioridade — reutilizado em vários lugares do app
export const PRIORITY_COLORS = {
  alta: '#EF4444',
  media: '#F59E0B',
  baixa: '#10B981',
};
 
export const PRIORITY_LABELS = {
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa',
};
 
export default function PriorityBadge({ prioridade }) {
  const cor = PRIORITY_COLORS[prioridade] || '#9CA3AF';
  const label = PRIORITY_LABELS[prioridade] || prioridade;
 
  return (
    <View style={[styles.badge, { backgroundColor: cor + '20' }]}>
      <View style={[styles.dot, { backgroundColor: cor }]} />
      <Text style={[styles.text, { color: cor }]}>{label}</Text>
    </View>
  );
}
 
const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 99,
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
  },
});
