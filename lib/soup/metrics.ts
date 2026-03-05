import { TAPE_SIZE } from "./constants";

export function shannonEntropy(data: Uint8Array): number {
  const counts = new Uint32Array(256);
  for (let i = 0; i < data.length; i++) {
    counts[data[i]]++;
  }
  const len = data.length;
  let entropy = 0;
  for (let i = 0; i < 256; i++) {
    if (counts[i] > 0) {
      const p = counts[i] / len;
      entropy -= p * Math.log2(p);
    }
  }
  return entropy;
}

// FNV-1a 32-bit hash for fast tape hashing
function fnv1a(data: Uint8Array, offset: number, length: number): number {
  let hash = 0x811c9dc5;
  const end = offset + length;
  for (let i = offset; i < end; i++) {
    hash ^= data[i];
    hash = (hash * 0x01000193) | 0;
  }
  return hash;
}

export function countUniqueTapes(
  tapes: Uint8Array,
  tapeSize: number,
  numTapes: number
): number {
  const seen = new Set<number>();
  for (let i = 0; i < numTapes; i++) {
    seen.add(fnv1a(tapes, i * tapeSize, tapeSize));
  }
  return seen.size;
}
