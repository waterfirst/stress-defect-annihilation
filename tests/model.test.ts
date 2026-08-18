import { describe, expect, it } from "vitest";
import {
  DEFAULT_PARAMETERS,
  characteristicTime,
  computeMetrics,
  phononRate,
} from "../src/physics/model";

describe("phonon-assisted reduced-order model", () => {
  it("increases the phonon rate with temperature", () => {
    expect(phononRate({ ...DEFAULT_PARAMETERS, annealRatio: 0.98 }))
      .toBeGreaterThan(phononRate({ ...DEFAULT_PARAMETERS, annealRatio: 0.86 }));
  });

  it("reduces stress monotonically with process time", () => {
    const early = computeMetrics(DEFAULT_PARAMETERS, 0.1);
    const late = computeMetrics(DEFAULT_PARAMETERS, 1.0);
    expect(late.peakStressMPa).toBeLessThan(early.peakStressMPa);
    expect(late.annihilationPct).toBeGreaterThan(early.annihilationPct);
  });

  it("penalizes a same-sign defect pair", () => {
    const opposite = characteristicTime(DEFAULT_PARAMETERS);
    const same = characteristicTime({ ...DEFAULT_PARAMETERS, topology: "same" });
    expect(same).toBeGreaterThan(opposite);
  });

  it("keeps all observable proxies finite and physical", () => {
    const result = computeMetrics(DEFAULT_PARAMETERS, 0.5);
    expect(result.characteristicTime).toBeGreaterThan(0);
    expect(result.retardationNm).toBeGreaterThanOrEqual(0);
    expect(result.crackRiskPct).toBeGreaterThanOrEqual(0);
    expect(result.crackRiskPct).toBeLessThanOrEqual(100);
  });
});
