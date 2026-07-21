let counter = 0;

module.exports = {
  AndroidImportance: {DEFAULT: 3},
  SchedulableTriggerInputTypes: {DATE: 'date'},
  setNotificationChannelAsync: jest.fn(async () => null),
  getPermissionsAsync: jest.fn(async () => ({
    granted: true,
    status: 'granted',
  })),
  requestPermissionsAsync: jest.fn(async () => ({
    granted: true,
    status: 'granted',
  })),
  scheduleNotificationAsync: jest.fn(async () => `notification-${++counter}`),
  cancelScheduledNotificationAsync: jest.fn(async () => {}),
};
