import { describe, expect, test } from "vitest";
import { TimeOnly } from "../TimeOnly";

describe("TimeOnly Tests", () => {
  test.each([
    ["09:30", new TimeOnly(9, 30)],
    ["12:45", new TimeOnly(12, 45)],
    ["23:59", new TimeOnly(23, 59)],
    ["00:00", new TimeOnly(0, 0)],
  ])(
    "parse should return valid TimeOnly object with correct time if input time string is valid",
    (timeString, expected) => {
      // 1. Arrange

      // 2. Act
      const result = TimeOnly.parse(timeString);

      // 3. Assert
      expect(result).toBeDefined();
      expect(result!.hours).toBe(expected.hours);
      expect(result!.minutes).toBe(expected.minutes);
    },
  );

  test.each([["24:01"], ["01:60"], ["-01:00"]])(
    "parse should throw if input time string is invalid",
    (timeString) => {
      // 1. Arrange

      // 2. Act

      // 3. Assert
      expect(() => TimeOnly.parse(timeString)).toThrow();
    },
  );

  test.each([
    [new TimeOnly(6, 7), "06:07"],
    [new TimeOnly(12, 0), "12:00"],
    [new TimeOnly(23, 59), "23:59"],
  ])(
    "toString should return time string in correct format",
    (timeOnly, timeString) => {
      expect(timeOnly.toString()).toBe(timeString);
    },
  );
});
