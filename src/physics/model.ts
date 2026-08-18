import type {
  FieldSample,
  MaterialKey,
  MaterialPreset,
  SimulationMetrics,
  SimulationParameters,
  TopologyMode,
} from "../types";

export const K_B_EV = 8.617333262e-5;

export const MATERIALS: Record<MaterialKey, MaterialPreset> = {
  d263: {
    key: "d263",
    name: "Borosilicate · D263",
    glassTransitionK: 820,
    thermalDiffusivity: 5e-7,
    stressOpticalCoefficient: 3.0,
    debyeFrequency: 1e13,
    elasticModulusGPa: 72.9,
    poissonRatio: 0.208,
  },
  fusedSilica: {
    key: "fusedSilica",
    name: "Fused silica",
    glassTransitionK: 1475,
    thermalDiffusivity: 8.4e-7,
    stressOpticalCoefficient: 3.45,
    debyeFrequency: 1.04e13,
    elasticModulusGPa: 72.0,
    poissonRatio: 0.17,
  },
  aluminosilicate: {
    key: "aluminosilicate",
    name: "Aluminosilicate · UTG",
    glassTransitionK: 865,
    thermalDiffusivity: 6.2e-7,
    stressOpticalCoefficient: 2.65,
    debyeFrequency: 1.15e13,
    elasticModulusGPa: 78.0,
    poissonRatio: 0.22,
  },
};

export const DEFAULT_PARAMETERS: SimulationParameters = {
  material: "d263",
  topology: "opposite",
  viewMode: "hybrid",
  viaRadiusUm: 22,
  viaPitchUm: 100,
  thicknessUm: 100,
  fieldWidthUm: 340,
  initialStressMPa: 120,
  annealRatio: 0.95,
  laserPowerW: 5,
  beamRadiusUm: 115,
  activationEnergyEv: 2.0,
  debyeScale: 1,
  diffusionScale: 1,
  elasticCoupling: 0.7,
  logViscosity: 8,
  nonlinearOrder: 1,
  gridResolution: 28,
  playbackSpeed: 1,
  sliceZ: 0,
  showPhonons: true,
  showVectors: true,
};

export const SCENARIOS: Record<string, { label: string; description: string; params: Partial<SimulationParameters> }> = {
  baseline: {
    label: "D263 · 기준 공정",
    description: "100 μm pitch, 0.95 Tg의 논문 기준 조건",
    params: {},
  },
  conservative: {
    label: "저온 완화",
    description: "변형 위험은 낮지만 긴 처리 시간이 필요한 조건",
    params: { annealRatio: 0.86, laserPowerW: 3.2, activationEnergyEv: 2.15, beamRadiusUm: 145 },
  },
  fast: {
    label: "고속 선택 어닐",
    description: "고온·집중 레이저로 빠른 소멸을 유도",
    params: { annealRatio: 0.99, laserPowerW: 7.5, beamRadiusUm: 82, elasticCoupling: 0.9 },
  },
  sameSign: {
    label: "동일 부호 대조군",
    description: "결함 반발 및 불완전 소멸을 비교하는 대조 조건",
    params: { topology: "same", annealRatio: 0.95, elasticCoupling: 0.7 },
  },
  tgvArray: {
    label: "3 × 3 TGV 배열",
    description: "교대 부호 배열의 집단 상호작용",
    params: { topology: "alternatingArray", viaPitchUm: 86, viaRadiusUm: 17, fieldWidthUm: 360, gridResolution: 32 },
  },
  utg: {
    label: "Foldable UTG",
    description: "얇은 알루미노실리케이트 유리의 국부 응력 완화",
    params: { material: "aluminosilicate", thicknessUm: 40, viaRadiusUm: 12, viaPitchUm: 75, initialStressMPa: 165 },
  },
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function materialFor(params: SimulationParameters): MaterialPreset {
  return MATERIALS[params.material];
}

export function phononRate(
  params: SimulationParameters,
  order = 0.7,
  localTemperatureRatio = params.annealRatio,
): number {
  const material = materialFor(params);
  const temperature = material.glassTransitionK * localTemperatureRatio;
  const arrhenius = material.debyeFrequency * params.debyeScale
    * Math.exp(-params.activationEnergyEv / (K_B_EV * Math.max(temperature, 1)));
  const paperFactor = clamp(1 - params.nonlinearOrder * order ** 2 * localTemperatureRatio, 0.02, 1);
  return arrhenius * paperFactor;
}

function diffusionRate(params: SimulationParameters): number {
  const pitchM = params.viaPitchUm * 1e-6;
  // A 0.02 projection factor maps 3D heat diffusion onto relaxation of the measured stress order field.
  return 0.02 * materialFor(params).thermalDiffusivity * params.diffusionScale / (pitchM * pitchM);
}

function elasticRate(params: SimulationParameters): number {
  if (params.topology === "same") return 0;
  const topologyFactor = params.topology === "alternatingArray" ? 1.3 : 1;
  const spacingFactor = (100 / params.viaPitchUm) ** 2;
  const viscosityFactor = 10 ** (8 - params.logViscosity);
  return 0.5 * params.elasticCoupling * topologyFactor * spacingFactor * viscosityFactor;
}

export function characteristicTime(params: SimulationParameters): number {
  const localRate = phononRate(params) + diffusionRate(params) + elasticRate(params);
  const sameSignPenalty = params.topology === "same" ? 4 : 1;
  return clamp(sameSignPenalty / Math.max(localRate, 1e-8), 0.0001, 1e8);
}

export function localTemperatureRatio(params: SimulationParameters, x: number, y: number, z: number): number {
  const radial2 = x * x + y * y;
  const gaussian = Math.exp(-radial2 / Math.max(params.beamRadiusUm ** 2, 1));
  const depth = 0.72 + 0.28 * Math.cos(Math.PI * z / Math.max(params.thicknessUm, 1));
  const ambientRatio = 0.55;
  const powerGain = clamp(params.laserPowerW / 5, 0.2, 2);
  return clamp(ambientRatio + (params.annealRatio - ambientRatio) * gaussian * depth * powerGain, 0.5, 1.08);
}

interface Center { x: number; y: number; sign: number }

export function viaCenters(params: SimulationParameters): Center[] {
  const p = params.viaPitchUm;
  if (params.topology === "alternatingArray") {
    const centers: Center[] = [];
    for (let row = -1; row <= 1; row += 1) {
      for (let col = -1; col <= 1; col += 1) {
        centers.push({ x: col * p, y: row * p, sign: (row + col) % 2 === 0 ? 1 : -1 });
      }
    }
    return centers;
  }
  return [
    { x: -p / 2, y: 0, sign: 1 },
    { x: p / 2, y: 0, sign: params.topology === "same" ? 1 : -1 },
  ];
}

function signedStressField(params: SimulationParameters, x: number, y: number, z: number, time: number): number {
  const centers = viaCenters(params);
  const tau = characteristicTime(params);
  const topologyOpposes = params.topology !== "same";
  const progress = 1 - Math.exp(-time / tau);
  const broadening = 1 + 0.7 * Math.sqrt(Math.max(time / tau, 0));
  const decayLength = Math.max(params.viaRadiusUm * 0.7 * broadening, 4);
  const zFactor = 0.58 + 0.42 * Math.cos(Math.PI * z / Math.max(params.thicknessUm, 1));
  let total = 0;

  for (const center of centers) {
    const dx = x - center.x;
    const dy = y - center.y;
    const radius = Math.hypot(dx, dy);
    const ring = Math.exp(-(((radius - params.viaRadiusUm) / decayLength) ** 2));
    const angular = 0.7 + 0.3 * Math.cos(2 * Math.atan2(dy, dx));
    const localRatio = localTemperatureRatio(params, x, y, z);
    const localGamma = phononRate(params, 0.7, localRatio);
    const projectedDiffusion = diffusionRate(params) * (0.45 + 0.55 * localRatio / params.annealRatio);
    const interaction = topologyOpposes ? elasticRate(params) : 0;
    const amplitude = Math.exp(-(localGamma + projectedDiffusion + interaction) * time);
    total += center.sign * ring * angular * zFactor * amplitude;
  }

  // Reduced-order moving singularities visualize attraction/annihilation while the physical vias remain fixed.
  if (centers.length === 2) {
    const coreOffset = params.viaPitchUm * 0.32 * (topologyOpposes ? 1 - progress : 1 + 0.15 * progress);
    const coreWidth = params.viaRadiusUm * (0.75 + 0.55 * progress);
    const coreDecay = Math.exp(-time / (tau * (topologyOpposes ? 0.9 : 3.5)));
    const left = Math.exp(-((x + coreOffset) ** 2 + y * y) / (2 * coreWidth ** 2));
    const right = Math.exp(-((x - coreOffset) ** 2 + y * y) / (2 * coreWidth ** 2));
    total += 0.72 * zFactor * coreDecay * (left + (topologyOpposes ? -right : right));
  }

  return clamp(total, -1, 1);
}

export function generateField(params: SimulationParameters, time: number): FieldSample[] {
  const n = params.gridResolution;
  const nz = Math.max(6, Math.round(n * params.thicknessUm / params.fieldWidthUm));
  const samples: FieldSample[] = [];
  for (let iz = 0; iz < nz; iz += 1) {
    const z = -params.thicknessUm / 2 + (iz / Math.max(nz - 1, 1)) * params.thicknessUm;
    for (let iy = 0; iy < n; iy += 1) {
      const y = -params.fieldWidthUm / 2 + (iy / (n - 1)) * params.fieldWidthUm;
      for (let ix = 0; ix < n; ix += 1) {
        const x = -params.fieldWidthUm / 2 + (ix / (n - 1)) * params.fieldWidthUm;
        const value = signedStressField(params, x, y, z, time);
        samples.push({ x, y, z, value, temperatureRatio: localTemperatureRatio(params, x, y, z) });
      }
    }
  }
  return samples;
}

export function computeMetrics(params: SimulationParameters, time: number): SimulationMetrics {
  const material = materialFor(params);
  const tau = characteristicTime(params);
  const residualFloor = params.topology === "same" ? 0.14 : params.topology === "alternatingArray" ? 0.025 : 0.012;
  const exponential = Math.exp(-time / tau);
  const meanOrder = clamp(residualFloor + (1 - residualFloor) * exponential, 0, 1);
  const peakStressMPa = params.initialStressMPa * meanOrder;
  const thicknessCm = params.thicknessUm * 1e-4;
  const retardationNm = material.stressOpticalCoefficient * thicknessCm * peakStressMPa;
  const strainProxy = peakStressMPa / (material.elasticModulusGPa * 1000);
  const brillouinShiftPct = clamp(100 * strainProxy * 8, 0, 3.5);
  const ramanShiftCm = peakStressMPa / 1000;
  const ligament = Math.max(params.viaPitchUm - 2 * params.viaRadiusUm, 1);
  const geometryAmplification = clamp(55 / ligament, 0.6, 3);
  const riskSignal = peakStressMPa * geometryAmplification / 115;
  const crackRiskPct = 100 / (1 + Math.exp(-5 * (riskSignal - 1)));

  return {
    time,
    characteristicTime: tau,
    processTime99: 4.605 * tau,
    gammaPh: phononRate(params),
    meanOrder,
    peakStressMPa,
    retardationNm,
    brillouinShiftPct,
    ramanShiftCm,
    crackRiskPct,
    annihilationPct: (1 - meanOrder) * 100,
    thermalBudgetJ: params.laserPowerW * time,
  };
}

export function modelWarnings(params: SimulationParameters): string[] {
  const warnings: string[] = [];
  if (params.viaPitchUm <= 2.2 * params.viaRadiusUm) warnings.push("Via ligament가 너무 좁습니다. 기하학적 중첩 또는 파손 위험이 큽니다.");
  if (params.annealRatio > 1.02) warnings.push("Tg 초과 영역입니다. 점성 유동·형상 변형을 별도 검증해야 합니다.");
  if (params.annealRatio < 0.8) warnings.push("낮은 어닐 온도로 Arrhenius 완화 시간이 매우 길어질 수 있습니다.");
  if (params.activationEnergyEv > 2.8) warnings.push("높은 활성화 에너지에서는 논문의 0.5 s 기준과 큰 차이가 납니다. 실험 보정이 필요합니다.");
  if (params.topology === "same") warnings.push("동일 부호 결함은 상쇄되지 않습니다. 잔류 응력 바닥값을 포함한 대조 모델입니다.");
  if (params.gridResolution < 24) warnings.push("빠른 미리보기 격자입니다. 정량 비교에는 28 이상을 권장합니다.");
  return warnings;
}

export function topologyLabel(topology: TopologyMode): string {
  if (topology === "same") return "동일 부호 · 반발";
  if (topology === "alternatingArray") return "3 × 3 교대 배열";
  return "반대 부호 · 소멸";
}
