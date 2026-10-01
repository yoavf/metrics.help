---
id: loss-ppo
name: Loss (PPO)
parent: loss
shortDescription: Clipped surrogate policy loss (plus value loss).
whatToLookFor:
  - 'Unlike SFT loss, it does not need to go down. The data changes every rollout, so a noisy, flat-looking curve is normal.'
  - 'It can be negative. A negative policy loss just means the update is pushing up actions with positive advantage.'
  - 'Watch for sudden large spikes, together with jumps in clip ratio or KL. That is a sign of unstable updates.'
  - 'Look at the policy loss and the value loss separately (e.g. `loss/policy_avg`, `loss/value_avg`). A combined number can hide which one is misbehaving.'
---
PPO's policy loss is the **clipped surrogate objective**, with its sign flipped so it can be minimized. It tells you about the size and direction of each update, not how good the model is.

## How this is calculated

- **Formula:** −mean(min(r·A, clip(r, 1−ε, 1+ε)·A)), where r = π_new / π_old and A is the advantage.
- **Aggregation:** averaged over tokens and minibatches within each PPO epoch.
- **Source:** TRL `PPOTrainer` logs `loss/policy_avg` and `loss/value_avg`.
