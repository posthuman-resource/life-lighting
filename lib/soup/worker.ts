import { SOUP_BYTES, DEFAULT_MUTATION_RATE } from "./constants";
import { Simulation } from "./simulation";
import type { WorkerCommand, WorkerMessage } from "./worker-protocol";

let sim: Simulation;
let running = false;

// How many interactions to run before yielding to render.
// Auto-tuned: start small, adjust based on timing.
let batchSize = 512;
const TARGET_BATCH_MS = 50; // aim for ~20fps visual updates

function sendRender(): void {
  const buffer = new ArrayBuffer(SOUP_BYTES);
  const renderBuf = new Uint8Array(buffer);
  sim.buildRenderBuffer(renderBuf);
  const msg: WorkerMessage = {
    type: "render",
    buffer,
    epoch: sim.epoch,
    interactionsInEpoch: sim.interactionsInEpoch,
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (postMessage as any)(msg, [buffer]);
}

function runBatch(): void {
  if (!running) return;

  const t0 = performance.now();
  sim.runInteractions(batchSize);
  const elapsed = performance.now() - t0;

  // Auto-tune batch size to hit target frame time
  if (elapsed > 0) {
    const ratio = TARGET_BATCH_MS / elapsed;
    batchSize = Math.max(64, Math.min(65536, Math.round(batchSize * ratio)));
  }

  sendRender();
  setTimeout(runBatch, 0);
}

self.onmessage = (e: MessageEvent<WorkerCommand>) => {
  const cmd = e.data;

  switch (cmd.type) {
    case "init":
      sim = new Simulation(DEFAULT_MUTATION_RATE);
      sendRender();
      break;

    case "start":
      if (!running) {
        running = true;
        postMessage({ type: "status", running: true } satisfies WorkerMessage);
        runBatch();
      }
      break;

    case "pause":
      running = false;
      postMessage({ type: "status", running: false } satisfies WorkerMessage);
      break;

    case "step":
      running = false;
      sim.runInteractions(sim.interactionsPerEpoch); // one full epoch
      sendRender();
      postMessage({ type: "status", running: false } satisfies WorkerMessage);
      break;

    case "setMutationRate":
      sim.mutationRate = cmd.rate;
      break;

    case "setEpochsPerBatch":
      // no longer used but handle gracefully
      break;
  }
};
