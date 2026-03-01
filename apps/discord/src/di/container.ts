import { Container } from "inversify";
// import type { TournamentEmbedMessageBuilder } from "../message/interfaces/TournamentEmbedMessageBuilder";
// import { TournamentEmbedMessageBuilderImpl } from "../message/TournamentEmbedMessageBuilderImpl";
// import { Symbols } from "./symbols";
import { installApplicationDependencies } from "@dotabot.js/application/di/install";
import { installDatabaseDependencies } from "@dotabot.js/database/di/install";

const botContainer = new Container();
// Bot-specific dependencies
// botContainer
//   .bind<TournamentEmbedMessageBuilder>(Symbols.TournamentEmbedMessageBuilder)
//   .to(TournamentEmbedMessageBuilderImpl)
//   .inSingletonScope();

installDatabaseDependencies(botContainer);
installApplicationDependencies(botContainer);

export { botContainer };
