import * as Notifications from 'expo-notifications';
import {Platform} from 'react-native';

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

  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Lote vencendo em breve',
      body: `${productName} vence em ${REMINDER_LEAD_DAYS} dias.`,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: reminderDate,
      channelId: CHANNEL_ID,
    },
  });
}

export async function cancelReminder(notificationId?: string): Promise<void> {
  if (!notificationId) {
    return;
  }

  await Notifications.cancelScheduledNotificationAsync(notificationId);
}
