# Overview: Computational Life Replication

## What the Paper Demonstrates

Random programs, initialized with no purpose or design, will spontaneously give rise to self-replicating programs when allowed to interact. This happens without any fitness function, selection pressure, or intelligent design. The key mechanism is **self-modification through interaction**, not random mutation.

## The Core Idea

Take a "soup" of random byte strings. Each string is both code and data. Randomly pick two, concatenate them, execute the result, split them back apart. Repeat billions of times. Self-replicators emerge.

This is analogous to the origin of life: random molecules in a primordial soup interact, and eventually self-replicating molecules arise.

## What We Are Building

A web-based replication of the paper's primary experiment: the **BFF primordial soup**. BFF is a modified Brainfuck where the instruction and data tapes are unified, and I/O is replaced with copy operations between two heads.

### Core simulation (what the paper does)
- A soup of 2^17 (131,072) tapes, each 64 bytes
- Random initialization from uniform distribution
- Pair-wise interaction via concatenation + execution + splitting
- Optional background mutation
- Complexity measurement via "high-order entropy"

### Our additions (what the paper doesn't do)
- Web frontend for real-time visualization
- Pause/resume simulation with state persistence
- Full interaction history logging
- Analysis tools (entropy tracking, replicator detection, genealogy)
- Support for multiple substrates (BFF, Forth, Z80) eventually

## Documents in this Series

1. **01-overview.md** - This file. High-level project description.
2. **02-bff-language.md** - Complete BFF instruction set and execution semantics.
3. **03-soup-mechanics.md** - The primordial soup: initialization, interaction, mutation.
4. **04-detection-metrics.md** - How to detect self-replicators and measure complexity.
5. **05-spatial-simulations.md** - 2D grid variant with local interactions.
6. **06-architecture.md** - How to structure the Next.js application.
