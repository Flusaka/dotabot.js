import {
  EnableDailyNotificationsResult,
  SetDailyNotificationTimeResult,
  type ConfigurationService,
} from "@dotabot.js/domain/service/ConfigurationService";
import type { ApplicationCommandRegistry, Command } from "@sapphire/framework";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { botContainer } from "di/container";
import { Symbols } from "@dotabot.js/shared/Symbols";
import { channelMention } from "discord.js";

const EnableOptionName = "enable";
const TimeOptionName = "time";

export class NotifyCommand extends Subcommand {
  private readonly _configurationService: ConfigurationService;

  constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: "notify",
      subcommands: [
        {
          name: "enable",
          chatInputRun: "chatInputEnableNotifications",
        },
        {
          name: "time",
          chatInputRun: "chatInputSetNotificationTime",
        },
      ],
    });
    this._configurationService = botContainer.get<ConfigurationService>(
      Symbols.ConfigurationService,
    );
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry,
  ) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("notify")
        .setDescription("Configure daily notifications")
        .addSubcommand((builder) =>
          builder
            .setName("enable")
            .setDescription("Enable or disable daily notifications")
            .addBooleanOption((option) =>
              option
                .setName(EnableOptionName)
                .setDescription(
                  "Whether daily notifications are enabled or disabled",
                )
                .setRequired(true),
            ),
        )
        .addSubcommand((builder) =>
          builder
            .setName("time")
            .setDescription("The time at which to send notifications each day")
            .addStringOption((option) =>
              option
                .setName(TimeOptionName)
                .setDescription("A 24-hour time format string e.g. 18:30")
                .setRequired(true),
            ),
        ),
    );
  }

  async chatInputEnableNotifications(
    interaction: Command.ChatInputCommandInteraction,
  ) {
    await interaction.deferReply();

    const enabled = interaction.options.getBoolean(EnableOptionName);
    if (enabled === null) {
      // TODO: Some invalid option reply
      return;
    }

    const channelId = BigInt(interaction.channelId);
    const result = await this._configurationService.enableDailyNotifications(
      channelId,
      enabled,
    );

    switch (result) {
      case EnableDailyNotificationsResult.Success: {
        await interaction.editReply(
          `Daily notifications successfully ${enabled ? "enabled" : "disabled"} for ${channelMention(interaction.channelId)}`,
        );
        break;
      }
      case EnableDailyNotificationsResult.ChannelNotConnected: {
        await interaction.editReply(
          `DotaBot is not currently connected to ${channelMention(interaction.channelId)}! Run /connect first!`,
        );
        break;
      }
      case EnableDailyNotificationsResult.UnknownError: {
        await interaction.editReply(
          `DotaBot couldn't ${enabled ? "enable" : "disable"} daily notifications for ${channelMention(interaction.channelId)} at the moment :( Please try again later!`,
        );
        break;
      }
    }
  }

  async chatInputSetNotificationTime(
    interaction: Command.ChatInputCommandInteraction,
  ) {
    await interaction.deferReply();

    const timeString = interaction.options.getString(TimeOptionName);
    if (!timeString) {
      await interaction.editReply(
        "You entered an invalid time! Please try again with a valid time in 24-hour format - e.g. 18:30",
      );
      return;
    }

    const channelId = BigInt(interaction.channelId);
    const result = await this._configurationService.setDailyNotificationTime(
      channelId,
      timeString,
    );

    switch (result) {
      case SetDailyNotificationTimeResult.Success: {
        await interaction.editReply(
          `Daily notifications of matches will be sent at ${timeString} in ${channelMention(interaction.channelId)}!`,
        );
        break;
      }
      case SetDailyNotificationTimeResult.ChannelNotConnected: {
        await interaction.editReply(
          `DotaBot is not currently connected to ${channelMention(interaction.channelId)}! Run /connect first!`,
        );
        break;
      }
      case SetDailyNotificationTimeResult.InvalidTimeString: {
        await interaction.editReply(
          `${timeString} is not a valid time in 24-hour format! Please enter a valid 24-hour time - e.g. 18:30`,
        );
        break;
      }
      case SetDailyNotificationTimeResult.UnknownError: {
        await interaction.editReply(
          `DotaBot couldn't set the daily notification time for ${channelMention(interaction.channelId)} at the moment :( Please try again later!`,
        );
        break;
      }
    }
  }
}
