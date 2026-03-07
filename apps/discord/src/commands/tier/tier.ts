import {
  AddTierResult,
  RemoveTierResult,
  type ConfigurationService,
} from "@dotabot.js/domain/service/ConfigurationService";
import { Symbols } from "@dotabot.js/shared/Symbols";
import { ApplicationCommandRegistry, Command } from "@sapphire/framework";
import { botContainer } from "di/container";
import { isTier, Tier } from "@dotabot.js/domain/common/Tier";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { channelMention } from "discord.js";

const TierOptionName = "tier";

export class TierCommand extends Subcommand {
  private readonly _configurationService: ConfigurationService;

  constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: "tier",
      subcommands: [
        {
          name: "add",
          chatInputRun: "chatInputAddTier",
        },
        {
          name: "remove",
          chatInputRun: "chatInputRemoveTier",
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
        .setName("tier")
        .setDescription("Add or remove a tier of competition")
        .addSubcommand((builder) =>
          builder
            .setName("add")
            .setDescription("Add a tier of competition to be notified of")
            .addStringOption((option) =>
              option
                .setName(TierOptionName)
                .setDescription("The tier to add")
                .setRequired(true)
                .setChoices(
                  Object.values(Tier)
                    .filter((value) => value != Tier.Unknown)
                    .map((value) => ({
                      name: value.toString(),
                      value: value,
                    })),
                ),
            ),
        )
        .addSubcommand((builder) =>
          builder
            .setName("remove")
            .setDescription("Remove a tier of competition to be notified of")
            .addStringOption((option) =>
              option
                .setName(TierOptionName)
                .setDescription("The tier to remove")
                .setRequired(true)
                .setChoices(
                  Object.values(Tier)
                    .filter((value) => value != Tier.Unknown)
                    .map((value) => ({
                      name: value.toString(),
                      value: value,
                    })),
                ),
            ),
        ),
    );
  }

  async chatInputAddTier(interaction: Command.ChatInputCommandInteraction) {
    await interaction.deferReply();

    const tier = interaction.options.getString(TierOptionName);
    if (!tier || !isTier(tier)) {
      await interaction.editReply(
        "You chose an invalid tier! Please try again with a valid selection",
      );
      return;
    }

    const channelId = BigInt(interaction.channelId);

    const result = await this._configurationService.addTier(channelId, tier);
    switch (result) {
      case AddTierResult.Success: {
        await interaction.editReply(
          `Tier ${tier} successfully added to ${channelMention(interaction.channelId)}!`,
        );
        break;
      }
      case AddTierResult.ChannelNotConnected: {
        await interaction.editReply(
          `DotaBot is not currently connected to ${channelMention(interaction.channelId)}! Run /connect first!`,
        );
        break;
      }
      case AddTierResult.TierAlreadyAdded: {
        await interaction.editReply(
          `Tier ${tier} is already added to ${channelMention(interaction.channelId)}!`,
        );
        break;
      }
      case AddTierResult.UnknownError: {
        await interaction.editReply(
          `DotaBot couldn't add the tier for ${channelMention(interaction.channelId)} at the moment :( Please try again later!`,
        );
        break;
      }
    }
  }

  async chatInputRemoveTier(interaction: Command.ChatInputCommandInteraction) {
    await interaction.deferReply();

    const tier = interaction.options.getString(TierOptionName);
    if (!tier || !isTier(tier)) {
      await interaction.editReply(
        "You chose an invalid tier! Please try again with a valid selection",
      );
      return;
    }

    const channelId = BigInt(interaction.channelId);

    const result = await this._configurationService.removeTier(channelId, tier);
    switch (result) {
      case RemoveTierResult.Success: {
        await interaction.editReply(
          `Tier ${tier} successfully removed from ${channelMention(interaction.channelId)}!`,
        );
        break;
      }
      case RemoveTierResult.ChannelNotConnected: {
        await interaction.editReply(
          `DotaBot is not currently connected to ${channelMention(interaction.channelId)}! Run /connect first!`,
        );
        break;
      }
      case RemoveTierResult.TierNotAdded: {
        await interaction.editReply(
          `Tier ${tier} is already not added to ${channelMention(interaction.channelId)}!`,
        );
        break;
      }
      case RemoveTierResult.UnknownError: {
        await interaction.editReply(
          `DotaBot couldn't add the tier for ${channelMention(interaction.channelId)} at the moment :( Please try again later!`,
        );
        break;
      }
    }
  }
}
