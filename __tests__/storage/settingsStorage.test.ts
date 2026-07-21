import AsyncStorage from '@react-native-async-storage/async-storage';

import {settingsStorage} from '@/storage/settingsStorage';

describe('settingsStorage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('defaults onboarding as not seen', async () => {
    expect(await settingsStorage.hasSeenOnboarding()).toBe(false);
  });

  it('marks onboarding as seen', async () => {
    await settingsStorage.markOnboardingSeen();
    expect(await settingsStorage.hasSeenOnboarding()).toBe(true);
  });

  it('defaults the notifications warning as not shown', async () => {
    expect(await settingsStorage.hasWarnedNotificationsDisabled()).toBe(false);
  });

  it('marks the notifications warning as shown', async () => {
    await settingsStorage.markWarnedNotificationsDisabled();
    expect(await settingsStorage.hasWarnedNotificationsDisabled()).toBe(true);
  });
});
