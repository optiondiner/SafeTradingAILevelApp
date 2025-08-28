import React, { useEffect } from 'react';
import { AppRegistry } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import App from './App';
import { name as appName } from './app.json';
import notifee, { TriggerType, RepeatFrequency, AndroidImportance } from '@notifee/react-native';

// ✅ Create channel once
async function createChannel() {
  await notifee.createChannel({
    id: 'daily-reminder',
    name: 'Daily Reminder',
    description: 'Daily trading reminders',
    importance: AndroidImportance.HIGH,
  });
}

// ✅ Helper to schedule daily notification
async function scheduleDailyNotification(hour, minute, title, body) {
  const now = new Date();
  let triggerDate = new Date();
  triggerDate.setHours(hour, minute, 0, 0);

  // If time already passed today, schedule for tomorrow
  if (triggerDate <= now) {
    triggerDate.setDate(triggerDate.getDate() + 1);
  }

  const trigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: triggerDate.getTime(),
    repeatFrequency: RepeatFrequency.DAILY,
    alarmManager: { allowWhileIdle: true },
  };

  await notifee.createTriggerNotification(
    {
      title,
      body,
      android: { channelId: 'daily-reminder' },
    },
    trigger
  );
}

const RootApp = () => {
  useEffect(() => {
    (async () => {
      await createChannel();

      await scheduleDailyNotification(
        8,
        30,
        'Start Your Trading Day Right! 🌅',
        'New day, new gains! Set your levels and trade with confidence 📈'
      );

      await scheduleDailyNotification(
        19,
        0,
        'Market Wrap-Up 📊',
        'Closing bell done! Calculate levels & plan tomorrow’s trades 📊'
      );
    })();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <App />
    </GestureHandlerRootView>
  );
};

AppRegistry.registerComponent(appName, () => RootApp);
