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
  yDomain: [0, 60]
  healthy:
    data:
      - { step: 0, value: 0.01 }
      - { step: 50, value: 0.05 }
      - { step: 100, value: 0.03 }
    analysis: "Controlled drift. The policy stays close to the reference model, ensuring stability."
  unhealthy:
    explosion:
      label: "KL Explosion"
      data:
        - { step: 0, value: 0.01 }
        - { step: 50, value: 10.0 }
        - { step: 100, value: 50.0 }
      analysis: "Exploding KL. The policy has diverged wildly from the reference, likely leading to reward hacking or gibberish outputs."
    zero_learning:
      label: "No Learning"
      data:
        - { step: 0, value: 0.0 }
        - { step: 50, value: 0.0 }
        - { step: 100, value: 0.0 }
      analysis: "Zero KL throughout. The policy isn't diverging from the reference at all - this may mean no learning is happening. Check rewards/returns to confirm."
---
Measures how much the current policy has deviated from the reference model (or initial policy). Think of it as measuring how much the model's behavior has changed - like comparing two versions of the same model to see how different their outputs have become.
