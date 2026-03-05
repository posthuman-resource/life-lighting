# Detection and Metrics

## How to Know When Self-Replicators Have Emerged

The paper uses several complementary approaches to detect the "state transition" from pre-life to life.

## 1. High-Order Entropy (Primary Metric)

The paper's novel complexity metric. Defined as:

```
high_order_entropy(s) = shannon_entropy(s) - normalized_kolmogorov_complexity(s)
```

Where:
- `shannon_entropy(s)` = the Shannon entropy computed over individual bytes of string s
- `normalized_kolmogorov_complexity(s)` = Kolmogorov complexity of s divided by length(s)

### Intuition

- **Random noise**: High Shannon entropy, high Kolmogorov complexity. The two cancel out. High-order entropy ≈ 0.
- **Uniform string** (all same byte): Low Shannon entropy, low Kolmogorov complexity. High-order entropy ≈ 0.
- **Self-replicator-dominated soup**: Many copies of the same program. Moderate Shannon entropy (the program has some byte diversity), but LOW Kolmogorov complexity (it's highly compressible — just one program repeated). High-order entropy is **significantly positive**.

### Properties
1. For a sequence of n i.i.d. characters, expected high-order entropy → 0 as n → ∞
2. For n copies of the same k-character string with distribution D, expected high-order entropy → Shannon entropy of D as n → ∞

### Practical Computation

Kolmogorov complexity is uncomputable. The paper approximates it using **brotli compression**:

```
approximate_kolmogorov(s) = compressed_size(brotli(s, quality=2))
```

Using brotli v1.1.0 at quality level 2 (`brotli -q2`).

So the practical formula is:
```
high_order_entropy(soup) = shannon_entropy(soup_bytes) - brotli_compressed_size(soup_bytes) / len(soup_bytes)
```

### State Transition Detection

- Pre-transition: high-order entropy ≈ 0 (or slowly drifting up to ~1)
- At transition: high-order entropy rapidly jumps to values ≥ 1
- Post-transition: high-order entropy continues to evolve (typically 2-6)

A threshold of **high-order entropy ≥ 1** is used as the indicator of state transition.

## 2. Tracer Tokens (Genealogy Tracking)

A technique inspired by radioactive tracers in biology:

### How It Works
1. At initialization, assign every byte in the soup a unique **token**: a tuple of `(epoch, position, character)` packed into a 64-bit integer.
2. When a mutation creates a new byte, assign it a new unique token.
3. When a **copy operation** (`.` or `,`) copies a byte, the token is copied along with it. The overwritten byte's token is displaced/lost.
4. When `+` or `-` modify a byte, only the `character` part of the token changes. The origin (epoch, position) is preserved, allowing tracing even after arithmetic modifications.

### What Tokens Reveal
- **Unique token count**: Starts at 2^23 = 8M. Without replication, slowly decreases to ~3M (from accidental overwrites and mutations). With replication, drops sharply as copies of the same tokens flood the soup.
- **Token concentration**: When a few token IDs dominate the soup, a replicator has taken over.
- **Genealogy**: By tracing which tokens end up where, you can identify the exact epoch and tape where the first replicator emerged.
- **Token/complexity alignment**: The paper shows the token-based transition detection aligns perfectly with the high-order entropy metric.

## 3. Direct Replication Testing

For a definitive check, you can test individual tapes:

```
for each tape S in soup:
    for each tape F in soup (or random F):
        combined = S + F
        result = execute(combined)
        S', F' = split(result)
        if S' == S and F' == S:
            S is a self-replicator with food F
```

This is computationally expensive (O(n²) for all pairs) and misses:
- Substring replicators (smaller than 64 bytes)
- Multi-step autocatalytic cycles
- Replicators that work with specific food but not all food

The paper uses this mainly for anecdotal verification, not as the primary detection method.

## Summary: What to Implement

For our web application, the recommended approach is:

1. **High-order entropy** (primary): Compute Shannon entropy of all soup bytes, compress the full soup with a compressor (brotli if available, or gzip/deflate as approximation), compute the metric. Plot over time.

2. **Unique byte pattern count**: Count distinct 64-byte tapes in the soup. A sharp drop indicates replication.

3. **Top-N frequency**: Track the N most common tapes (or subsequences). When a single tape dominates, replication is occurring.

4. **Optional: Tracer tokens** for genealogy. More complex to implement but enables pinpointing exactly when and where replication begins.
