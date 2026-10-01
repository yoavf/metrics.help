---
id: loss-grpo
name: Loss (GRPO)
parent: loss
shortDescription: Group-relative policy loss.
whatToLookFor:
  - 'Not a score of how good the model is: it is often near zero or negative and does not need to go down.'
  - 'Expect noise; watch for sudden large spikes together with jumps in clip ratio or KL.'
  - 'Judge progress by rewards and samples instead.'
lastReviewed: '2026-10-01'
---
Policy loss. Can be negative. Does not include a value function loss (unlike PPO), so sign and scale depend on the implementation.

## How this is calculated

- **Formula:** −mean(min(r·A, clip(r, 1−ε, 1+ε)·A)) + β·KL, with group-normalized advantages A.
- **Aggregation:** over completion tokens (exact normalization depends on `loss_type`).
- **Source:** TRL `GRPOTrainer` `loss`.
