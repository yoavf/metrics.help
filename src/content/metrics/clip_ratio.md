---
id: clip_ratio
name: Clip Ratio
aliases: [clip_ratio, clip_ratio/mean, clip_ratio/region_mean, clip_fraction]
shortDescription: PPO update magnitude.
whatToLookFor:
  - 'Should be small (e.g., < 0.1 or 0.2).'
  - If high, your learning rate might be too high or the policy is changing too drastically.
visualizations:
  yDomain: [0, 0.7]
  healthy:
    data:
      - { step: 0, value: 0.01 }
      - { step: 20, value: 0.02 }
      - { step: 40, value: 0.05 }
      - { step: 60, value: 0.03 }
      - { step: 80, value: 0.04 }
      - { step: 100, value: 0.02 }
    analysis: "Low clipping. Most updates are within the trust region, meaning the policy is changing smoothly."
  unhealthy:
    data:
      - { step: 0, value: 0.1 }
      - { step: 20, value: 0.3 }
      - { step: 40, value: 0.5 }
      - { step: 60, value: 0.4 }
      - { step: 80, value: 0.6 }
      - { step: 100, value: 0.5 }
    analysis: "High clipping. Many updates are being clipped, suggesting the learning rate is too high or the policy is unstable."
---
In PPO/GRPO, this measures how many training examples triggered the clipping mechanism to prevent too large policy updates.
