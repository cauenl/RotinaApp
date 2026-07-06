import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useProximity } from '../../contexts/ProximityContext';
import { pedirPermissaoNotificacoes } from '../../services/notificationService';
import { limparHistoricoNotificacoes } from '../../services/proximityService';

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const { ativo: notificacoesAtivas, raioMetros, setAtivo, setRaioMetros } = useProximity();

  const [raio, setRaio] = useState(String(raioMetros));
  const [raioErro, setRaioErro] = useState(null);
  const [salvando, setSalvando] = useState(false);

  // ─── Salvar raio ──────────────────────────────────────────────────────

  async function handleSalvarRaio() {
    const valor = parseInt(raio);
    if (isNaN(valor) || valor < 50 || valor > 5000) {
      setRaioErro('Informe um valor entre 50 e 5000 metros');
      return;
    }
    setRaioErro(null);
    setSalvando(true);
    await setRaioMetros(valor);
    setSalvando(false);
    Alert.alert('Salvo!', `Raio de alerta definido como ${valor} metros.`);
  }

  // ─── Toggle de notificações ───────────────────────────────────────────

  async function handleToggleNotificacoes(valor) {
    if (valor) {
      const permitido = await pedirPermissaoNotificacoes();
      if (!permitido) {
        Alert.alert(
          'Permissão negada',
          'Ative as notificações nas configurações do seu dispositivo para usar este recurso.'
        );
        return;
      }
      await setAtivo(true);
      Alert.alert(
        'Atenção',
        'O alerta de proximidade funciona enquanto o app estiver aberto. Ele não notifica com o app fechado ou minimizado.'
      );
    } else {
      await setAtivo(false);
    }
  }

  // ─── Limpar histórico ─────────────────────────────────────────────────

  function handleLimparHistorico() {
    Alert.alert(
      'Limpar histórico',
      'Isso fará o app voltar a notificar sobre tarefas que já foram alertadas. Continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          onPress: async () => {
            await limparHistoricoNotificacoes();
            Alert.alert('Feito!', 'Histórico de notificações limpo.');
          },
        },
      ]
    );
  }

  // ─── Render ──────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.pageTitle}>Configurações</Text>

        {/* Conta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONTA</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Logado como</Text>
              <Text style={styles.rowValue} numberOfLines={1}>{user?.email}</Text>
            </View>
            <View style={styles.separator} />
            <TouchableOpacity style={styles.row} onPress={signOut}>
              <Text style={[styles.rowLabel, styles.danger]}>Sair da conta</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notificações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NOTIFICAÇÕES</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Alertas de proximidade</Text>
              <Switch
                value={notificacoesAtivas}
                onValueChange={handleToggleNotificacoes}
                trackColor={{ false: '#E5E7EB', true: '#A5B4FC' }}
                thumbColor={notificacoesAtivas ? '#6366F1' : '#9CA3AF'}
              />
            </View>
            <View style={styles.separator} />
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Raio de alerta (metros)</Text>
            </View>
            <View style={styles.raioRow}>
              <TextInput
                style={[styles.raioInput, raioErro && styles.raioInputError]}
                value={raio}
                onChangeText={(t) => { setRaio(t); setRaioErro(null); }}
                keyboardType="numeric"
                placeholder="200"
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity
                style={[styles.salvarBtn, salvando && styles.salvarBtnDisabled]}
                onPress={handleSalvarRaio}
                disabled={salvando}
              >
                <Text style={styles.salvarBtnText}>Salvar</Text>
              </TouchableOpacity>
            </View>
            {raioErro && <Text style={styles.errorText}>{raioErro}</Text>}
            <Text style={styles.hint}>Mínimo: 50m · Máximo: 5000m · Padrão: 200m</Text>
            <View style={styles.separator} />
            <TouchableOpacity style={styles.row} onPress={handleLimparHistorico}>
              <Text style={styles.rowLabel}>Limpar histórico de notificações</Text>
              <Text style={styles.rowArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sobre */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SOBRE</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Versão</Text>
              <Text style={styles.rowValue}>1.0.0</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.row}>
              <Text style={styles.rowLabel}>RotinaApp</Text>
              <Text style={styles.rowValue}>Tarefas por localização</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  rowLabel: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
  },
  rowValue: {
    fontSize: 13,
    color: '#6B7280',
    maxWidth: 180,
    textAlign: 'right',
  },
  rowArrow: {
    fontSize: 18,
    color: '#9CA3AF',
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 14,
  },
  danger: {
    color: '#EF4444',
  },
  raioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingBottom: 8,
  },
  raioInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    color: '#111827',
  },
  raioInputError: {
    borderColor: '#EF4444',
  },
  salvarBtn: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
  },
  salvarBtnDisabled: {
    opacity: 0.6,
  },
  salvarBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  hint: {
    fontSize: 11,
    color: '#9CA3AF',
    paddingHorizontal: 14,
    paddingBottom: 10,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    paddingHorizontal: 14,
    paddingBottom: 6,
  },
});