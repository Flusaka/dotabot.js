export interface DailyMatchesNotificationService {
  notify(channelId: string): Promise<void>;
}
