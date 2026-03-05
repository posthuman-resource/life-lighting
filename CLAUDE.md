# Computational Life — Primordial Soup Simulator

Web-based replication of the "Computational Life" paper. Random BFF programs in a primordial soup interact and spontaneously give rise to self-replicators.

## Quick Start

```bash
npm run dev    # http://localhost:3000
```

**IMPORTANT**: Before starting `npm run dev`, always kill any existing dev servers first:
```bash
fuser -k 3000/tcp 2>/dev/null; rm -f .next/dev/lock
```
Do NOT leave stale dev servers running on other ports. If the dev server starts on 3001/3002, something is wrong -- kill everything and restart on 3000.

Full simulation is running: BFF interpreter, 0D soup with 131,072 tapes, Web Worker, controls, and info modal.

## Project Structure

```
docs/                        # Paper analysis and design docs (read these first)
  01-overview.md             # What we're building and why
  02-bff-language.md         # BFF instruction set
  03-soup-mechanics.md       # Soup initialization, interaction, mutation
  06-architecture.md         # App architecture and implementation phases

lib/soup/                    # Simulation engine + rendering
  constants.ts               # Grid dimensions, tape counts, simulation params
  palette.ts                 # buildPalette() -> 256-entry RGBA color LUT
  renderer.ts                # WebGL2 renderer (with Canvas2D fallback)
  random-fill.ts             # Fills soup buffer with random bytes
  interpreter.ts             # BFF interpreter: execute(tape, maxSteps)
  simulation.ts              # Soup state: 131,072 tapes, epoch logic, render buffer
  metrics.ts                 # Shannon entropy, unique tape count
  worker.ts                  # Web Worker entry point
  worker-protocol.ts         # Shared message types for worker communication

components/
  SimulationPage.tsx         # Client component composing canvas + controls + modal
  SoupCanvas.tsx             # Canvas + rAF render loop, worker lifecycle
  Controls.tsx               # Start/pause/step, mutation slider, metrics display
  InfoModal.tsx              # Modal explaining BFF, the soup, and significance

app/
  page.tsx                   # Renders <SimulationPage />
  layout.tsx                 # Title: "Primordial Soup"
  globals.css                # Fullscreen styles, controls bar, modal
```

## Renderer Architecture

The soup is a flat `Uint8Array` of 1920x1080 bytes (240x135 tapes, each 8x8 pixels). Each byte is one pixel. The renderer maps bytes to colors via a palette lookup table.

**Data flow:** `Uint8Array(SOUP_BYTES)` -> `renderer.uploadSoup(data)` -> `renderer.draw()`

**WebGL2 path** (used in real browsers):
- Soup uploaded as `R8UI` texture (requires `usampler2D` in shader, `RED_INTEGER` format)
- 256x1 RGBA palette texture as color LUT
- Fragment shader reads byte value, looks up color
- Fullscreen quad (2 triangles via TRIANGLE_STRIP)
- Only per-frame cost is ~2MB `texSubImage2D` upload

**Canvas2D fallback** (used when WebGL2 unavailable, e.g., headless Chrome):
- JS loop maps each byte through palette array into ImageData
- Uses `putImageData` to draw

**Key gotcha:** `crypto.getRandomValues()` has a 64KB per-call limit. `random-fill.ts` chunks the 2MB buffer into 64KB calls.

## Color Scheme

BFF instructions get vivid colors; byte 0x00 is near-black; everything else is dark grayscale.

| Byte | Instruction | Color |
|------|-------------|-------|
| 0x00 | zero | near-black |
| 0x2B | `+` | bright green |
| 0x2D | `-` | bright red |
| 0x2C | `,` | magenta |
| 0x2E | `.` | yellow |
| 0x3C | `<` | cyan |
| 0x3E | `>` | orange |
| 0x5B | `[` | blue |
| 0x5D | `]` | indigo |
| 0x7B | `{` | teal |
| 0x7D | `}` | coral |

## Simulation Architecture

**0D mode**: 131,072 tapes (2^17), random pair selection (no spatial locality). Canvas displays first 32,400 tapes as a window into the full soup.

**Epoch**: NUM_TAPES/2 (65,536) interactions. Each interaction concatenates two random tapes into 128 bytes, executes BFF, splits back. Mutations applied via geometric distribution skip.

**Worker protocol**: Main thread sends commands (init/start/pause/step/setMutationRate), worker sends back render buffers (transferred) + metrics snapshots.

**Performance**: `countUniqueTapes` hashes all 131,072 tapes per epoch. This is the bottleneck for metrics computation.

## What's Next

1. **Epochs-per-batch control** -- allow running multiple epochs between renders for speed
2. **Visual indicators** -- highlight replicator patterns when detected
3. **Performance optimization** -- consider WASM for interpreter hot loop
