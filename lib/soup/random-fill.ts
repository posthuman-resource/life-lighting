const CHUNK = 65536;

export function randomFill(data: Uint8Array): void {
  for (let offset = 0; offset < data.length; offset += CHUNK) {
    const end = Math.min(offset + CHUNK, data.length);
    crypto.getRandomValues(data.subarray(offset, end));
  }
}
