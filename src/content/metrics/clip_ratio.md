---
id: clip_ratio
name: Clip Ratio (Policy Updates)
aliases: ['clip_ratio', 'clip_ratio/mean', 'clip_ratio/region_mean', 'clip_fraction', 'clip_ratio/low_mean', 'clip_ratio/high_mean', 'clip_ratio/low_min', 'clip_ratio/high_max', 'policy/clipfrac_avg']
shortDescription: PPO update magnitude.
whatToLookFor:
  - 'Compare with earlier steps of the same run: a small, steady value is typical, while a sustained rise means updates are getting too large.'
  - 'If it climbs, try a lower learning rate or fewer optimization passes per batch before touching the clip range.'
  - 'Exactly zero all the time can mean the policy is barely changing between rollouts (for example one update per batch, where the ratio is always 1).'
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
lastReviewed: '2026-10-01'
---
In PPO/GRPO, this measures the fraction of tokens whose update triggered the clipping mechanism to prevent too large policy updates.

## How this is calculated

- **Formula:** fraction of tokens where the probability ratio r = π_new / π_old falls outside [1 − ε, 1 + ε] (and the clip is active).
- **Aggregation:** mean over tokens; TRL GRPO also reports `clip_ratio/low_mean` and `clip_ratio/high_mean` for each side.
- **Units:** fraction 0–1.
- **Source:** TRL `GRPOTrainer` (`clip_ratio/*`), `PPOTrainer` (`policy/clipfrac_avg`).

**Note:** Not the same as `completions/clipped_ratio`, which counts completions cut off by the length limit (see Truncated Completions).
