---
id: reward_std
name: Reward Std
aliases: ['reward_std', 'rewards/std', 'frac_reward_zero_std']
shortDescription: Reward stability.
whatToLookFor:
  - 'In GRPO this is the spread of rewards; some spread is needed, because identical rewards in a group give zero advantage and no learning signal.'
  - '`frac_reward_zero_std` shows the share of groups with no spread at all — if it rises, many prompts are too easy or too hard.'
  - 'A very large spread is not automatically bad, but compare with reward scale and check for outlier rewards.'
visualizations:
  yDomain: [0, 110]
  healthy:
    data:
      - { step: 0, value: 1.0 }
      - { step: 100, value: 0.8 }
    analysis: "Stable variance. Rewards are varied enough to provide signal but not so chaotic as to confuse the agent."
  unhealthy:
    data:
      - { step: 0, value: 0.1 }
      - { step: 100, value: 100.0 }
    analysis: "Extreme instability. Reward variance is exploding, making learning impossible."
lastReviewed: '2026-10-01'
---
Standard deviation of the rewards. Indicates how much the rewards vary.

## How this is calculated

- **Formula:** standard deviation of rewards (TRL GRPO: computed within each prompt's group, then averaged).
- **Aggregation:** mean over groups in the logging window.
- **Units:** same as the reward.
- **Source:** TRL `GRPOTrainer` logs `reward_std` and `frac_reward_zero_std`.
