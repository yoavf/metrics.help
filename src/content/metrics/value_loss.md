---
id: value_loss
name: Value Loss (PPO)
aliases: ['loss/value_avg', value_loss, vf_loss, 'ppo/loss/value']
shortDescription: How well the critic predicts future reward.
whatToLookFor:
  - 'It often starts high and drops as the value model (critic) learns to predict returns. After that, some noise is normal.'
  - 'If it stays high or grows, the advantages are unreliable and policy updates turn noisy. Check reward scale and value learning rate, and make sure value clipping is set sensibly.'
  - 'A sudden jump often follows a change in reward scale, such as a reward model starting to output much larger numbers.'
---
In PPO, a **value model** (the critic) estimates how much reward to expect from each point in a response. Value loss measures how far off those guesses are. Good guesses produce stable advantages, which give the policy clean updates.

## How this is calculated

- **Formula:** 0.5 · mean(max((V − R)², (V_clipped − R)²)), where R is the return and V is the predicted value.
- **Aggregation:** over tokens and minibatches.
- **Source:** TRL `PPOTrainer` logs `loss/value_avg`.
