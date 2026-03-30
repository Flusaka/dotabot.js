import { describe, expect, it } from "vitest";
import { QuerySerialiser } from "../QuerySerialiser";

describe("QuerySerialiser tests", () => {
  it("should serialise URI encoded query strings correctly with primitive types using form mode", () => {
    // 1. Arrange
    const serialiser = new QuerySerialiser();

    // 2. Act
    const output = serialiser.serialise(
      new Map([
        [
          "key",
          { key: "key", value: "some value", serialisationMethod: "form" },
        ],
      ]),
    );

    // 3. Assert
    expect(output).toBe("?key=some%20value");
  });

  it("should serialise URI encoded date values to ISO strings when using form mode", () => {
    // 1. Arrange
    const serialiser = new QuerySerialiser();

    // 2. Act
    const output = serialiser.serialise(
      new Map([
        [
          "key",
          {
            key: "key",
            value: new Date(Date.UTC(2000, 0, 1, 0, 0, 0, 0)),
            serialisationMethod: "form",
          },
        ],
      ]),
    );

    // 3. Assert
    expect(output).toBe(
      `?key=${encodeURIComponent("2000-01-01T00:00:00.000Z")}`,
    );
  });
});
