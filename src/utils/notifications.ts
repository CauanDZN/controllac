import * as Notifications from 'expo-notifications';
import {Platform} from 'react-native';

import {notificationLogStorage} from '@/storage/notificationLogStorage';

const CHANNEL_ID = 'expiration-reminders';
const REMINDER_LEAD_DAYS = 3;
const REMINDER_HOUR = 9;

export async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }

  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Avisos de validade',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

export async function requestPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();

  if (current.granted) {
    return true;
  }

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

interface ScheduleReminderInput {
  productName: string;
  expirationDateISO: string;
}

export async function scheduleExpirationReminder({
  productName,
  expirationDateISO,
}: ScheduleReminderInput): Promise<string | undefined> {
  const hasPermission = await requestPermission();

  if (!hasPermission) {
    return undefined;
  }

  const reminderDate = new Date(`${expirationDateISO}T00:00:00`);
  reminderDate.setDate(reminderDate.getDate() - REMINDER_LEAD_DAYS);
  reminderDate.setHours(REMINDER_HOUR, 0, 0, 0);

  if (reminderDate.getTime() <= Date.now()) {
    return undefined;
  }

  const title = 'Lote vencendo em breve';
  const body = `${productName} vence em ${REMINDER_LEAD_DAYS} dias.`;

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {title, body},
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: reminderDate,
      channelId: CHANNEL_ID,
    },
  });

  await notificationLogStorage.add({
    title,
    body,
    scheduledFor: reminderDate.toISOString(),
  });

  return notificationId;
}

export async function cancelReminder(notificationId?: string): Promise<void> {
  if (!notificationId) {
    return;
  }

  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

interface LowStockInput {
  productName: string;
  currentStock: number;
  minimumStock: number;
}

export async function notifyLowStock({
  productName,
  currentStock,
  minimumStock,
}: LowStockInput): Promise<void> {
  const hasPermission = await requestPermission();

  if (!hasPermission) {
    return;
  }

  const title = 'Estoque baixo';
  const body = `${productName} está com ${currentStock} unidade(s), abaixo do mínimo de ${minimumStock}.`;

  await Notifications.scheduleNotificationAsync({
    content: {title, body},
    trigger: null,
  });

  await notificationLogStorage.add({
    title,
    body,
    scheduledFor: new Date().toISOString(),
  });
}
