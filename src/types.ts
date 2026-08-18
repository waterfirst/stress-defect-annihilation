export type MaterialKey = "d263" | "fusedSilica" | "aluminosilicate";
export type TopologyMode = "opposite" | "same" | "alternatingArray";
export type ViewMode = "volume" | "slice" | "hybrid";

export interface MaterialPreset {
  key: MaterialKey;
  name: string;
  glassTransitionK: number;
  thermalDiffusivity: number;
  stressOpticalCoefficient: number;
  debyeFrequency: number;
  elasticModulusGPa: number;
  poissonRatio: number;
}

export interface SimulationParameters {
  material: MaterialKey;
  topology: TopologyMode;
  viewMode: ViewMode;
  viaRadiusUm: number;
  viaPitchUm: number;
  thicknessUm: number;
  fieldWidthUm: number;
  initialStressMPa: number;
  annealRatio: number;
  laserPowerW: number;
  beamRadiusUm: number;
  activationEnergyEv: number;
  debyeScale: number;
  diffusionScale: number;
  elasticCoupling: number;
  logViscosity: number;
  nonlinearOrder: number;
  gridResolution: number;
  playbackSpeed: number;
  sliceZ: number;
  showPhonons: boolean;
  showVectors: boolean;
}

export interface SimulationMetrics {
  time: number;
  characteristicTime: number;
  processTime99: number;
  gammaPh: number;
  meanOrder: number;
  peakStressMPa: number;
  retardationNm: number;
  brillouinShiftPct: number;
  ramanShiftCm: number;
  crackRiskPct: number;
  annihilationPct: number;
  thermalBudgetJ: number;
}

export interface FieldSample {
  x: number;
  y: number;
  z: number;
  value: number;
  temperatureRatio: number;
}

export interface HistoryPoint {
  time: number;
  stress: number;
  order: number;
  risk: number;
}
