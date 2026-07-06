import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import { createTask, updateTask } from '../../services/taskService';
import { PRIORITY_COLORS, PRIORITY_LABELS } from '../../components/PriorityBadge';
 
const PRIORIDADES = ['alta', 'media', 'baixa'];
 
export default function TaskFormScreen({ navigation, route }) {
  // Se veio uma task pela rota, estamos editando; senão, criando uma nova
  const taskExistente = route.params?.task;
  const isEditing = !!taskExistente;
 
  const [titulo, setTitulo] = useState(taskExistente?.titulo ?? '');
  const [descricao, setDescricao] = useState(taskExistente?.descricao ?? '');
  const [prioridade, setPrioridade] = useState(taskExistente?.prioridade ?? 'media');
  const [loading, setLoading] = useState(false);
  const [erroTitulo, setErroTitulo] = useState(null);
 
  // Localização: começa com a da tarefa (se estiver editando), e pode
  // ser atualizada quando o usuário volta da tela de seleção no mapa.
  const [localizacao, setLocalizacao] = useState(
    taskExistente?.latitude && taskExistente?.longitude
      ? { latitude: taskExistente.latitude, longitude: taskExistente.longitude }
      : null
  );
 
  // Quando a LocationPickerScreen devolve um local escolhido via
  // navigation.navigate(..., { selectedLocation }), capturamos aqui.
  useEffect(() => {
    if (route.params?.selectedLocation) {
      setLocalizacao(route.params.selectedLocation);
    }
  }, [route.params?.selectedLocation]);
 
  // ─── Validação ────────────────────────────────────────────────────────
 
  function validate() {
    if (!titulo.trim()) {
      setErroTitulo('O título é obrigatório');
      return false;
    }
    setErroTitulo(null);
    return true;
  }
 
  // ─── Submit ──────────────────────────────────────────────────────────
 
  async function handleSave() {
    if (!validate()) return;
    setLoading(true);
 
    try {
      const dados = {
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        prioridade,
        latitude: localizacao?.latitude ?? null,
        longitude: localizacao?.longitude ?? null,
      };
 
      if (isEditing) {
        await updateTask(taskExistente.id, dados);
      } else {
        await createTask(dados);
      }
 
      navigation.goBack();
    } catch (err) {
      Alert.alert(
        'Erro ao salvar',
        'Não foi possível salvar a tarefa. Verifique sua conexão e tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  }
 
  function handleSelectLocation() {
    navigation.navigate('LocationPicker', {
      latitude: localizacao?.latitude,
      longitude: localizacao?.longitude,
    });
  }
 
  // ─── Render ────────────────────────────────────────────────────────────
 
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} disabled={loading}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}
          </Text>
          <View style={{ width: 60 }} />
        </View>
 
        <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
          {/* Título */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Título</Text>
            <TextInput
              style={[styles.input, erroTitulo && styles.inputError]}
              placeholder="Ex: Passar no mercado"
              placeholderTextColor="#9CA3AF"
              value={titulo}
              onChangeText={(t) => { setTitulo(t); setErroTitulo(null); }}
              editable={!loading}
            />
            {erroTitulo ? <Text style={styles.errorText}>{erroTitulo}</Text> : null}
          </View>
 
          {/* Descrição */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Descrição (opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Detalhes da tarefa..."
              placeholderTextColor="#9CA3AF"
              value={descricao}
              onChangeText={setDescricao}
              multiline
              numberOfLines={4}
              editable={!loading}
            />
          </View>
 
          {/* Prioridade */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Prioridade</Text>
            <View style={styles.priorityRow}>
              {PRIORIDADES.map((p) => {
                const ativo = prioridade === p;
                const cor = PRIORITY_COLORS[p];
                return (
                  <TouchableOpacity
                    key={p}
                    style={[
                      styles.priorityOption,
                      { borderColor: cor },
                      ativo && { backgroundColor: cor },
                    ]}
                    onPress={() => setPrioridade(p)}
                    disabled={loading}
                  >
                    <Text style={[styles.priorityText, { color: ativo ? '#fff' : cor }]}>
                      {PRIORITY_LABELS[p]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
 
          {/* Localização */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Localização</Text>
            <TouchableOpacity
              style={[styles.locationBtn, localizacao && styles.locationBtnSet]}
              onPress={handleSelectLocation}
              disabled={loading}
            >
              <Text style={[styles.locationBtnText, localizacao && styles.locationBtnTextSet]}>
                {localizacao
                  ? `📍 ${localizacao.latitude.toFixed(5)}, ${localizacao.longitude.toFixed(5)}`
                  : '📍 Escolher local no mapa'}
              </Text>
            </TouchableOpacity>
            {localizacao && (
              <TouchableOpacity onPress={() => setLocalizacao(null)} disabled={loading}>
                <Text style={styles.removeLocationText}>Remover local</Text>
              </TouchableOpacity>
            )}
          </View>
 
          {/* Botão salvar */}
          <TouchableOpacity
            style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.saveBtnText}>{isEditing ? 'Salvar alterações' : 'Criar tarefa'}</Text>
            }
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  form: {
    padding: 20,
    gap: 20,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 13,
    fontWeight: '600',
  },
  locationBtn: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  locationBtnSet: {
    backgroundColor: '#EEF2FF',
  },
  locationBtnText: {
    color: '#6B7280',
    fontSize: 14,
  },
  locationBtnTextSet: {
    color: '#4F46E5',
    fontWeight: '500',
  },
  removeLocationText: {
    fontSize: 12,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 4,
  },
  saveBtn: {
    backgroundColor: '#6366F1',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
