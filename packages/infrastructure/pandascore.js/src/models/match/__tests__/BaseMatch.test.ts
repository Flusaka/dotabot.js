import { describe, it, expect } from "vitest";
import { BaseMatch } from "../BaseMatch"; // Adjust the import path

describe("Base Match Schema", () => {
  it("should parse a valid match in snake_case", () => {
    const validMatch = {
      begin_at: "2018-09-05T08:44:19Z",
      detailed_stats: true,
      draw: false,
      end_at: "2018-09-05T12:09:04Z",
      forfeit: false,
      game_advantage: null,
      id: 53989,
      live: {
        opens_at: "2018-09-05T08:29:19.000000Z",
        supported: true,
        url: "wss://live.pandascore.co/matches/53989",
      },
      match_type: "best_of",
      modified_at: "2021-09-10T15:48:08Z",
      name: "SN vs TES",
      number_of_games: 5,
      original_scheduled_at: "2018-09-05T08:44:19Z",
      rescheduled: false,
      scheduled_at: "2018-09-05T08:00:00Z",
      slug: "suning-vs-topsports-gaming-2018-09-05",
      status: "finished",
      streams_list: [],
      tournament_id: 1590,
      winner_id: 126059,
      winner_type: "Team",
    };

    const parsedMatch = BaseMatch.parse(validMatch);
    expect(parsedMatch).toBeDefined();
    expect(parsedMatch.id).toBe(53989);
    expect(parsedMatch.matchType).toBe("best_of");
  });

  it("should throw for an invalid match", () => {
    const invalidMatch = {
      id: "not_a_number", // Invalid: should be a number
      match_type: "invalid_type",
    };

    expect(() => BaseMatch.parse(invalidMatch)).toThrow();
  });
});
