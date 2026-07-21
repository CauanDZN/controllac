import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = '@controllac:onboardingSeen';
const NOTIFICATIONS_WARNING_KEY = '@controllac:notificationsWarningShown';

async function hasSeenOnboarding(): Promise<boolean> {
  return (await AsyncStorage.getItem(ONBOARDING_KEY)) === 'true';
}

async function markOnboardingSeen(): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
}

async function hasWarnedNotificationsDisabled(): Promise<boolean> {
  return (await AsyncStorage.getItem(NOTIFICATIONS_WARNING_KEY)) === 'true';
}

async function markWarnedNotificationsDisabled(): Promise<void> {
  await AsyncStorage.setItem(NOTIFICATIONS_WARNING_KEY, 'true');
}

export const settingsStorage = {
  hasSeenOnboarding,
  markOnboardingSeen,
  hasWarnedNotificationsDisabled,
  markWarnedNotificationsDisabled,
};
