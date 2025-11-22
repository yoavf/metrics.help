---
id: dpo
name: DPO
fullName: Direct Preference Optimization
shortDescription: Align models with preferences without reward models.
relevantMetrics: [loss, rewards, accuracy, learning_rate, epoch]
---

## What is DPO?

Direct Preference Optimization aligns language models with human preferences by directly optimizing the model to prefer "chosen" responses over "rejected" ones, without needing a separate reward model.

## How it works

- Takes pairs of responses: one preferred (chosen) and one not preferred (rejected)
- Uses the Bradley-Terry preference model to compute a loss
- Directly updates the policy to increase probability of chosen responses and decrease probability of rejected ones
- Uses a reference model (usually the SFT checkpoint) to prevent the policy from drifting too far
- No need for a separate reward model or complex RL training loop (unlike PPO)

## When to use it

- **After SFT**: DPO typically follows supervised fine-tuning to add preference alignment
- **When you have preference data**: Requires pairs of (prompt, chosen, rejected) examples
- **Simpler than PPO**: More stable and easier to implement than full reinforcement learning
- **Alignment without RL**: Great for aligning models when you want to avoid the complexity of PPO

## Common pitfalls

- **Loss stuck at 0.693**: This is log(2), meaning the model can't distinguish between chosen and rejected responses. Solutions: check data quality, verify chosen responses are actually better, increase learning rate.
- **Overfitting to preferences**: Model becomes too conservative or loses diversity. Solution: use a smaller number of epochs, monitor KL divergence from reference.
- **Poor reference model**: If the reference (SFT) model is weak, DPO has little to work with. Solution: ensure strong SFT baseline first.
- **Imbalanced preference strength**: Some pairs have obvious preferences, others are subtle. Solution: consider filtering low-quality pairs or using confidence scores.

## What to watch

During DPO training, monitor:
- **Loss** should drop below 0.693 (random guessing) and continue decreasing
- **Accuracy** (preference accuracy) should increase, ideally above 60-70%
- **KL divergence** from reference should stay moderate (not explode)
