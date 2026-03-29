import { assert, describe, expect, it } from "vitest";
import {
  DeletionIncident,
  Incident,
  NonDeletionIncident,
  NonDeletionIncidentObject,
} from "../Incident";
import { Match } from "../../match/Match";

function isMatch(obj: NonDeletionIncidentObject): obj is Match {
  return "gameAdvantage" in obj;
}

describe("Deletion incident schema", () => {
  it("should parse a valid deletion incident in snake_case", () => {
    // 1. Arrange
    const raw = {
      change_type: "deletion",
      id: 42579,
      modified_at: "2022-07-05T13:22:05Z",
      object: {
        deleted_at: "2022-07-05T13:22:04Z",
        reason: "Merged with 31619",
        videogame_id: 1,
      },
      type: "player",
    };

    // 2. Act
    const result = DeletionIncident.parse(raw);

    // 3. Assert
    expect(result.changeType).toEqual("deletion");
    expect(result.id).toEqual(raw.id);
    expect(result.modifiedAt).toEqual(raw.modified_at);
    expect(result.type).toEqual(raw.type);
    expect(result.object).not.toBeNull();
    expect(result.object).toBeDefined();
    expect(result.object.deletedAt).toEqual(raw.object.deleted_at);
  });
});

describe("Non-deletion incident schema", () => {
  it("should parse a valid creation incident in snake_case", () => {
    const raw = {
      change_type: "creation",
      id: 1246497,
      modified_at: "2025-09-28T22:42:37Z",
      object: {
        begin_at: "2025-10-01T17:30:00Z",
        detailed_stats: false,
        draw: false,
        end_at: null,
        forfeit: false,
        game_advantage: null,
        games: [
          {
            begin_at: null,
            complete: false,
            detailed_stats: false,
            end_at: null,
            finished: false,
            forfeit: false,
            id: 187623,
            length: null,
            match_id: 1246497,
            position: 1,
            status: "not_started",
            winner: {
              id: null,
              type: "Team",
            },
            winner_type: "Team",
          },
          {
            begin_at: null,
            complete: false,
            detailed_stats: false,
            end_at: null,
            finished: false,
            forfeit: false,
            id: 187624,
            length: null,
            match_id: 1246497,
            position: 2,
            status: "not_started",
            winner: {
              id: null,
              type: "Team",
            },
            winner_type: "Team",
          },
          {
            begin_at: null,
            complete: false,
            detailed_stats: false,
            end_at: null,
            finished: false,
            forfeit: false,
            id: 187625,
            length: null,
            match_id: 1246497,
            position: 3,
            status: "not_started",
            winner: {
              id: null,
              type: "Team",
            },
            winner_type: "Team",
          },
        ],
        id: 1246497,
        league: {
          id: 5232,
          image_url:
            "https://cdn.pandascore.co/images/league/image/5232/799px-cct_2024_europe_allmode-png",
          modified_at: "2024-04-13T08:58:18Z",
          name: "CCT Europe",
          slug: "cs-go-cct-europe",
          url: null,
        },
        league_id: 5232,
        live: {
          opens_at: null,
          supported: false,
          url: null,
        },
        match_type: "best_of",
        modified_at: "2025-09-28T22:42:37Z",
        name: "Grand final: TBD vs TBD",
        number_of_games: 3,
        opponents: [],
        original_scheduled_at: "2025-10-01T17:30:00Z",
        rescheduled: false,
        results: [],
        scheduled_at: "2025-10-01T17:30:00Z",
        serie: {
          begin_at: "2025-09-17T14:30:00Z",
          end_at: "2025-10-01T20:30:00Z",
          full_name: "European Contenders #1 season 3 2025",
          id: 9682,
          league_id: 5232,
          modified_at: "2025-09-17T08:59:33Z",
          name: "European Contenders #1",
          season: "3",
          slug: "cs-go-cct-europe-european-contenders-1-3-2025",
          winner_id: null,
          winner_type: "Team",
          year: 2025,
        },
        serie_id: 9682,
        slug: "2025-10-01-09c3e3d5-0a2c-4cdf-8924-8cb800cdf2f2",
        status: "not_started",
        streams_list: [
          {
            embed_url: null,
            language: "en",
            main: true,
            official: true,
            raw_url: "https://kick.com/cct_cs2",
          },
        ],
        tournament: {
          begin_at: "2025-09-17T14:30:00Z",
          country: null,
          detailed_stats: false,
          end_at: "2025-10-01T20:30:00Z",
          has_bracket: true,
          id: 17588,
          league_id: 5232,
          live_supported: false,
          modified_at: "2025-09-22T06:09:50Z",
          name: "Playoffs",
          prizepool: "5000 United States Dollar",
          region: "EEU",
          serie_id: 9682,
          slug: "cs-go-cct-europe-european-contenders-1-3-2025-playoffs",
          tier: "d",
          type: "online",
          winner_id: null,
          winner_type: "Team",
        },
        tournament_id: 17588,
        videogame: {
          id: 3,
          name: "Counter-Strike",
          slug: "cs-go",
        },
        videogame_title: {
          id: 13,
          name: "Counter-Strike 2",
          slug: "cs-2",
          videogame_id: 3,
        },
        videogame_version: null,
        winner: null,
        winner_id: null,
        winner_type: "Team",
      },
      type: "match",
    };

    // 2. Act
    const result = NonDeletionIncident.parse(raw);

    // 3. Assert
    expect(result.changeType).toEqual("creation");
    expect(result.id).toEqual(raw.id);
    expect(result.modifiedAt).toEqual(raw.modified_at);
    expect(result.type).toEqual(raw.type);
    expect(result.object).not.toBeNull();
    expect(result.object).toBeDefined();

    if (!isMatch(result.object)) {
      assert.fail("Non-deletion incident object is not Match");
      return;
    }

    expect(result.object.id).toEqual(raw.object.id);
    expect(result.object.beginAt).toEqual(raw.object.begin_at);
    expect(result.object.numberOfGames).toEqual(raw.object.number_of_games);
  });
});

describe("Incident schema", () => {
  it("should parse a deletion discriminated incident as a DeletionIncident", () => {
    // 1. Arrange
    const raw = {
      change_type: "deletion",
      id: 42579,
      modified_at: "2022-07-05T13:22:05Z",
      object: {
        deleted_at: "2022-07-05T13:22:04Z",
        reason: "Merged with 31619",
        videogame_id: 1,
      },
      type: "player",
    };

    // 2. Act
    const result = Incident.parse(raw);

    // 3. Assert
    expect(result.changeType).toEqual("deletion");
    expect(result.id).toEqual(raw.id);
    expect(result.modifiedAt).toEqual(raw.modified_at);
    expect(result.type).toEqual(raw.type);

    if (result.changeType === "deletion") {
      expect(result.object).not.toBeNull();
      expect(result.object).toBeDefined();
      expect(result.object.deletedAt).toEqual(raw.object.deleted_at);
    }
  });
});
