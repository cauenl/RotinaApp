import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// ─────────────────────────────────────────────────────────────────────────
// Define como as notificações são exibidas enquanto o app está em primeiro
// plano. Sem isso, notificações não apareceriam com o app aberto.
// ─────────────────────────────────────────────────────────────────────────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// ─────────────────────────────────────────────────────────────────────────
// Pede permissão para exibir notificações.
// Retorna true se concedida, false caso contrário.
// ─────────────────────────────────────────────────────────────────────────
export async function pedirPermissaoNotificacoes() {
  const { status: statusAtual } = await Notifications.getPermissionsAsync();

  if (statusAtual === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();

  if (status !== 'granted') return false;

  // No Android, a partir da versão 8 (API 26), é necessário criar um
  // "canal" de notificação antes de disparar qualquer notificação.
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('proximidade', {
      name: 'Alertas de Proximidade',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#6366F1',
    });
  }

  return true;
}

// ─────────────────────────────────────────────────────────────────────────
// Dispara uma notificação local imediata para uma tarefa específica.
// ─────────────────────────────────────────────────────────────────────────
export async function notificarProximidade(task) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '📍 Você está perto!',
      body: `Tarefa pendente aqui: "${task.titulo}"`,
      data: { taskId: task.id },
      ...(Platform.OS === 'android' && { channelId: 'proximidade' }),
    },
    trigger: null, // null = dispara imediatamente
  });
}
