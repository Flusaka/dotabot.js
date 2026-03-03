import {
  SetNotificationTimezoneResult,
  type ConfigurationService,
} from "@dotabot.js/domain/service/ConfigurationService";
import { Timezone } from "@dotabot.js/domain/Timezone";
import { Symbols } from "@dotabot.js/shared/Symbols";
import { ApplicationCommandRegistry, Command } from "@sapphire/framework";
import { botContainer } from "di/container";
import { channelMention } from "discord.js";

const TimezoneTextChoices = {
  [Timezone.GMT]: "GMT",
  [Timezone.EET]: "EET",
} as const;

export class SetTimezone extends Command {
  private readonly _configurationService: ConfigurationService;

  constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, { ...options });
    this._configurationService = botContainer.get<ConfigurationService>(
      Symbols.ConfigurationService,
    );
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry,
  ) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("timezone")
        .setDescription(
          "Set the timezone in which to receive daily notifications",
        )
        .addStringOption((option) =>
          option
            .setName("timezone")
            .setDescription("Timezone of your choice")
            .setRequired(true)
            .setChoices(
              Object.keys(TimezoneTextChoices).map((value) => ({
                name: TimezoneTextChoices[value as Timezone],
                value: value,
              })),
            ),
        ),
    );
  }

  public override async chatInputRun(
    interaction: Command.ChatInputCommandInteraction,
  ) {
    await interaction.deferReply();

    const timezone = interaction.options.getString("timezone")!;

    const channelId = BigInt(interaction.channelId);
    const result = await this._configurationService.setNotificationTimezone(
      channelId,
      timezone,
    );
    switch (result) {
      case SetNotificationTimezoneResult.Success: {
        await interaction.editReply(
          `Timezone has been set to ${TimezoneTextChoices[timezone as Timezone]} for ${channelMention(interaction.channelId)}!`,
        );
        break;
      }
      case SetNotificationTimezoneResult.ChannelNotConnected: {
        // TODO: Pull command ID back to do proper link
        await interaction.editReply(
          `DotaBot is not currently connected to ${channelMention(interaction.channelId)}! Run /connect first!`,
        );
        break;
      }
      case SetNotificationTimezoneResult.UnknownError: {
        await interaction.editReply(
          `DotaBot couldn't set the timezone for ${channelMention(interaction.channelId)} at the moment :( Please try again later!`,
        );
        break;
      }
    }
  }
}
