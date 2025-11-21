---
id: loss-grpo
name: Loss (GRPO)
parent: loss
shortDescription: Group-relative policy loss.
whatToLookFor:
  - Often negative.
  - Expect some noise; avoid large spikes.
  - Measures how much the policy is improving relative to the group baseline.
---
Policy loss. Can be negative. Does not include a value function loss (unlike PPO), so sign and scale depend on the implementation.
