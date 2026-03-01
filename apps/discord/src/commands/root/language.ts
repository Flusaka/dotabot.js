import { Language } from "@dotabot.js/domain/Language";
import {
  SetPreferredLanguageResult,
  type ConfigurationService,
} from "@dotabot.js/domain/service/ConfigurationService";
import { Symbols as SharedSymbols } from "@dotabot.js/shared/Symbols";
import { ApplicationCommandRegistry, Command } from "@sapphire/framework";
import { botContainer } from "di/container";
import { channelMention } from "discord.js";

const LanguageTextChoices = {
  [Language.English]: "English",
} as const;

export class SetPreferredLanguageCommand extends Command {
  private readonly _configurationService: ConfigurationService;

  constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, { ...options });
    this._configurationService = botContainer.get<ConfigurationService>(
      SharedSymbols.ConfigurationService,
    );
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry,
  ) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("language")
        .setDescription(
          "Set the preferred language in which to receive stream suggestions",
        )
        .addStringOption((option) =>
          option
            .setName("language")
            .setDescription("Language of your choice")
            .setRequired(true)
            .setChoices([
              {
                name: "English",
                value: Language.English,
              },
            ]),
        ),
    );
  }

  public override async chatInputRun(
    interaction: Command.ChatInputCommandInteraction,
  ) {
    await interaction.deferReply();

    const language = interaction.options.getString("language")!;

    const channelId = BigInt(interaction.channelId);
    const result = await this._configurationService.setPreferredLanguage(
      channelId,
      language,
    );
    switch (result) {
      case SetPreferredLanguageResult.Success: {
        await interaction.editReply(
          `Preferred language has been set to ${LanguageTextChoices[language as Language]} for ${channelMention(interaction.channelId)}!`,
        );
        break;
      }
      case SetPreferredLanguageResult.ChannelNotConnected: {
        // TODO: Pull command ID back to do proper link
        await interaction.editReply(
          `DotaBot is not currently connected to ${channelMention(interaction.channelId)}! Run /connect first!`,
        );
        break;
      }
      case SetPreferredLanguageResult.UnknownError: {
        await interaction.editReply(
          `DotaBot couldn't set the preferred language for ${channelMention(interaction.channelId)} at the moment :( Please try again later!`,
        );
        break;
      }
    }
  }
}
