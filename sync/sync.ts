import { DateTime } from "luxon";
import { Client } from "../pandascorejs/Client";
import type { Match } from "../pandascorejs/models/match/Match";
import type { Response } from "../pandascorejs/request/Request";
import { BaseTeam } from "../pandascorejs/models/team/BaseTeam";
import prisma from "../database/prisma";
import type { BaseTournament } from "../pandascorejs/models/tournament/BaseTournament";
import type { BaseLeague } from "../pandascorejs/models/league/BaseLeague";
import type { BaseSerie } from "../pandascorejs/models/serie/BaseSerie";
import { TierMapper } from "./mappers/TierMapper";
import { LanguageCodeMapper } from "./mappers/LanguageCodeMapper";

export async function sync(token: string) {
  // Pull from PandaScore
  const client = new Client(token);
  const now = DateTime.now().toUTC();
  const earliest = now.minus({ days: 2 });
  const latest = now.plus({ days: 2 });

  const matches: Match[] = [];
  let totalPages = 1;
  let page = 1;
  while (page <= totalPages) {
    const result = await getMatches(client, page, earliest, latest);
    matches.push(...result.content);
    totalPages = result.totalPages;
    page++;
  }

  const uniqueLeagues = new Map<number, BaseLeague>();
  const uniqueSeries = new Map<number, BaseSerie>();
  const uniqueTournaments = new Map<number, BaseTournament>();
  const uniqueTeams = new Map<number, BaseTeam>();

  for (const match of matches) {
    // Leagues (aka Tournaments)
    uniqueLeagues.set(match.league.id, match.league);

    // Iterations (aka Series)
    uniqueSeries.set(match.serie.id, match.serie);

    // Tournaments (aka Phases)
    uniqueTournaments.set(match.tournament.id, match.tournament);

    // Teams
    for (const opponent of match.opponents) {
      if (opponent.type === "Team") {
        uniqueTeams.set(opponent.opponent.id, opponent.opponent);
      }
    }
  }

  console.log(`Starting transaction: ${DateTime.now()}`);
  await prisma.$transaction(async (tx) => {
    // Upsert Teams
    const teamUpserts = Array.from(uniqueTeams.values()).map((team) =>
      tx.team.upsert({
        where: {
          pandaScoreId: team.id,
        },
        create: {
          name: team.name,
          pandaScoreId: team.id,
          acronym: team.acronym,
        },
        update: {
          name: team.name,
          acronym: team.acronym,
        },
      }),
    );
    await Promise.all(teamUpserts);

    // Upsert top-level Leagues (aka Tournaments)
    const leagueUpserts = Array.from(uniqueLeagues.values()).map((league) =>
      tx.tournament.upsert({
        where: {
          pandaScoreId: league.id,
        },
        create: {
          name: league.name,
          pandaScoreId: league.id,
        },
        update: {
          name: league.name,
        },
      }),
    );
    await Promise.all(leagueUpserts);

    // Upsert mid-level Series (aka Tournament Iterations)
    const serieUpserts = Array.from(uniqueSeries.values()).map((serie) =>
      tx.tournamentIteration.upsert({
        where: {
          pandaScoreId: serie.id,
        },
        create: {
          name: serie.name || serie.fullName,
          pandaScoreId: serie.id,
          beginAt: serie.beginAt,
          endAt: serie.endAt,
          tournament: {
            connect: { pandaScoreId: serie.leagueId },
          },
        },
        update: {
          name: serie.name || serie.fullName,
          beginAt: serie.beginAt,
          endAt: serie.endAt,
        },
      }),
    );
    await Promise.all(serieUpserts);

    const tournamentUpserts = Array.from(uniqueTournaments.values()).map(
      (tournament) =>
        tx.tournamentPhase.upsert({
          where: {
            pandaScoreId: tournament.id,
          },
          create: {
            name: tournament.name,
            pandaScoreId: tournament.id,
            beginAt: tournament.beginAt,
            endAt: tournament.endAt,
            tier: TierMapper.toDatabaseModel(tournament.tier || "unranked"),
            tournamentIteration: {
              connect: { pandaScoreId: tournament.serieId },
            },
          },
          update: {
            name: tournament.name,
            pandaScoreId: tournament.id,
            beginAt: tournament.beginAt,
            endAt: tournament.endAt,
            tier: TierMapper.toDatabaseModel(tournament.tier || "unranked"),
          },
        }),
    );
    await Promise.all(tournamentUpserts);

    const matchUpserts = matches.map((match) =>
      tx.match.upsert({
        where: {
          pandaScoreId: match.id,
        },
        create: {
          scheduledAt: match.scheduledAt || match.beginAt,
          pandaScoreId: match.id,
          tournamentPhase: {
            connect: {
              pandaScoreId: match.tournamentId,
            },
          },
          radiantTeam: {
            connect:
              match.opponents.length > 0 && match.opponents[0]?.type === "Team"
                ? {
                    pandaScoreId: match.opponents[0]?.opponent.id,
                  }
                : undefined,
          },
          direTeam: {
            connect:
              match.opponents.length > 1 && match.opponents[1]?.type === "Team"
                ? {
                    pandaScoreId: match.opponents[1].opponent.id,
                  }
                : undefined,
          },
          streams: match.streamsList.map((stream) => ({
            url: stream.rawUrl,
            main: stream.main,
            official: stream.official,
            language: LanguageCodeMapper.toDatabaseModel(stream.language),
          })),
        },
        update: {
          scheduledAt: match.scheduledAt || match.beginAt,
          radiantTeam: {
            connect:
              match.opponents.length > 0 && match.opponents[0]?.type === "Team"
                ? {
                    pandaScoreId: match.opponents[0]?.opponent.id,
                  }
                : undefined,
          },
          direTeam: {
            connect:
              match.opponents.length > 1 && match.opponents[1]?.type === "Team"
                ? {
                    pandaScoreId: match.opponents[1].opponent.id,
                  }
                : undefined,
          },
          streams: match.streamsList.map((stream) => ({
            url: stream.rawUrl,
            main: stream.main,
            official: stream.official,
            language: LanguageCodeMapper.toDatabaseModel(stream.language),
          })),
        },
      }),
    );
    await Promise.all(matchUpserts);
  });

  console.log(`Finishing transaction: ${DateTime.now()}`);
}

async function getMatches(
  client: Client,
  page: number,
  earliest: DateTime<true>,
  latest: DateTime<true>,
): Promise<Response<Match[]>> {
  const response = await client.matches.getDota2Matches({
    range: {
      beginAt: [earliest.toISO(), latest.toISO()],
    },
    page: {
      number: page,
      size: 100,
    },
  });
  return response;
}
