export const GRID_COLS = 240;
export const GRID_ROWS = 135;
export const TAPE_SIZE = 64;
export const TAPE_SIDE = 8; // 8x8 pixels per tape
export const CANVAS_WIDTH = GRID_COLS * TAPE_SIDE; // 1920
export const CANVAS_HEIGHT = GRID_ROWS * TAPE_SIDE; // 1080
export const SOUP_BYTES = CANVAS_WIDTH * CANVAS_HEIGHT; // 2,073,600

export const NUM_TAPES = 1 << 17; // 131,072 (paper default, 0D mode)
export const TOTAL_TAPE_BYTES = NUM_TAPES * TAPE_SIZE; // 8,388,608
export const VISIBLE_TAPES = GRID_COLS * GRID_ROWS; // 32,400
export const MAX_STEPS = 8192; // 2^13
export const DEFAULT_MUTATION_RATE = 1 / 4096; // ~0.000244

export const BFF_INSTRUCTIONS: Record<number, string> = {
  0x2b: "+",
  0x2d: "-",
  0x2c: ",",
  0x2e: ".",
  0x3c: "<",
  0x3e: ">",
  0x5b: "[",
  0x5d: "]",
  0x7b: "{",
  0x7d: "}",
};
