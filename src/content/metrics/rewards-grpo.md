---
id: rewards-grpo
name: Rewards (GRPO)
parent: rewards
shortDescription: Average raw reward of sampled completions.
whatToLookFor:
  - 'The logged reward (e.g. TRL `reward`) is the raw score from your reward function(s), averaged over completions. It is not normalized, so it should trend upward as the model improves.'
  - 'Group normalization happens to the advantages used for the update, not to this logged number. That is why it is usually not centred on zero.'
  - 'Check each reward function on its own too (e.g. `rewards/<func_name>/mean`). The total can rise while one part, like formatting, quietly gets worse.'
  - 'Pair it with reward_std. If every completion in a group gets the same reward, the advantages are zero and that group gives no learning signal.'
lastReviewed: '2026-10-01'
---
In GRPO the model writes several completions for each prompt (a "group"), and your reward function(s) score each one. The **logged reward** is the average of those raw scores. Bigger is better, and its scale depends entirely on how you designed the rewards.

## How this is calculated

- **Formula:** mean over all completions in the batch of the (weighted) sum of reward functions.
- **Separately, for the update:** advantage = (reward − group mean) / group std. This normalized value is used for training and is not shown as `reward`.
- **Units:** whatever units your reward functions use (for example 0/1 for correctness).
- **Source:** TRL `GRPOTrainer` logs `reward`, `reward_std` and `rewards/<func>/mean`.
