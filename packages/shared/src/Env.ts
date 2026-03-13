const EnvironmentVariables = {
  DiscordToken: "DISCORD_TOKEN",
  GuildId: "GUILD_ID",
  NotificationDatabaseHost: "NOTIFICATION_DATABASE_HOST",
  NotificationDatabasePort: "NOTIFICATION_DATABASE_PORT",
} as const;
type EnvironmentVariables =
  (typeof EnvironmentVariables)[keyof typeof EnvironmentVariables];

export class Env {
  static getString(envVar: EnvironmentVariables, defaultValue?: string) {
    const variable = process.env[envVar];
    if (!variable) {
      if (!defaultValue) {
        throw new Error(
          `Required environment variable ${envVar} not specified!`,
        );
      }
      return defaultValue;
    }
    return variable;
  }

  static getNumber(envVar: EnvironmentVariables, defaultValue?: number) {
    const variable = process.env[envVar];
    if (!variable) {
      if (!defaultValue) {
        throw new Error(
          `Required environment variable ${envVar} not specified!`,
        );
      }
      return defaultValue;
    }
    return Number(variable);
  }
}
