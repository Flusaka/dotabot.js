import { describe, expect, test } from "vitest";
import { ChannelConfiguration } from "../ChannelConfiguration";
import { Tier } from "../common/Tier";
import { Timezone } from "../Timezone";
import { Language } from "../Language";
import { TimeOnly, TimeParseError } from "../TimeOnly";

describe("ChannelConfiguration tests", () => {
  test("addTier should push to tiers array and return true, if tier is not currently in configuration", () => {
    // 1. Arrange
    const config = ChannelConfiguration.fromExisting(
      0,
      0n,
      [Tier.S],
      Timezone.GMT,
      Language.English,
    );

    // 2. Act
    const result = config.addTier(Tier.A);

    // 3. Assert
    expect(config.tiers).toContain(Tier.A);
    expect(result).toBeTruthy();
  });

  test("addTier should return false, if tier is currently in configuration", () => {
    // 1. Arrange
    const config = ChannelConfiguration.fromExisting(
      0,
      0n,
      [Tier.S],
      Timezone.GMT,
      Language.English,
    );

    // 2. Act
    const result = config.addTier(Tier.S);

    // 3. Assert
    expect(result).toBeFalsy();
  });

  test("removeTier should remove from tiers array and return true, if tier is currently in configuration", () => {
    // 1. Arrange
    const config = ChannelConfiguration.fromExisting(
      0,
      0n,
      [Tier.S, Tier.A],
      Timezone.GMT,
      Language.English,
    );

    // 2. Act
    const result = config.removeTier(Tier.A);

    // 3. Assert
    expect(config.tiers).not.toContain(Tier.A);
    expect(result).toBeTruthy();
  });

  test("removeTier should return false, if tier is not currently in configuration", () => {
    // 1. Arrange
    const config = ChannelConfiguration.fromExisting(
      0,
      0n,
      [Tier.S],
      Timezone.GMT,
      Language.English,
    );

    // 2. Act
    const result = config.removeTier(Tier.A);

    // 3. Assert
    expect(result).toBeFalsy();
  });

  test.each([
    ["23:59", new TimeOnly(23, 59)],
    ["01:45", new TimeOnly(1, 45)],
    ["03:04", new TimeOnly(3, 4)],
  ])(
    "setDailyNotificationTime should set dailyNotificationTime to correct value, if timeString is valid format",
    (timeString, time) => {
      // 1. Arrange
      const config = ChannelConfiguration.fromExisting(
        0,
        0n,
        [Tier.S],
        Timezone.GMT,
        Language.English,
      );

      // 2. Act
      config.setDailyNotificationTimeFromString(timeString);

      // 3. Assert
      expect(config.dailyNotificationTime).not.toBeUndefined();
      expect(config.dailyNotificationTime!.hours).toEqual(time.hours);
      expect(config.dailyNotificationTime!.minutes).toEqual(time.minutes);
    },
  );

  test.each(["30:00", "a", "", "[][as9"])(
    "setDailyNotificationTime throws TimeParseError, if timeString is invalid format",
    (timeString) => {
      // 1. Arrange
      const config = ChannelConfiguration.fromExisting(
        0,
        0n,
        [Tier.S],
        Timezone.GMT,
        Language.English,
      );

      // 2. Act
      // 3. Assert
      expect(() =>
        config.setDailyNotificationTimeFromString(timeString),
      ).toThrowError(TimeParseError);
    },
  );
});
