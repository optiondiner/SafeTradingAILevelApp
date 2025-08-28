declare module 'react-native-push-notification' {
    interface PushNotificationObject {
      channelId: string;
      title: string;
      message: string;
      date?: Date;
      repeatType?: 'day' | 'week' | 'month' | 'time';
      playSound?: boolean;
      soundName?: string;
      number?: number;
       allowWhileIdle?: boolean;
      // Add more properties as needed
    }
  
    interface PushNotificationChannel {
      channelId: string;
      channelName: string;
      channelDescription?: string;
      soundName?: string;
      importance?: number;
      vibrate?: boolean;
    }
  
    const PushNotification: {
      configure(options: any): void;
      createChannel(channel: PushNotificationChannel, callback: (created: boolean) => void): void;
      localNotification(notification: PushNotificationObject): void;
      localNotificationSchedule(notification: PushNotificationObject): void;
      cancelAllLocalNotifications(): void;
    };
  
    export default PushNotification;
  }
  