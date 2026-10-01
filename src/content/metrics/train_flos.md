---
id: train_flos
name: Train FLOPs
aliases: [train_flos, total_flos]
shortDescription: Computational cost.
whatToLookFor:
  - 'Large numbers are expected for LLMs.'
  - 'Cumulative: it should grow steadily with training steps.'
  - 'Useful for comparing compute between runs, but it is an estimate, not a measured count.'
lastReviewed: '2026-10-01'
---
Total Floating Point Operations performed during training. A measure of the total compute used.
Numbers are often huge (e.g., 1e14–1e20+); compare runs or models rather than focusing on the absolute value.

## How this is calculated

- **Formula:** estimated as about 6 × parameters × tokens processed.
- **Aggregation:** cumulative over the run.
- **Units:** floating-point operations.
- **Source:** Transformers `Trainer` logs `total_flos`/`train_flos` at the end of training.
