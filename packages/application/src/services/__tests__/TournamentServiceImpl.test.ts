import { ChannelConfigurationRepository } from "@dotabot.js/domain/repository/ChannelConfigurationRepository";
import { describe, test, expect, vi } from "vitest";
import { TournamentServiceImpl } from "../TournamentServiceImpl";
import { TournamentRepository } from "@dotabot.js/domain/repository/TournamentRepository";
import { GetTournamentsWithMatchesTodayResultStatus } from "@dotabot.js/domain/service/TournamentService";
import { ChannelConfiguration } from "@dotabot.js/domain/ChannelConfiguration";
import { Timezone } from "@dotabot.js/domain/Timezone";
import { Language } from "@dotabot.js/domain/Language";
import { Tournament } from "@dotabot.js/domain/data/Tournament";
import { DateTime, IANAZone } from "luxon";
import { TimeOnly } from "@dotabot.js/domain/TimeOnly";

describe("TournamentService::getTournamentsWithMatchesToday", () => {
  function createMockChannelConfigRepository(
    repository: Partial<ChannelConfigurationRepository>,
  ) {
    return {
      getByChannelId: repository.getByChannelId ?? vi.fn(),
      deleteByChannelId: repository.deleteByChannelId ?? vi.fn(),
      getById: repository.getById ?? vi.fn(),
      create: repository.create ?? vi.fn(),
      update: repository.update ?? vi.fn(),
      delete: repository.delete ?? vi.fn(),
    };
  }

  function createMockTournamentRepository(
    repository?: Partial<TournamentRepository>,
  ) {
    return {
      getTournamentsWithMatches:
        repository?.getTournamentsWithMatches ?? vi.fn(),
    };
  }

  test("should return Result with status ChannelNotConnected when channelConfigRepository returns undefined", async () => {
    // 1. Arrange
    const mockChannelConfigRepository = createMockChannelConfigRepository({
      getByChannelId: vi.fn().mockResolvedValue(undefined),
    });
    const mockTournamentRepository = createMockTournamentRepository();

    const service = new TournamentServiceImpl(
      mockTournamentRepository,
      mockChannelConfigRepository,
    );

    // 2. Act
    const result = await service.getTournamentsWithMatchesToday(0n, "Midnight");

    // 3. Assert
    expect(result.status).toBe(
      GetTournamentsWithMatchesTodayResultStatus.ChannelNotConnected,
    );
  });

  test("should return Result with status NoMatchesToday when tournamentRepository returns empty tournaments array", async () => {
    // 1. Arrange
    const mockChannelConfigRepository = createMockChannelConfigRepository({
      getByChannelId: vi
        .fn()
        .mockResolvedValue(
          ChannelConfiguration.fromExisting(
            0,
            0n,
            [],
            Timezone.GMT,
            Language.English,
          ),
        ),
    });
    const mockTournamentRepository = createMockTournamentRepository({
      getTournamentsWithMatches: vi.fn().mockResolvedValue([]),
    });

    const service = new TournamentServiceImpl(
      mockTournamentRepository,
      mockChannelConfigRepository,
    );

    // 2. Act
    const result = await service.getTournamentsWithMatchesToday(0n, "Midnight");

    // 3. Assert
    expect(result.status).toBe(
      GetTournamentsWithMatchesTodayResultStatus.NoMatchesToday,
    );
  });

  test("should return Result with status Success with array of tournaments when tournamenyRepository returns non-empty array", async () => {
    // 1. Arrange
    const mockChannelConfigRepository = createMockChannelConfigRepository({
      getByChannelId: vi
        .fn()
        .mockResolvedValue(
          ChannelConfiguration.fromExisting(
            0,
            0n,
            [],
            Timezone.GMT,
            Language.English,
          ),
        ),
    });
    const mockTournamentRepository = createMockTournamentRepository({
      getTournamentsWithMatches: vi
        .fn()
        .mockResolvedValue([new Tournament(0, "The International", [])]),
    });

    const service = new TournamentServiceImpl(
      mockTournamentRepository,
      mockChannelConfigRepository,
    );

    // 2. Act
    const result = await service.getTournamentsWithMatchesToday(0n, "Midnight");

    // 3. Assert
    expect(result.status).toBe(
      GetTournamentsWithMatchesTodayResultStatus.Success,
    );

    expect(result).toHaveProperty("data");
  });

  test.each([[Timezone.GMT], [Timezone.EET]])(
    "should call getTournamentsWithMatches with correct parameters for StartTime.Midnight",
    async (timezone) => {
      // 1. Arrange
      const channel = ChannelConfiguration.fromExisting(
        0,
        0n,
        [],
        timezone,
        Language.English,
      );
      const mockChannelConfigRepository = createMockChannelConfigRepository({
        getByChannelId: vi.fn().mockResolvedValue(channel),
      });
      const mockTournamentRepository = createMockTournamentRepository({
        getTournamentsWithMatches: vi
          .fn()
          .mockResolvedValue([new Tournament(0, "The International", [])]),
      });

      const service = new TournamentServiceImpl(
        mockTournamentRepository,
        mockChannelConfigRepository,
      );

      const startOfDay = DateTime.local({
        zone: IANAZone.create(timezone),
      })
        .startOf("day")
        .toUTC();
      const endOfDay = startOfDay
        .plus({ days: 1 })
        .minus({ seconds: 1 })
        .toUTC();

      // 2. Act
      await service.getTournamentsWithMatchesToday(0n, "Midnight");

      // 3. Assert
      expect(
        mockTournamentRepository.getTournamentsWithMatches,
      ).toHaveBeenCalledOnce();

      expect(
        mockTournamentRepository.getTournamentsWithMatches,
      ).toHaveBeenCalledWith({
        earliestMatchStartTime: startOfDay,
        latestMatchStartTime: endOfDay,
        tiers: channel.tiers,
      });
    },
  );

  test.each([[Timezone.GMT], [Timezone.EET]])(
    "should call getTournamentsWithMatches with correct parameters for StartTime.DailyNotificationTime",
    async (timezone) => {
      // 1. Arrange
      const dailyNotificationTime = new TimeOnly(10, 0);
      const channel = ChannelConfiguration.fromExisting(
        0,
        0n,
        [],
        timezone,
        Language.English,
        dailyNotificationTime,
      );
      const mockChannelConfigRepository = createMockChannelConfigRepository({
        getByChannelId: vi.fn().mockResolvedValue(channel),
      });
      const mockTournamentRepository = createMockTournamentRepository({
        getTournamentsWithMatches: vi
          .fn()
          .mockResolvedValue([new Tournament(0, "The International", [])]),
      });

      const service = new TournamentServiceImpl(
        mockTournamentRepository,
        mockChannelConfigRepository,
      );

      const startTime = DateTime.fromObject(
        {
          hour: dailyNotificationTime.hours,
          minute: dailyNotificationTime.minutes,
        },
        {
          zone: IANAZone.create(timezone),
        },
      ).toUTC();
      const endTime = startTime.plus({ days: 1 }).minus({ seconds: 1 }).toUTC();

      // 2. Act
      await service.getTournamentsWithMatchesToday(0n, "DailyNotificationTime");

      // 3. Assert
      expect(
        mockTournamentRepository.getTournamentsWithMatches,
      ).toHaveBeenCalledOnce();

      expect(
        mockTournamentRepository.getTournamentsWithMatches,
      ).toHaveBeenCalledWith({
        earliestMatchStartTime: startTime,
        latestMatchStartTime: endTime,
        tiers: channel.tiers,
      });
    },
  );
});
