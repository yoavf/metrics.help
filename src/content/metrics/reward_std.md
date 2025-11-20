---
id: reward_std
name: Reward Std
aliases: [reward_std, rewards/std]
shortDescription: Reward stability.
whatToLookFor:
  - Extremely high variance might make learning difficult.
  - 'Zero variance means the model is getting the exact same reward every time (rare).'
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
---
Standard deviation of the rewards. Indicates how much the rewards vary.
