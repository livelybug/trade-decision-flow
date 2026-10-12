export enum TrendState {
  UP = "UP",
  DOWN = "DOWN",
  RANGE = "RANGE",
  UNCLEAR = "UNCLEAR"
}

export enum MarketPhase {
  ACCUMULATION = "ACCUMULATION",
  DISTRIBUTION = "DISTRIBUTION",
  CONTINUATION = "CONTINUATION",
  REBOUND = "REBOUND",
  UNCLEAR = "UNCLEAR"
}

export enum LocationType {
  MAJOR_SR = "MAJOR_SR",
  LIQUIDATION_ZONE = "LIQUIDATION_ZONE",
  TRENDLINE_RETEST = "TRENDLINE_RETEST",
  WICK_EXTREME = "WICK_EXTREME",
  MIDDLE_OF_RANGE = "MIDDLE_OF_RANGE" // Fatal
}

export enum Timeframe {
  TF_1H = "1H",
  TF_2H = "2H",
  TF_4H = "4H"
}

// Data collected in Part I
export interface GateData {
  btcMajorTrend: TrendState;
  btcMinorTrend: TrendState; // If counter, must be planned
  ethAligned: boolean;
  marketPhase: MarketPhase;
  location: LocationType;
  timeframe: Timeframe;
}

// Data collected in Part II
export interface ScoreData {
  // 1. Market Alignment (0-20)
  btcAligned: boolean; // +10
  ethConfirming: boolean; // +5
  altStrength: boolean; // +5

  // 2. Structure (0-25)
  atLiqCluster: boolean; // +10
  atSRConfluence: boolean; // +10
  wickFalseBreak: boolean; // +5

  // 3. Derivatives (0-20)
  oiDivergence: boolean; // +8
  spotPerpDiv: boolean; // +6
  lsRatioExtreme: boolean; // +6

  // 4. Momentum (0-15)
  momentumDiv: boolean; // +8
  roundingPattern: boolean; // +7

  // 5. Timing (0-10)
  usOpenUnderstood: boolean; // +5
  eventRiskPriced: boolean; // +5

  // 6. Psychology (0-10, can be negative)
  calmState: boolean; // +5
  invalidationClear: boolean; // +5
  anxietyFOMO: boolean; // -10 (Penalty)
}

// Data collected in Part IV, V, VI (Monitor)
export interface MonitorState {
  // Part IV: Management
  rrReached: boolean; // R:R >= 1:1 or Zone Hit

  // Part V: Exit Triggers (2+ = Exit)
  structureInvalid: boolean;
  regimeChange: boolean;
  spotFlowFlip: boolean;
  scoreDrop: boolean;

  // Part VI: Circuit Breakers (Any = Emergency)
  overChecking: boolean;
  revengeUrge: boolean;
  stressHigh: boolean;
}

export type Step = 'GATES' | 'SCORING' | 'RESULT';
