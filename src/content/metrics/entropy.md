---
id: entropy
name: Entropy
aliases: [entropy, eval_entropy, policy_entropy]
shortDescription: Randomness of the policy.
whatToLookFor:
  - Should decrease slowly over time as the model becomes more confident.
  - If it drops too fast, the model might be collapsing to a suboptimal policy (premature convergence).
  - "If it stays high, the model isn't learning a specific strategy."
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
---
In RL, entropy measures how random the policy is. High entropy means exploration; low entropy means exploitation.
