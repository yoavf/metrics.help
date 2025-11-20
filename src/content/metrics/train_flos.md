---
id: train_flos
name: Train FLOPs
aliases: [train_flos, total_flos]
shortDescription: Computational cost.
whatToLookFor:
  - Large numbers are expected for LLMs.
  - "Cumulative: should increase roughly linearly with training steps."
  - Useful for comparing efficiency between runs or models.
---
Total Floating Point Operations performed during training. A measure of the total compute used.
Numbers are often huge (e.g., 1e14–1e20+); compare runs or models rather than focusing on the absolute value.
