/**
 * BFF interpreter. Executes a combined tape in-place.
 * IP, head0, head1 all start at 0, wrap modulo tape length.
 */
export function execute(tape: Uint8Array, maxSteps: number): void {
  const len = tape.length;
  let ip = 0;
  let head0 = 0;
  let head1 = 0;

  for (let step = 0; step < maxSteps; step++) {
    const inst = tape[ip];

    switch (inst) {
      case 0x2b: // +
        tape[head0] = (tape[head0] + 1) & 0xff;
        break;
      case 0x2d: // -
        tape[head0] = (tape[head0] - 1) & 0xff;
        break;
      case 0x3c: // <
        head0 = (head0 - 1 + len) % len;
        break;
      case 0x3e: // >
        head0 = (head0 + 1) % len;
        break;
      case 0x7b: // {
        head1 = (head1 - 1 + len) % len;
        break;
      case 0x7d: // }
        head1 = (head1 + 1) % len;
        break;
      case 0x2e: // .
        tape[head1] = tape[head0];
        break;
      case 0x2c: // ,
        tape[head0] = tape[head1];
        break;
      case 0x5b: // [
        if (tape[head0] === 0) {
          let depth = 1;
          for (let i = 0; i < len; i++) {
            ip = (ip + 1) % len;
            if (tape[ip] === 0x5b) depth++;
            else if (tape[ip] === 0x5d) {
              depth--;
              if (depth === 0) break;
            }
          }
          if (depth !== 0) return; // unmatched, terminate
        }
        break;
      case 0x5d: // ]
        if (tape[head0] !== 0) {
          let depth = 1;
          for (let i = 0; i < len; i++) {
            ip = (ip - 1 + len) % len;
            if (tape[ip] === 0x5d) depth++;
            else if (tape[ip] === 0x5b) {
              depth--;
              if (depth === 0) break;
            }
          }
          if (depth !== 0) return; // unmatched, terminate
        }
        break;
      // all other bytes: no-op
    }

    ip = (ip + 1) % len;
  }
}
