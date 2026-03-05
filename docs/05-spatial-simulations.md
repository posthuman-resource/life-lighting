# Spatial Simulations (2D Grid)

## Overview

The 0D "primordial soup" treats all tapes as equally likely to interact. The 2D spatial variant adds locality: tapes are arranged on a grid and can only interact with nearby neighbors. This produces richer dynamics — waves of replicators spreading across space, competition between species, spatial niches.

## Setup

- **Grid size**: 240 × 135 = 32,400 tapes
- **Tape length**: 64 bytes (same as 0D)
- **Neighborhood**: Two tapes can interact if `|x0 - x1| <= 2` AND `|y0 - y1| <= 2` (Chebyshev distance ≤ 2, so a 5×5 neighborhood = up to 24 neighbors)
- **Initialization**: Same random uniform initialization

## Interaction Protocol (differs from 0D)

Each epoch:
1. Iterate through all programs P in **random order**
2. For each P, select one neighbor N uniformly at random from P's neighborhood
3. If neither P nor N have been "taken" (used) this epoch, mark both as taken
4. For all taken pairs: execute `split(exec(P||N)) → P' + N'`
5. Programs that don't participate in an interaction still receive mutations

### Key differences from 0D:
- Interactions are **local** — a replicator must spread spatially, one neighbor at a time
- Each tape interacts **at most once per epoch** (the "taken" marking prevents double-use)
- Propagation speed is proportional to grid side length (√n for a square grid), not log(n) as in the 0D soup

## Observed Dynamics

1. **Slower takeover**: In 0D, a replicator takes over half the soup in ~log(n) epochs. In 2D, it takes ~√n epochs because it must spread as a wave front.
2. **Spatial competition**: Multiple replicator species can co-exist in different regions, competing at boundaries.
3. **Visible wave fronts**: The replicator spreads outward from its origin as a roughly circular wave, making the transition visually dramatic.
4. **Richer evolution**: Because different replicator variants occupy different spatial regions, there's more opportunity for variation and competition to persist long-term.

## Visualization

Each tape can be rendered as an 8×8 pixel square (one pixel per byte, color-coded by byte value). The full grid is then 1920 × 1080 pixels (240×8 by 135×8), which maps nicely to a 1080p display.

This is the most visually compelling configuration for our web frontend.

## Relevance for Our Implementation

The 2D grid is ideal for the web visualization because:
- Smaller soup size (32,400 vs 131,072) = faster computation
- Spatial structure makes great visual output
- Can watch replicators emerge and spread in real-time
- Natural canvas for interactive features (click on a tape to inspect it, zoom in on regions, etc.)

We should support both 0D (statistical focus) and 2D (visual focus) modes.
