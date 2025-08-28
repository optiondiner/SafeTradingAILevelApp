import PushNotification from "react-native-push-notification";

export const scheduleDailyNotification = (
  hour: number,
  minute: number,
  title: string,
  message: string
) => {
  const now = new Date();
  const notifTime = new Date();
  notifTime.setHours(hour, minute, 0, 0);

  if (notifTime <= now) {
    notifTime.setDate(notifTime.getDate() + 1); // push to tomorrow if past
  }

  PushNotification.localNotificationSchedule({
    channelId: "daily-reminder",
    title,
    message,
    date: notifTime,
    allowWhileIdle: true, // works even if phone is idle
    // 👇 trigger rescheduling when it fires
    userInfo: { hour, minute, title, message },
  } as any);
};
