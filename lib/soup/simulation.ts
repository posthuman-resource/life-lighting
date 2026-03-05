import {
  TAPE_SIZE,
  NUM_TAPES,
  TOTAL_TAPE_BYTES,
  VISIBLE_TAPES,
  MAX_STEPS,
  CANVAS_WIDTH,
  TAPE_SIDE,
  GRID_COLS,
} from "./constants";
import { execute } from "./interpreter";

const CHUNK = 65536;
const INTERACTIONS_PER_EPOCH = NUM_TAPES >> 1; // 65,536

function randomFillBuffer(data: Uint8Array): void {
  for (let offset = 0; offset < data.length; offset += CHUNK) {
    const end = Math.min(offset + CHUNK, data.length);
    crypto.getRandomValues(data.subarray(offset, end));
  }
}

export class Simulation {
  tapes: Uint8Array;
  epoch: number = 0;
  interactionsInEpoch: number = 0;
  interactionsPerEpoch: number = INTERACTIONS_PER_EPOCH;
  mutationRate: number;
  private combined: Uint8Array = new Uint8Array(TAPE_SIZE * 2);

  constructor(mutationRate: number) {
    this.tapes = new Uint8Array(TOTAL_TAPE_BYTES);
    this.mutationRate = mutationRate;
    randomFillBuffer(this.tapes);
  }

  /** Run a chunk of interactions. Returns number actually run. */
  runInteractions(count: number): number {
    const combined = this.combined;
    let ran = 0;

    for (let i = 0; i < count; i++) {
      const idxA = (Math.random() * NUM_TAPES) | 0;
      const idxB = (Math.random() * NUM_TAPES) | 0;

      const offA = idxA * TAPE_SIZE;
      const offB = idxB * TAPE_SIZE;

      combined.set(this.tapes.subarray(offA, offA + TAPE_SIZE), 0);
      combined.set(this.tapes.subarray(offB, offB + TAPE_SIZE), TAPE_SIZE);

      execute(combined, MAX_STEPS);

      this.tapes.set(combined.subarray(0, TAPE_SIZE), offA);
      this.tapes.set(combined.subarray(TAPE_SIZE), offB);
      ran++;

      this.interactionsInEpoch++;
      if (this.interactionsInEpoch >= INTERACTIONS_PER_EPOCH) {
        if (this.mutationRate > 0) {
          this.applyMutations();
        }
        this.epoch++;
        this.interactionsInEpoch = 0;
      }
    }

    return ran;
  }

  private applyMutations(): void {
    const logOneMinusP = Math.log(1 - this.mutationRate);
    let pos = Math.floor(Math.log(Math.random()) / logOneMinusP);

    while (pos < TOTAL_TAPE_BYTES) {
      this.tapes[pos] = (Math.random() * 256) | 0;
      pos += Math.floor(Math.log(Math.random()) / logOneMinusP) + 1;
    }
  }

  buildRenderBuffer(out: Uint8Array): void {
    // Display first VISIBLE_TAPES tapes as a window into the full 0D soup
    for (let i = 0; i < VISIBLE_TAPES; i++) {
      const col = i % GRID_COLS;
      const row = (i / GRID_COLS) | 0;
      const tapeOff = i * TAPE_SIZE;

      for (let j = 0; j < TAPE_SIZE; j++) {
        const pixelCol = col * TAPE_SIDE + (j & 7);
        const pixelRow = row * TAPE_SIDE + (j >> 3);
        out[pixelRow * CANVAS_WIDTH + pixelCol] = this.tapes[tapeOff + j];
      }
    }
  }
}
