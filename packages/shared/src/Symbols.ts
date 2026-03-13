export const Symbols = {
  // Application
  StreamSelector: Symbol.for("StreamSelector"),
  ConnectionService: Symbol.for("ConnectionService"),
  ConfigurationService: Symbol.for("ConfigurationService"),
  TournamentService: Symbol.for("TournamentService"),
  DailyMatchesNotificationService: Symbol.for(
    "DailyMatchesNotificationService",
  ),

  // Caches
  Cache: Symbol.for("Cache"),
  ChannelConfigurationCache: Symbol.for("ChannelConfigurationCache"),

  // Repositories
  ChannelConfigurationRepository: Symbol.for("ChannelConfigurationRepository"),
  TournamentRepository: Symbol.for("TournamentRepository"),

  // Notification scheduling
  DailyNotificationScheduler: Symbol.for("DailyNotificationScheduler"),
};
