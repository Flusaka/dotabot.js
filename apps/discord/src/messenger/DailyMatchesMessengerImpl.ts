import type { DailyMatchesMessenger } from "@dotabot.js/application/messenger/DailyMatchesMessenger";
import type { ChannelConfiguration } from "@dotabot.js/domain/ChannelConfiguration";
import type { Tournament } from "@dotabot.js/domain/data/Tournament";
import { container } from "@sapphire/framework";
import { Symbols } from "di/symbols";
import { inject } from "inversify";
import type { TournamentEmbedMessageBuilder } from "message/TournamentEmbedMessageBuilder";

export class DailyMatchesMessengerImpl implements DailyMatchesMessenger {
  constructor(
    @inject(Symbols.TournamentEmbedMessageBuilder)
    private readonly tournamentMessageBuilder: TournamentEmbedMessageBuilder,
  ) {}

  async sendDailyMatches(
    channelConfig: ChannelConfiguration,
    tournaments: Tournament[],
  ): Promise<void> {
    const channel = await container.client.channels.fetch(
      channelConfig.channelId.toString(),
    );
    if (!channel || !channel.isTextBased() || !channel.isSendable()) {
      return;
    }

    let anyMessageSent = false;
    for (const tournament of tournaments) {
      for (const iteration of tournament.iterations) {
        for (const phase of iteration.phases) {
          const embed = this.tournamentMessageBuilder.buildTournamentMessage(
            channelConfig,
            tournament,
            iteration,
            phase,
          );

          if (!embed) continue;

          // Send message to channel
          await channel.send({
            embeds: [embed],
          });
          anyMessageSent = true;
        }
      }
    }

    if (!anyMessageSent) {
      console.log("No matches today");
    }
  }
}
