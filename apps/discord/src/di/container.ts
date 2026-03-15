import { Container } from "inversify";
import { TournamentEmbedMessageBuilder } from "../message/TournamentEmbedMessageBuilder";
import { Symbols } from "./symbols";
import { Symbols as AppSymbols } from "@dotabot.js/application/di/Symbols";
import { installApplicationDependencies } from "@dotabot.js/application/di/install";
import { installDatabaseDependencies } from "@dotabot.js/database/di/install";
import { installScheduling } from "@dotabot.js/notifications/di/install";
import { type DailyMatchesMessenger } from "@dotabot.js/application/messenger/DailyMatchesMessenger";
import { DailyMatchesMessengerImpl } from "messenger/DailyMatchesMessengerImpl";

const botContainer = new Container();
// Bot-specific dependencies
botContainer
  .bind<TournamentEmbedMessageBuilder>(Symbols.TournamentEmbedMessageBuilder)
  .to(TournamentEmbedMessageBuilder)
  .inSingletonScope();

botContainer
  .bind<DailyMatchesMessenger>(AppSymbols.DailyMatchesMessenger)
  .to(DailyMatchesMessengerImpl)
  .inSingletonScope();

installDatabaseDependencies(botContainer);
installApplicationDependencies(botContainer);
installScheduling(botContainer);

export { botContainer };
