export interface DailyMatchesNotificationService {
  notify(channelId: bigint): Promise<void>;
}
