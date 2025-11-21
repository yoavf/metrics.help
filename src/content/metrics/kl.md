---
id: kl
name: KL Divergence
aliases: [kl, approx_kl, policy/approx_kl]
shortDescription: Drift from reference.
whatToLookFor:
  - Should stay within a reasonable range.
  - Spikes mean the policy is changing too fast (instability).
  - 'Near-zero KL means the policy is staying very close to the reference; check rewards/returns to ensure you are still making useful updates.'
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
    analysis: "Controlled drift. KL increases slightly then stabilizes at a low value (e.g., 1-3), indicating the policy is learning while staying grounded to the reference."
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
Measures how much the current policy has deviated from the reference model (or initial policy). Think of it as measuring how much the model's behavior has changed - like comparing two versions of the same model to see how different their outputs have become.
