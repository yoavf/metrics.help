---
id: rewards-standard
name: Rewards (Standard)
parent: rewards
shortDescription: Standard reward signal for RL training.
whatToLookFor:
  - Should trend upward over many steps, but expect noise and plateaus.
  - High variance is normal in early stages.
  - "Flatline means the model isn't finding a better policy."
  - Sudden explosion may indicate reward hacking.
visualizations:
  yDomain: [0, 550]
  healthy:
    data:
      - { step: 0, value: 5 }
      - { step: 10, value: 25 }
      - { step: 20, value: 55 }
      - { step: 30, value: 85 }
      - { step: 40, value: 115 }
      - { step: 50, value: 140 }
      - { step: 60, value: 160 }
      - { step: 70, value: 175 }
      - { step: 80, value: 185 }
      - { step: 90, value: 190 }
      - { step: 100, value: 195 }
    analysis: "Steady improvement. Rewards climb gradually and plateau at a high value, indicating the model is learning to produce better outputs."
  unhealthy:
    stagnation:
      label: "Reward Stagnation"
      data:
        - { step: 0, value: 20 }
        - { step: 10, value: 22 }
        - { step: 20, value: 25 }
        - { step: 30, value: 23 }
        - { step: 40, value: 28 }
        - { step: 50, value: 24 }
        - { step: 60, value: 26 }
        - { step: 70, value: 25 }
        - { step: 80, value: 27 }
        - { step: 90, value: 24 }
        - { step: 100, value: 26 }
      analysis: "Stagnation. Rewards stay flat at a low value, meaning the model is failing to discover a better policy."
    reward_hacking:
      label: "Reward Hacking"
      data:
        - { step: 0, value: 5 }
        - { step: 10, value: 20 }
        - { step: 20, value: 50 }
        - { step: 30, value: 100 }
        - { step: 40, value: 180 }
        - { step: 50, value: 280 }
        - { step: 60, value: 350 }
        - { step: 70, value: 420 }
        - { step: 80, value: 470 }
        - { step: 90, value: 510 }
        - { step: 100, value: 540 }
      analysis: "Reward explosion. The model has found an exploit in the reward function, achieving unrealistically high scores without solving the actual task. Check your reward function for loopholes."
---
Standard reward signal used in PPO and other RL algorithms. The reward function scores model outputs, and the goal is to maximize this score over training.
