---
id: grpo
name: GRPO
fullName: Group Relative Policy Optimization
relevantMetrics: [rewards, kl, entropy, clip_ratio, loss, learning_rate, completions]
---

## What is GRPO?

Group Relative Policy Optimization is a reinforcement learning algorithm that simplifies RLHF by removing the need for a separate critic/value model. It still uses a reward model to score generations, but normalizes those rewards within groups of generations, making training more stable and efficient.

## How it works

- Generates multiple completions for each prompt (a "group")
- Normalizes rewards within each group (mean = 0, helps with stability)
- Uses these relative rewards to update the policy with PPO-style clipping
- No separate value/critic model needed, unlike traditional PPO
- Works with both learned reward models and rule-based reward functions

## When to use it

- **Simpler than PPO**: No need to train and maintain a separate value function
- **More stable**: Group normalization reduces reward scale issues
- **Rule-based rewards**: Works well when you can define programmatic reward functions (e.g., code correctness, math accuracy)
- **Limited compute**: Fewer models to train means less memory and compute overhead
- **Fast iteration**: Easier to debug and iterate on than full PPO

## Common pitfalls

- **Group size too small**: With only 1-2 generations per prompt, normalization is unstable. Solution: use 4-8+ generations per group.
- **Reward hacking**: Like PPO, the model can still exploit reward functions. Solution: use diverse prompts, KL penalties, and carefully designed rewards.
- **KL explosion**: Same as PPO - policy can diverge too far. Solution: tune KL penalty (beta) appropriately.
- **All rewards identical**: If all generations get the same reward, there's no signal. Solution: ensure reward function can distinguish quality differences.
- **Ignoring variance**: Group normalization can hide low absolute rewards. Solution: monitor raw (unnormalized) rewards alongside normalized ones.

## What to watch

During GRPO training, monitor:
- **Rewards** (normalized) should start near 0 by design; watch the trend of group winners
- **Raw rewards** (before normalization) should increase over time
- **KL divergence** should stay controlled (avoid sharp spikes; keep near your chosen target)
- **Clip ratio** should be moderate (< 0.2)
- **Entropy** should decrease gradually
- **Completions** should maintain reasonable length
