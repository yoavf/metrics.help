---
id: kl
name: KL Divergence
aliases: [kl, approx_kl, policy/approx_kl, objective/kl, ppo/mean_non_score_reward]
shortDescription: How far the policy has drifted from the reference model.
whatToLookFor:
  - 'There is no universal "good" value. The scale depends on the algorithm, the estimator, and whether it is summed per sequence or averaged per token. Compare it with earlier steps of the same run.'
  - 'A steady, slow rise that levels off is typical. A sudden sharp climb often comes before reward hacking or broken text, so read some samples.'
  - 'In GRPO (TRL), KL is only computed and logged when beta > 0. Recent TRL versions default to beta = 0, so a missing or zero KL may simply mean the penalty is turned off.'
  - '`approx_kl` in PPO usually measures the change between the old and new policy within one update, not drift from the reference model. These are different quantities.'
visualizations:
  yDomain: [0, 30]
  healthy:
    data:
      - { step: 0, value: 0.1 }
      - { step: 10, value: 0.5 }
      - { step: 20, value: 1.2 }
      - { step: 30, value: 1.8 }
      - { step: 40, value: 2.3 }
      - { step: 50, value: 2.6 }
      - { step: 60, value: 2.8 }
      - { step: 70, value: 2.5 }
      - { step: 80, value: 2.7 }
      - { step: 90, value: 2.6 }
      - { step: 100, value: 2.5 }
    analysis: "Controlled drift. KL increases slightly then stabilizes at a low value (illustrative only, not a diagnostic threshold), indicating the policy is learning while staying grounded to the reference."
  unhealthy:
    explosion:
      label: "KL Explosion"
      data:
        - { step: 0, value: 0.1 }
        - { step: 10, value: 0.8 }
        - { step: 20, value: 2.5 }
        - { step: 30, value: 5.0 }
        - { step: 40, value: 8.0 }
        - { step: 50, value: 12.0 }
        - { step: 60, value: 16.0 }
        - { step: 70, value: 20.0 }
        - { step: 80, value: 24.0 }
        - { step: 90, value: 27.0 }
        - { step: 100, value: 30.0 }
      analysis: "Exploding KL. The policy has diverged wildly from the reference, likely leading to reward hacking or gibberish outputs."
    zero_learning:
      label: "No Learning"
      data:
        - { step: 0, value: 0.0 }
        - { step: 10, value: 0.01 }
        - { step: 20, value: 0.02 }
        - { step: 30, value: 0.01 }
        - { step: 40, value: 0.02 }
        - { step: 50, value: 0.01 }
        - { step: 60, value: 0.02 }
        - { step: 70, value: 0.01 }
        - { step: 80, value: 0.01 }
        - { step: 90, value: 0.02 }
        - { step: 100, value: 0.01 }
      analysis: "Zero KL throughout. The policy isn't diverging from the reference at all - this may mean no learning is happening. Check rewards/returns to confirm."
---
KL divergence measures how different the current model's predictions are from a **reference model**, usually the starting checkpoint. You can think of it as a leash: a little drift means the model is learning, a lot of drift means it may be forgetting what made it fluent.

## How this is calculated

- **Formula:** per token, an estimate of KL(π_policy ‖ π_ref) using log π_policy(token) − log π_ref(token) (or a lower-variance estimator such as k3).
- **Aggregation:** averaged per token (GRPO in TRL) or summed over the sequence and then averaged (PPO/RLOO `objective/kl`). This choice can change the scale a lot.
- **Units:** nats.
- **Source:** TRL logs `kl` (GRPO, when beta > 0) and `objective/kl` (PPO/RLOO).
