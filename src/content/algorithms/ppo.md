---
id: ppo
name: PPO
fullName: Proximal Policy Optimization
relevantMetrics: [rewards, kl, entropy, clip_ratio, loss, learning_rate, completions]
shortDescription: Proximal Policy Optimization is the classic reinforcement learning algorithm used for RLHF. It optimizes the policy to maximize reward while staying close to the reference model.
---

## What is PPO?

Proximal Policy Optimization is the classic reinforcement learning algorithm used for RLHF (Reinforcement Learning from Human Feedback). It uses a separate reward model to score outputs and optimize the policy to maximize reward.

## How it works

- Starts with an SFT model and trains a separate **reward model** (critic) on human preference data
- Generates completions from the current policy and scores them with the reward model
- Updates the policy to increase reward while staying close to a reference model (using KL penalty)
- Uses **clipping** to prevent too-large policy updates, ensuring stable training
- Alternates between collecting rollouts (generations) and updating the policy

## When to use it

- **Classic RLHF**: The tried-and-true method, used to train models like ChatGPT and Claude
- **When you have a reward model**: Requires training or having access to a quality reward/preference model
- **Complex reward functions**: Works well when rewards are nuanced or come from human feedback
- **Maximum control**: Offers fine-grained control over exploration vs. exploitation via entropy bonuses

## Common pitfalls

- **Reward hacking**: The model exploits the reward model to get high scores without actually being helpful. Solution: use KL penalties, diverse training data, and robust reward models.
- **KL explosion**: Policy diverges too far from reference, leading to nonsense outputs. Solution: increase KL penalty coefficient (beta), reduce learning rate.
- **Mode collapse**: Model converges to repetitive or overly conservative outputs. Solution: maintain entropy bonus, ensure diverse prompts.
- **High clip ratio**: Too many updates are being clipped, indicating instability. Solution: reduce learning rate or increase PPO epsilon.
- **Reward model quality**: Garbage in, garbage out. A poor reward model will train a poor policy. Solution: invest time in reward model training and validation.

## What to watch

During PPO training, monitor:
- **Rewards** should increase steadily without going to unrealistic values (reward hacking)
- **KL divergence** should stay in a controlled range (avoid sharp spikes; keep it near your chosen target)
- **Entropy** should decrease slowly, not collapse to zero
- **Clip ratio** should be relatively small (< 0.2)
- **Completions** length should stay stable (watch for refusal or repetition collapse)
