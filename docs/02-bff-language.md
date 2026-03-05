# BFF Language Specification

BFF ("Brainfuck Extended") is a family of modifications to Brainfuck designed for self-contained, self-modifying computation. The key changes from standard Brainfuck:

1. **Unified tape**: Instructions and data share the same tape. There is no separate instruction tape.
2. **No I/O**: Input (`,`) and output (`.`) are replaced with head-to-head copy operations.
3. **Two data heads**: `head0` and `head1` operate on the same tape, enabling copy between locations.

## Memory Model

- A single tape of bytes (one byte per cell)
- Three pointers into this tape:
  - **Instruction pointer (IP)**: starts at position 0, advances after each instruction
  - **head0**: a read/write data head, starts at position 0
  - **head1**: a second read/write data head, starts at position 0
- All three pointers operate on the **same tape**
- Tape wraps around (all positions are modulo tape length)

## Instruction Set

Each byte on the tape is interpreted as an instruction when the IP reaches it. Of the 256 possible byte values, only **10 are valid instructions** and **1 is the "zero" value** used for loop exit. The remaining 245 values are no-ops (and can store arbitrary data).

| Symbol | Byte | Operation | Description |
|--------|------|-----------|-------------|
| `<` | — | `head0 = head0 - 1` | Move head0 left |
| `>` | — | `head0 = head0 + 1` | Move head0 right |
| `{` | — | `head1 = head1 - 1` | Move head1 left |
| `}` | — | `head1 = head1 + 1` | Move head1 right |
| `-` | — | `tape[head0] = tape[head0] - 1` | Decrement value at head0 |
| `+` | — | `tape[head0] = tape[head0] + 1` | Increment value at head0 |
| `.` | — | `tape[head1] = tape[head0]` | Copy from head0 to head1 |
| `,` | — | `tape[head0] = tape[head1]` | Copy from head1 to head0 |
| `[` | — | If `tape[head0] == 0`: jump IP forward to matching `]` | Loop start |
| `]` | — | If `tape[head0] != 0`: jump IP backward to matching `[` | Loop end |

### Important details

- **Bracket matching** follows standard nesting rules. `[` matches with the corresponding `]` at the same nesting depth.
- **If no matching bracket is found, the program terminates.** This is a key termination condition.
- **The program also terminates after a fixed number of steps.** The paper states 2^13 = 8,192 steps; the `cubff` source code defaults to 32,768 (`run_steps` flag). The exact value is configurable. This prevents infinite loops from blocking the simulation.
- Since byte value 0 is the "zero" used for loop exit conditions, it is effectively reserved. This means:
  - 10 bytes are instructions
  - 1 byte (0x00) is the loop-exit zero
  - 245 bytes are no-ops / data storage

## Encoding

Each cell is a single byte (0-255). In the `cubff` reference implementation, the mapping uses the **ASCII values** of the BFF symbols: `<` (0x3C), `>` (0x3E), `{` (0x7B), `}` (0x7D), `-` (0x2D), `+` (0x2B), `.` (0x2E), `,` (0x2C), `[` (0x5B), `]` (0x5D). Byte 0x00 is the zero used for loop exit. All other 245 byte values are no-ops. The critical point is:
- Only 10 out of 256 byte values map to actual instructions
- Byte value 0 is the special "zero" for loop conditionals
- Everything else is a no-op

This ratio (10/256 ≈ 3.9% instructions) means that random byte strings are mostly no-ops with occasional instructions scattered through them. This is important for understanding why self-replicators can emerge: a random tape won't do much, but occasional functional subsequences can arise.

## Execution Semantics

```
initialize IP = 0, head0 = 0, head1 = 0
steps = 0

while steps < 8192:
    instruction = tape[IP]

    if instruction is '[' and tape[head0] == 0:
        find matching ']', set IP to that position
        if no matching ']' found: TERMINATE
    elif instruction is ']' and tape[head0] != 0:
        find matching '[', set IP to that position
        if no matching '[' found: TERMINATE
    else:
        execute instruction (move head, copy, inc/dec, or no-op)

    IP = IP + 1
    steps = steps + 1

TERMINATE
```

## Self-Modification

Because instructions and data share the same tape, and the copy operations (`.` and `,`) write to arbitrary tape positions, **programs can and do modify their own code as they execute**. This is the fundamental mechanism that enables self-replication to emerge.

A self-replicator works by using a loop with copy operations to duplicate its own bytes from one region of the tape to another. The simplest observed replicators use patterns like:

- `[,}<]` — loop: copy from head1 to head0, advance head1, move head0 left, repeat until zero
- `[<,}]` — similar but with different head movement order (more robust, can overwrite zeros)

## Example Self-Replicator from the Paper

The paper presents a sanitized self-replicator: `[[{.>]-]` concatenated with its reverse `]-]>.{[[`

This is a palindrome. When concatenated with any 64-byte "food" string and executed:
1. The IP enters the outer loop
2. head1 (write) moves left while head0 (read) moves right
3. At each cycle, one byte is copied via `.`
4. Because the replicator is a palindrome, copying in reverse produces a correct copy
5. The result: the 64-byte food string is overwritten with a copy of the replicator

## The `--lang bff_noheads` Variant

The paper's reference implementation in `cubff` uses `--lang bff_noheads` for the primary BFF experiments. This is the variant described above. The name "noheads" distinguishes it from other BFF variants that may have different head initialization or behavior.
