---
id: rewards
name: Rewards
aliases: [rewards, reward, rewards/mean, rewards/reward_func_with_saving/mean, mean_reward]
shortDescription: Feedback signal strength.
whatToLookFor:
  - Should trend upward over many steps, but expect noise and plateaus.
  - High variance is normal in early stages.
  - "Flatline means the agent isn't finding the solution."
  - 'In GRPO, rewards are often group-wise normalized.'
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
variations:
  trl-grpo:
    description: 'Group-wise normalized rewards.'
    whatToLookFor:
      - Rewards are normalized within the group of generations for a single prompt.
      - Zero means average performance within the group.
      - 'Positive means better than group average, negative means worse.'
  trl-kto:
    description: 'Implicit rewards derived from the KTO loss.'
    whatToLookFor:
      - KTO maximizes the implicit reward.
      - Should increase over time.
---
The score the agent receives for its actions. The goal of RL is to maximize this.
