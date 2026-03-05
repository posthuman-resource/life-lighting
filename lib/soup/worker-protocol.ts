// Main -> Worker
export type WorkerCommand =
  | { type: "init" }
  | { type: "start" }
  | { type: "pause" }
  | { type: "step" }
  | { type: "setMutationRate"; rate: number }
  | { type: "setEpochsPerBatch"; count: number };

// Worker -> Main
export type WorkerMessage =
  | { type: "render"; buffer: ArrayBuffer; epoch: number; interactionsInEpoch: number }
  | { type: "status"; running: boolean };
