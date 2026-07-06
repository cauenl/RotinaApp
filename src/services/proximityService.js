import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { getTasksComLocalizacao } from './taskService';
import { calcularDistancia } from '../utils/haversine';
import { notificarProximidade } from './notificationService';

const CHAVE_JA_NOTIFICADAS = 'rotinaapp:tarefas_notificadas';
const RAIO_PADRAO_METROS = 200;

// ─────────────────────────────────────────────────────────────────────────
// Retorna o conjunto de IDs de tarefas que já foram notificadas hoje.
// Usando AsyncStorage para persistir entre execuções do background task.
// ─────────────────────────────────────────────────────────────────────────
async function getIdsJaNotificados() {
  try {
    const raw = await AsyncStorage.getItem(CHAVE_JA_NOTIFICADAS);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

async function marcarComoNotificada(id) {
  try {
    const ids = await getIdsJaNotificados();
    ids.add(id);
    await AsyncStorage.setItem(CHAVE_JA_NOTIFICADAS, JSON.stringify([...ids]));
  } catch {
    // falha silenciosa — melhor não notificar do que travar
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Limpa o histórico de notificadas — chamado uma vez por dia ou
// quando o usuário pede nas configurações.
// ─────────────────────────────────────────────────────────────────────────
export async function limparHistoricoNotificacoes() {
  await AsyncStorage.removeItem(CHAVE_JA_NOTIFICADAS);
}

// ─────────────────────────────────────────────────────────────────────────
// Função principal: verifica se o usuário está perto de alguma tarefa
// pendente e ainda não notificada. Chamada tanto em foreground quanto
// pelo background task.
//
// raioMetros: configurável pelo usuário na tela de Settings
// ─────────────────────────────────────────────────────────────────────────
export async function verificarProximidade(raioMetros = RAIO_PADRAO_METROS) {
  // 1. Obter localização atual
  let posicao;
  try {
    posicao = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
  } catch (err) {
    return; // sem localização, nada a fazer
  }

  const { latitude, longitude } = posicao.coords;

  // 2. Buscar tarefas com localização
  let tasks;
  try {
    tasks = await getTasksComLocalizacao();
  } catch {
    return;
  }

  // 3. Filtrar só as pendentes
  const pendentes = tasks.filter((t) => !t.concluida);
  if (pendentes.length === 0) return;

  // 4. Checar quais já foram notificadas
  const jaNotificadas = await getIdsJaNotificados();

  // 5. Para cada tarefa pendente, calcular distância e notificar se necessário
  for (const task of pendentes) {
    if (jaNotificadas.has(task.id)) continue;

    const distancia = calcularDistancia(
      latitude,
      longitude,
      task.latitude,
      task.longitude
    );

    if (distancia <= raioMetros) {
      await notificarProximidade(task);
      await marcarComoNotificada(task.id);
    }
  }
}
