---
id: entropy
name: Entropy
aliases: ['entropy', 'eval_entropy', 'policy_entropy', 'policy/entropy_avg']
shortDescription: Randomness of the policy.
whatToLookFor:
  - 'A slow decline is common as the model becomes more confident; the right pace depends on the task and settings.'
  - 'A fast drop toward zero often means the model is collapsing onto a few repetitive outputs — check output diversity.'
  - 'Staying high or rising can mean the updates are not shaping behavior, or that sampling temperature is high; compare with rewards.'
visualizations:
  yDomain: [0, 1.2]
  healthy:
    data:
      - { step: 0, value: 1.0 }
      - { step: 20, value: 0.9 }
      - { step: 40, value: 0.8 }
      - { step: 60, value: 0.7 }
      - { step: 80, value: 0.6 }
      - { step: 100, value: 0.5 }
    analysis: "Gradual decrease. The model starts with high exploration and slowly becomes more confident in its best actions."
  unhealthy:
    data:
      - { step: 0, value: 1.0 }
      - { step: 10, value: 0.1 }
      - { step: 20, value: 0.01 }
      - { step: 30, value: 0.0 }
      - { step: 40, value: 0.0 }
      - { step: 50, value: 0.0 }
      - { step: 60, value: 0.0 }
      - { step: 70, value: 0.0 }
      - { step: 80, value: 0.0 }
      - { step: 90, value: 0.0 }
      - { step: 100, value: 0.0 }
    analysis: "Entropy collapse. The model has prematurely converged to a deterministic policy, stopping all exploration."
lastReviewed: '2026-10-01'
---
In RL, entropy measures how random the policy is. High entropy means exploration; low entropy means exploitation.

## How this is calculated

- **Formula:** −Σ p(token) · log p(token) over the vocabulary, at each generated position.
- **Aggregation:** mean over generated tokens.
- **Units:** nats.
- **Source:** TRL logs `entropy` (GRPO) and `policy/entropy_avg` (PPO).
