/**
 * @format
 */
import React from 'react';
import { AppRegistry } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import App from './App';
import { name as appName } from './app.json';
import PushNotification from 'react-native-push-notification';

// ✅ Create notification channel once
PushNotification.createChannel(
  {
    channelId: 'daily-reminder',
    channelName: 'Daily Reminder',
    channelDescription: 'Daily trading reminders',
    importance: 4,
    vibrate: true,
  },
  (created) => console.log(`🔔 Notification channel created: ${created}`)
);

// ✅ Safe daily scheduling helper (no SCHEDULE_EXACT_ALARM required)
const scheduleDailyNotification = (hour, minute, title, message) => {
  const now = new Date();
  let firstTime = new Date();
  firstTime.setHours(hour, minute, 0, 0);

  // If the time has already passed today, schedule for tomorrow
  if (firstTime <= now) {
    firstTime.setDate(firstTime.getDate() + 1);
  }

  // Cancel old one before scheduling again
  PushNotification.cancelLocalNotifications({ id: `${hour}${minute}` });

  PushNotification.localNotificationSchedule({
    channelId: 'daily-reminder',
    id: `${hour}${minute}`, // unique per reminder
    title,
    message,
    repeatType: 'day',      // ✅ daily repeat (safe, inexact)
    allowWhileIdle: true,
  });
};

// ✅ Headless task for BOOT_COMPLETED (reschedules after reboot)
AppRegistry.registerHeadlessTask('SendDailyNotifications', () => async () => {
  console.log("📱 BOOT_COMPLETED: Rescheduling daily notifications");

  scheduleDailyNotification(
    8,
    30,
    'Start Your Trading Day Right! 🌅',
    'New day, new gains! Set your levels and trade with confidence 📈'
  );

  scheduleDailyNotification(
    19,
    0,
    'Market Wrap-Up 📊',
    'Closing bell done! Calculate levels & plan tomorrow’s trades 📊'
  );
});

// ✅ Schedule when app is opened normally
scheduleDailyNotification(
  8,
  30,
  'Start Your Trading Day Right! 🌅',
  'New day, new gains! Set your levels and trade with confidence 📈'
);

scheduleDailyNotification(
  19,
  0,
  'Market Wrap-Up 📊',
  'Closing bell done! Calculate levels & plan tomorrow’s trades 📊'
);

// ✅ Root app
const RootApp = () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <App />
  </GestureHandlerRootView>
);

AppRegistry.registerComponent(appName, () => RootApp);
