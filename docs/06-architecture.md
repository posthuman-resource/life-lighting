# Application Architecture

## Overview

A Next.js application that runs the Computational Life simulation with a web frontend for visualization, and a backend for persistence, history, and analysis.

## Core Components

### 1. BFF Interpreter (Simulation Engine)

**Purpose**: Execute the BFF language and manage the soup.

**Where it runs**: This is the critical architectural decision.

- **Option A: WebAssembly (recommended)**: Write the interpreter in Rust or C, compile to WASM. Runs in the browser for real-time visualization. The paper's `cubff` is C/CUDA — we can port the CPU path to WASM.
- **Option B: Web Worker (JS/TS)**: Pure TypeScript interpreter running in a Web Worker. Simpler to build, slower to execute. May be sufficient for smaller soup sizes or educational purposes.
- **Option C: Server-side**: Run on the backend (Node.js or a separate process). Stream state updates to the frontend via WebSocket. Better for large simulations but adds latency for visualization.

**Recommendation**: Start with Option B (TypeScript Web Worker) for simplicity. The interpreter is simple enough that JS performance may be adequate, especially at reduced soup sizes (e.g., 2^12 = 4,096 tapes for development). Upgrade to WASM later if needed.

**What it must do**:
- Store the soup (array of Uint8Array, each 64 bytes)
- Select random pairs
- Concatenate, execute BFF, split
- Apply mutations
- Track epoch count
- Emit state snapshots and metrics

### 2. Frontend (Visualization)

**Purpose**: Real-time visualization of the soup and metrics.

**Key views**:

#### Soup View (2D mode)
- Canvas rendering of the 2D grid
- Each tape rendered as a small colored block (e.g., 8×8 pixels)
- Color encoding options: by byte value distribution, by entropy, by similarity to most common tape
- Click on a tape to inspect its bytes, see its instruction breakdown
- Watch replicator waves spread across the grid

#### Metrics Dashboard
- High-order entropy over time (line chart)
- Unique tape count over time
- Top-N most common tapes (bar chart)
- Byte value distribution histogram
- Epoch counter

#### Tape Inspector
- Selected tape's bytes displayed as hex and as BFF instructions
- Step-through debugger: execute a single tape pair interaction step by step
- Show head positions, IP, tape state at each step

#### Controls
- Start / Pause / Step (single epoch)
- Speed control (epochs per frame)
- Mutation rate slider
- Soup size selector
- Reset (re-randomize)

### 3. Backend (Persistence & Analysis)

**Purpose**: Save simulation state, log history, run analysis.

**API routes (Next.js API routes or separate server)**:

#### State Management
- `POST /api/simulation` — Create a new simulation with parameters
- `GET /api/simulation/:id` — Get simulation metadata
- `POST /api/simulation/:id/snapshot` — Save current state (full soup)
- `GET /api/simulation/:id/snapshot/:epoch` — Load state at a given epoch
- `POST /api/simulation/:id/resume` — Resume from a saved snapshot

#### History & Metrics
- `POST /api/simulation/:id/metrics` — Log metrics for an epoch (entropy, unique count, etc.)
- `GET /api/simulation/:id/metrics` — Get metrics time series
- `GET /api/simulation/:id/replicators` — Get detected replicator patterns

#### Analysis
- `POST /api/simulation/:id/analyze` — Run analysis on current state (detect replicators, compute detailed entropy)
- `GET /api/simulation/:id/genealogy` — Get tracer token genealogy data

**Storage**:
- Simulation state: A full soup snapshot is 131,072 × 64 = 8 MB uncompressed. With compression (the soup becomes very compressible after replicators emerge), much smaller. SQLite or filesystem storage for snapshots.
- Metrics: Time-series data, lightweight. SQLite or JSON files.

### 4. Data Model

```
Simulation {
  id: string
  created_at: timestamp
  parameters: {
    soup_size: number        // e.g., 131072
    tape_length: number      // e.g., 64
    max_steps: number        // e.g., 8192
    mutation_rate: number    // e.g., 0.00024
    mode: "0d" | "2d"
    grid_width?: number      // for 2D mode
    grid_height?: number     // for 2D mode
    seed: number             // RNG seed for reproducibility
  }
  current_epoch: number
  status: "running" | "paused" | "completed"
}

Snapshot {
  simulation_id: string
  epoch: number
  soup_data: Uint8Array      // compressed full soup state
  rng_state: object          // for reproducible resume
}

MetricsEntry {
  simulation_id: string
  epoch: number
  high_order_entropy: number
  unique_tapes: number
  top_tape_frequency: number
  shannon_entropy: number
  compressed_size: number
}
```

## Implementation Order

### Phase 1: Core Interpreter
1. Implement BFF interpreter in TypeScript
2. Implement single interaction (concat, execute, split)
3. Unit tests: verify known self-replicator behavior (e.g., the paper's `[[{.>]-]` example)
4. Implement soup management (initialization, pair selection, mutation)

### Phase 2: Basic Frontend
1. Simple controls (start, pause, step)
2. Metrics display (entropy over time)
3. Basic soup visualization (e.g., per-tape entropy heatmap)

### Phase 3: Persistence
1. API routes for saving/loading snapshots
2. Metrics logging
3. Resume from saved state

### Phase 4: Rich Visualization
1. 2D grid mode with canvas rendering
2. Tape inspector / debugger
3. Replicator detection and highlighting

### Phase 5: Analysis
1. Tracer token system
2. Genealogy tracking
3. Comparative analysis across runs

## Performance Considerations

- **Soup of 131,072 tapes**: Each epoch involves ~65,536 interactions (half the tapes). Each interaction runs up to 8,192 BFF steps. That's up to 536 million BFF steps per epoch. This is too much for pure JS in real-time at full speed.
- **Practical approach**: Start with a smaller soup (e.g., 2^12 = 4,096 tapes) for development and interactive exploration. The paper shows self-replicators emerge in smaller soups too, just with different timing.
- **Background computation**: Use Web Workers to keep the UI responsive. Batch multiple epochs between UI updates.
- **GPU acceleration**: Future possibility — WebGPU compute shaders could parallelize the soup interactions, similar to the paper's CUDA approach.
