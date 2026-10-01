---
id: reward_margins
name: Reward Margins (DPO)
aliases: ['rewards/margins', 'eval_rewards/margins', 'rewards/chosen', 'rewards/rejected', 'rewards/accuracies', 'eval_rewards/accuracies']
shortDescription: How much more the model favors chosen over rejected.
whatToLookFor:
  - '`rewards/margins` (chosen minus rejected) should grow above 0. `rewards/accuracies` is the share of pairs where the margin is positive.'
  - 'Look at `rewards/chosen` too. If it keeps falling while the margin grows, the model is lowering the probability of both responses, which can hurt output quality.'
  - 'These are implicit rewards based on probabilities, not scores from a reward model. They are only meaningful relative to the reference model and β.'
lastReviewed: '2026-10-01'
---
DPO has no separate reward model. Instead it treats how much the policy has moved away from the reference on a response as an **implicit reward**. The margin is the gap between that reward for the chosen and the rejected response.

## How this is calculated

- **rewards/chosen:** β · (log π(chosen) − log π_ref(chosen)). **rewards/rejected** is calculated the same way.
- **rewards/margins:** rewards/chosen − rewards/rejected. **rewards/accuracies:** mean(margin > 0).
- **Aggregation:** mean over preference pairs in the batch.
- **Source:** TRL `DPOTrainer`.
