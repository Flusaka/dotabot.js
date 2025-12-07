export const Types = {
  // Bot-related injections
  TournamentEmbedMessageBuilder: Symbol.for("TournamentMessageBuilder"),

  // Database
  PrismaClient: Symbol.for("PrismaClient"),

  // Repositories
  ChannelConfigurationRepository: Symbol.for("ChannelConfigurationRepository"),
  TournamentRepository: Symbol.for("TournamentRepository"),

  // Services
  ConnectionService: Symbol.for("ConnectionService"),
  ConfigurationService: Symbol.for("ConfigurationService"),
  TournamentService: Symbol.for("TournamentService"),
};
