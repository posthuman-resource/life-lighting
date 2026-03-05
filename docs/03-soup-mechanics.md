# Primordial Soup Mechanics

## Initialization

- **Soup size**: 2^17 = 131,072 tapes (programs)
- **Tape length**: 64 bytes each
- **Initialization**: Each byte of each tape is drawn independently from a uniform distribution over [0, 255]
- **Total bytes**: 131,072 × 64 = 8,388,608 bytes = 8 MB of random data
- No hand-crafted self-replicators are seeded. Everything starts random.

## Interaction Protocol

The simulation proceeds in **epochs**. Each epoch, a number of interactions occur (typically one interaction per pair selected). The interaction protocol:

### Step 1: Select a pair
Pick two tapes **A** and **B** uniformly at random from the soup. Order matters: A is the "left" program, B is the "right" program.

### Step 2: Concatenate
Create a single 128-byte tape by concatenating A and B:
```
combined = A[0..63] + B[0..63]  (128 bytes total)
```

### Step 3: Execute
Run the BFF interpreter on the 128-byte combined tape:
- IP starts at 0 (beginning of A's portion)
- head0 starts at 0
- head1 starts at 0
- Execute up to 2^13 = 8,192 steps, or until the program terminates (unmatched bracket)

During execution, the program can (and usually does) modify both halves of the combined tape through copy operations and increment/decrement.

### Step 4: Split
After execution completes, split the 128-byte tape back into two 64-byte halves:
```
A' = combined[0..63]
B' = combined[64..127]
```

### Step 5: Return to soup
Replace A and B in the soup with A' and B':
```
soup[index_A] = A'
soup[index_B] = B'
```

### Formal notation
The paper describes this as an irreversible chemical reaction:
```
A + B → split(exec(A||B)) = A' + B'
```
Note: `B + A → split(exec(B||A)) = A'' + B''` produces **different** results. Order matters.

## What Constitutes an "Epoch"

The paper uses "epoch" somewhat loosely. In the 0D soup, each epoch involves selecting random pairs from the soup and running interactions. The exact number of interactions per epoch depends on the implementation, but conceptually all tapes get a chance to participate.

In the `cubff` implementation, the default behavior processes many pairs per epoch in parallel (especially on GPU).

## Mutation

Between interactions, random background mutations may be applied:

- **Default mutation rate**: 0.024% per byte per epoch (exactly `1/(256*16) = 1/4096 ≈ 0.0244%` in the `cubff` source, stored as fixed-point: `mutation_prob = 1 << 18` with denominator `1 << 30`)
- This means: for each byte in the soup, there is a ~0.000244 probability it gets replaced with a random byte value [0, 255]
- The paper tested rates from 0% to 1%:
  - **0% mutation**: Self-replicators still emerge (in ~50% of runs within 16k epochs), proving mutation isn't required
  - **0.024%** (default): ~40% of runs show state transition within 16k epochs
  - **Higher rates**: Speed up emergence but also increase destruction of replicators
- Even at 0% mutation with a fixed interaction order (deterministic), self-replicators still emerge in ~50% of runs

## Self-Replication Defined

A program S is a **self-replicator** if there exists some "food" program F such that:
```
S + F → split(exec(S||F)) = S + S
```
That is, S overwrites F with a copy of itself, while remaining intact.

### Caveats acknowledged by the paper
1. This definition only catches **single-step** replication. Multi-step autocatalytic cycles (A copies B, B copies A) are not detected.
2. A replicator may be a **substring** of the full 64-byte tape. If it copies itself at an offset ≠ 64, the tape-level check fails but replication is still functionally occurring.
3. In practice, the paper uses complexity metrics rather than explicit replication checking to detect the "state transition" to life.

## The "State Transition"

The emergence of self-replicators creates a dramatic, observable phase transition:

1. **Pre-transition**: The soup is random noise. Interactions mostly produce garbage. Unique token count slowly decreases. Complexity (high-order entropy) is near zero.

2. **Transition**: A self-replicator emerges and begins copying itself. The number of unique tokens drops sharply. Complexity spikes.

3. **Post-transition**: The soup becomes dominated by replicators and their variants. Multiple replicator "species" may compete. Complexity continues to evolve.

### Timeline (typical BFF run)
- **Epochs 0-1000**: Pre-life. Slow drift. Some "zero-poisoning" may occur (zeros accumulate because early proto-replicators can copy zeros but can't overwrite them).
- **Epochs 1000-5000**: Most state transitions occur in this window.
- **40% of runs**: Show a state transition within 16,000 epochs.
- **60% of runs**: No transition observed within 16,000 epochs (doesn't mean it won't happen, just hasn't yet).

## Zero-Poisoning

An important phenomenon observed in the paper. Early proto-replicators often use the `[,}<]` loop structure. This loop terminates when `tape[head0] == 0`. The problem: these replicators can copy zero bytes but cannot overwrite them (the loop exits when it encounters a zero). This causes zeros to accumulate in the soup, stalling replication.

The resolution comes when a **more robust replicator** evolves — one with a `[<,}]` structure that can overwrite zeros. This second-generation replicator overtakes the soup and the zeros.

## Parameters Summary

| Parameter | Default Value | Notes |
|-----------|--------------|-------|
| Soup size | 2^17 = 131,072 | Number of tapes |
| Tape length | 64 bytes | Per tape |
| Max execution steps | 2^13 = 8,192 | Per interaction |
| Mutation rate | 0.024% | Per byte per epoch |
| Instruction count | 10 | Out of 256 possible byte values |
| Epochs | 16,000 | Typical run length |
| Byte values | 256 | 10 instructions + 1 zero + 245 no-ops |
