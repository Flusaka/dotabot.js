export interface DailyMatchesNotificationService {
  notify(channelId: BigInt): Promise<void>;
}
