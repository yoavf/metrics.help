---
id: kto
name: KTO
fullName: Kahneman-Tversky Optimization
shortDescription: Alignment using binary feedback (good/bad) instead of pairs.
relevantMetrics: [loss, rewards, kl, accuracy, learning_rate]
---

## What is KTO?

Kahneman-Tversky Optimization is an alignment method that uses simple binary feedback (thumbs up/down, good/bad) instead of requiring preference pairs. It's based on prospect theory from behavioral economics, which models how humans perceive gains and losses asymmetrically.

## How it works

- Takes examples with binary labels: (prompt, response, label) where label is "good" or "bad"
- No need for paired comparisons - each response is judged independently
- Uses prospect theory to model utility:
  - **Desirable outputs** (good): maximize their probability
  - **Undesirable outputs** (bad): minimize their probability, weighted more heavily (loss aversion)
- Includes a KL penalty to stay close to a reference model
- Asymmetric weighting reflects human loss aversion (bad outputs hurt more than good outputs help)

## When to use it

- **Binary feedback available**: When you have thumbs up/down, good/bad labels but not direct preference pairs
- **Easier data collection**: Binary labels are simpler to collect than pairwise comparisons
- **Imbalanced feedback**: Works well even when you have more "bad" examples than "good" (or vice versa)
- **After SFT**: Like DPO, typically applied after supervised fine-tuning

## Common pitfalls

- **Imbalanced data**: Too many "good" or too many "bad" examples can skew learning. Solution: monitor the ratio, aim for reasonable balance or use weighting.
- **Ambiguous labels**: If labelers can't agree on good/bad, the signal is noisy. Solution: use clear labeling guidelines, measure annotator agreement.
- **Loss not decreasing**: Model isn't learning from the binary feedback. Solution: check label quality, adjust learning rate, verify reference model quality.
- **KL explosion**: Like DPO, the policy can drift too far from the reference. Solution: increase KL penalty coefficient (beta).
- **Conflicting signals**: Same response type labeled both good and bad confuses the model. Solution: improve data consistency, filter contradictory examples.

## What to watch

During KTO training, monitor:
- **Loss** should decrease steadily
- **KL divergence** should stay controlled (not explode)
- **Implicit rewards** should increase for "good" examples, decrease for "bad"
- **Accuracy** on held-out binary labels should improve
- Check separate metrics for "good" vs "bad" examples to ensure both are learning
