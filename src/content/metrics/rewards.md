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
  yDomain: [-15, 550]
  healthy:
    data:
      - { step: 0, value: -10 }
      - { step: 20, value: -5 }
      - { step: 40, value: 0 }
      - { step: 60, value: 5 }
      - { step: 80, value: 10 }
      - { step: 100, value: 15 }
    analysis: "Steady improvement. The agent is consistently finding actions that yield higher rewards."
  unhealthy:
    stagnation:
      label: "Reward Stagnation"
      data:
        - { step: 0, value: -10 }
        - { step: 20, value: -10 }
        - { step: 40, value: -9 }
        - { step: 60, value: -10 }
        - { step: 80, value: -10 }
        - { step: 100, value: -10 }
      analysis: "Stagnation. The rewards are flatlining, meaning the agent is failing to discover a better policy."
    reward_hacking:
      label: "Reward Hacking"
      data:
        - { step: 0, value: -10 }
        - { step: 20, value: 5 }
        - { step: 40, value: 50 }
        - { step: 60, value: 150 }
        - { step: 80, value: 300 }
        - { step: 100, value: 500 }
      analysis: "Reward explosion. The agent has found an exploit in the reward function, achieving unrealistically high scores without solving the actual task. Check your reward function for loopholes."
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
