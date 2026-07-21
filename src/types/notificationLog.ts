export type NotificationLogEntry = {
  id: string;
  title: string;
  body: string;
  scheduledFor: string;
  createdAt: string;
};

export type NotificationLogEntryInput = Omit<
  NotificationLogEntry,
  'id' | 'createdAt'
>;
