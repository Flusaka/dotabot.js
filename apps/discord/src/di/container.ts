import { Container } from "inversify";
import { TournamentEmbedMessageBuilder } from "../message/TournamentEmbedMessageBuilder";
import { Symbols } from "./symbols";
import { installApplicationDependencies } from "@dotabot.js/application/di/install";
import { installDatabaseDependencies } from "@dotabot.js/database/di/install";

const botContainer = new Container();
// Bot-specific dependencies
botContainer
  .bind<TournamentEmbedMessageBuilder>(Symbols.TournamentEmbedMessageBuilder)
  .to(TournamentEmbedMessageBuilder)
  .inSingletonScope();

installDatabaseDependencies(botContainer);
installApplicationDependencies(botContainer);

export { botContainer };
