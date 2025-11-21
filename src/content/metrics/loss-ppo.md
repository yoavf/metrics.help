---
id: loss-ppo
name: Loss (PPO)
parent: loss
shortDescription: Clipped surrogate policy loss.
whatToLookFor:
  - Does NOT necessarily decrease like SFT loss.
  - Expect noise; watch for absence of huge spikes rather than a monotonic trend.
  - Large spikes indicate policy instability or collapse.
---
Clipped surrogate objective (often reported as a policy loss). Can be negative or positive depending on implementation (entropy/value terms, sign conventions).
