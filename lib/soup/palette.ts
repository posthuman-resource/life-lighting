const INSTRUCTION_COLORS: Record<number, [number, number, number]> = {
  0x00: [10, 10, 10], // zero — near-black
  0x2b: [0, 255, 136], // + — bright green
  0x2d: [255, 68, 68], // - — bright red
  0x2c: [255, 0, 255], // , — magenta
  0x2e: [255, 221, 0], // . — yellow
  0x3c: [0, 221, 255], // < — cyan
  0x3e: [255, 136, 0], // > — orange
  0x5b: [68, 136, 255], // [ — blue
  0x5d: [136, 68, 255], // ] — indigo
  0x7b: [0, 255, 204], // { — teal
  0x7d: [255, 102, 85], // } — coral
};

export function buildPalette(): Uint8Array {
  const data = new Uint8Array(256 * 4);

  for (let i = 0; i < 256; i++) {
    const offset = i * 4;
    const known = INSTRUCTION_COLORS[i];

    if (known) {
      data[offset] = known[0];
      data[offset + 1] = known[1];
      data[offset + 2] = known[2];
    } else {
      // Dark grayscale gradient from 0x18 (24) to 0x60 (96)
      const gray = 24 + Math.round((i / 255) * (96 - 24));
      data[offset] = gray;
      data[offset + 1] = gray;
      data[offset + 2] = gray;
    }
    data[offset + 3] = 255;
  }

  return data;
}
