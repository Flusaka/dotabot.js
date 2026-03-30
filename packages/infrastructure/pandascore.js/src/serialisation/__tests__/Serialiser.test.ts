import { describe, expect, it } from "vitest";
import { Serialiser } from "../Serialiser";
import { RequestParameter } from "../../request/types";

class SerialiserTestImpl extends Serialiser {
  serialise(param: RequestParameter): string {
    return this.serialiseValue(param);
  }
}

describe("Serialiser tests", () => {
  it("should serialise primitive values to string when using simple mode", () => {
    // 1. Arrange
    const serialiser = new SerialiserTestImpl();

    // 2. Act
    const output = serialiser.serialise({
      key: "key",
      value: 0,
      serialisationMethod: "simple",
    });

    // 3. Assert
    expect(output).toBe("0");
  });

  it("should serialise primitive parameters to URI encoded 'key=value' string when using form mode", () => {
    // 1. Arrange
    const serialiser = new SerialiserTestImpl();

    // 2. Act
    const output = serialiser.serialise({
      key: "key",
      value: "some value",
      serialisationMethod: "form",
    });

    // 3. Assert
    expect(output).toBe("key=some%20value");
  });

  it("should serialise date values to ISO strings when using simple mode", () => {
    // 1. Arrange
    const serialiser = new SerialiserTestImpl();

    // 2. Act
    const output = serialiser.serialise({
      key: "key",
      value: new Date(Date.UTC(2000, 0, 1, 0, 0, 0, 0)),
      serialisationMethod: "simple",
    });

    // 3. Assert
    expect(output).toBe("2000-01-01T00:00:00.000Z");
  });

  it("should serialise date parameters to URI encoded 'key=isodate' format when using form mode", () => {
    // 1. Arrange
    const serialiser = new SerialiserTestImpl();

    // 2. Act
    const output = serialiser.serialise({
      key: "key",
      value: new Date(Date.UTC(2000, 0, 1, 0, 0, 0, 0)),
      serialisationMethod: "form",
    });

    // 3. Assert
    expect(output).toBe(
      `key=${encodeURIComponent("2000-01-01T00:00:00.000Z")}`,
    );
  });
});
