export const Symbols = {
  // Application
  StreamSelector: Symbol.for("StreamSelector"),
  ConnectionService: Symbol.for("ConnectionService"),
  ConfigurationService: Symbol.for("ConfigurationService"),
  TournamentService: Symbol.for("TournamentService"),

  // Caches
  Cache: Symbol.for("Cache"),
  ChannelConfigurationCache: Symbol.for("ChannelConfigurationCache"),

  // Repositories
  ChannelConfigurationRepository: Symbol.for("ChannelConfigurationRepository"),
  TournamentRepository: Symbol.for("TournamentRepository"),
};
