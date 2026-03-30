import { describe, expect, it } from "vitest";
import {
  calculateStreaks,
  sanitizeGoal,
  sanitizeStepIncrement,
  getLocalDateString,
  DEFAULT_GOAL,
  MAX_STEP_INCREMENT,
} from "@/lib/activity";

describe("activity utilities", () => {
  it("calculates current and best streak correctly", () => {
    const baseDate = new Date("2026-03-30T12:00:00.000Z");
    const { currentStreak, bestStreak } = calculateStreaks(
      ["2026-03-29", "2026-03-28", "2026-03-25", "2026-03-24", "2026-03-23"],
      baseDate
    );

    expect(currentStreak).toBe(2);
    expect(bestStreak).toBe(3);
  });

  it("normalizes date strings to local date format", () => {
    expect(getLocalDateString(new Date("2026-03-30T01:30:00.000Z"))).toMatch(/2026-03-(29|30)/);
  });

  it("sanitizes unsafe goals", () => {
    expect(sanitizeGoal(Number.NaN)).toBe(DEFAULT_GOAL);
    expect(sanitizeGoal(10)).toBeGreaterThanOrEqual(1000);
    expect(sanitizeGoal(200_000)).toBeLessThanOrEqual(100_000);
  });

  it("caps invalid step increments", () => {
    expect(sanitizeStepIncrement(-5)).toBe(0);
    expect(sanitizeStepIncrement(MAX_STEP_INCREMENT + 1000)).toBe(MAX_STEP_INCREMENT);
  });
});
