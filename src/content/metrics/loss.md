---
id: loss
name: Loss
aliases: [loss, eval_loss, train_loss, val_loss, validation_loss, total_loss]
shortDescription: How wrong the model is.
whatToLookFor:
  - It should decrease over time.
  - If it goes up, your learning rate might be too high.
  - If it flattens out too early, you might be stuck in a local minimum.
  - Validation loss diverging from training loss indicates overfitting.
  - 'Note: In GRPO, loss can be negative (policy loss) - this is normal.'
visualizations:
  yDomain: [0, 5]
  healthy:
    data:
      - { step: 0, value: 2.5 }
      - { step: 10, value: 1.8 }
      - { step: 20, value: 1.2 }
      - { step: 30, value: 0.8 }
      - { step: 40, value: 0.5 }
      - { step: 50, value: 0.3 }
      - { step: 60, value: 0.25 }
      - { step: 70, value: 0.22 }
      - { step: 80, value: 0.2 }
      - { step: 90, value: 0.19 }
      - { step: 100, value: 0.18 }
    analysis: "Ideal behavior. The loss decreases rapidly at first and then stabilizes, indicating the model is learning effectively."
  unhealthy:
    divergence:
      label: "Loss Divergence"
      data:
        - { step: 0, value: 2.5 }
        - { step: 10, value: 1.8 }
        - { step: 20, value: 1.2 }
        - { step: 30, value: 0.9 }
        - { step: 40, value: 0.8 }
        - { step: 50, value: 1.0 }
        - { step: 60, value: 1.3 }
        - { step: 70, value: 1.8 }
        - { step: 80, value: 2.4 }
        - { step: 90, value: 3.1 }
        - { step: 100, value: 4.0 }
      analysis: "Divergence. The loss starts to decrease but then rises significantly. This often indicates a learning rate that is too high or training instability."
    overfitting:
      label: "Overfitting"
      data:
        - { step: 0, train: 2.5, val: 2.5 }
        - { step: 20, train: 1.5, val: 1.6 }
        - { step: 40, train: 0.8, val: 1.3 }
        - { step: 60, train: 0.4, val: 1.8 }
        - { step: 80, train: 0.15, val: 2.5 }
        - { step: 100, train: 0.05, val: 3.2 }
      analysis: "Classic overfitting. Training loss keeps dropping while validation loss increases - the model is memorizing the training data rather than learning generalizable patterns."
variations:
  trl-sft:
    description: 'Cross-entropy loss for token prediction. Always positive, typically starts around 0.5-5.0 depending on initialization.'
    whatToLookFor:
      - Should decrease monotonically.
      - 'Stuck at 0.693 for binary classification? Model is predicting randomly (log(2)).'
      - 'Stuck at 1.098 for 3-class classification? Model is predicting uniformly (log(3)).'
  trl-dpo:
    description: 'Bradley-Terry preference ranking loss. Always positive, starts at 0.693 (log(2)). Can exceed 1.0 when the model ranks rejected responses too highly.'
    whatToLookFor:
      - Must decrease below 0.693 to show learning.
      - If it stays at 0.693, the model cannot distinguish between chosen and rejected responses.
      - 'Lower is better, but extremely low values (<0.1) might indicate overfitting to the preference dataset.'
  trl-ppo:
    description: 'Clipped surrogate objective (often reported as a policy loss). Can be negative or positive depending on implementation (entropy/value terms, sign conventions).'
    whatToLookFor:
      - Does NOT necessarily decrease like SFT loss.
      - Expect noise; watch for absence of huge spikes rather than a monotonic trend.
      - Large spikes indicate policy instability or collapse.
  trl-grpo:
    description: 'Policy loss. Can be negative. Does not include a value function loss (unlike PPO), so sign and scale depend on the implementation.'
    whatToLookFor:
      - Often negative.
      - Expect some noise; avoid large spikes.
      - Measures how much the policy is improving relative to the group baseline.
  trl-orpo:
    description: 'Combined loss: SFT Loss + Odds Ratio Loss.'
    whatToLookFor:
      - Should decrease over time.
      - Combines learning the format (SFT) and the preference (OR).
      - If it increases, the penalty for rejected responses might be too strong.
  trl-kto:
    description: 'Kahneman-Tversky loss. Based on binary feedback (good/bad).'
    whatToLookFor:
      - Should decrease.
      - Optimizes the utility of generations based on prospect theory.
---
Loss measures the difference between the model's prediction and the actual target. Lower is better.
