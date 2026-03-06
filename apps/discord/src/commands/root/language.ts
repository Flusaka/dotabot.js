import { isLanguage, Language } from "@dotabot.js/domain/Language";
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
  [Language.Russian]: "Russian",
  [Language.Spanish]: "Spanish",
} as const;

export class SetPreferredLanguageCommand extends Command {
  private readonly configurationService: ConfigurationService;

  constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, { ...options });
    this.configurationService = botContainer.get<ConfigurationService>(
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
            .setChoices(
              Object.values(Language).map((value) => ({
                name: LanguageTextChoices[value],
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

    const language = interaction.options.getString("language");
    if (!language || !isLanguage(language)) {
      await interaction.editReply(
        "You chose an invalid language! Please try again with a valid selection",
      );
      return;
    }

    const channelId = BigInt(interaction.channelId);
    const result = await this.configurationService.setPreferredLanguage(
      channelId,
      language,
    );
    switch (result) {
      case SetPreferredLanguageResult.Success: {
        await interaction.editReply(
          `Preferred language has been set to ${LanguageTextChoices[language]} for ${channelMention(interaction.channelId)}!`,
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
