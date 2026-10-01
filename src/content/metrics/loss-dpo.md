---
id: loss-dpo
name: Loss (DPO)
parent: loss
shortDescription: Sigmoid preference loss on chosen vs. rejected pairs.
whatToLookFor:
  - 'With the default sigmoid loss it starts near 0.693 (ln 2) because the policy begins equal to the reference. A move downward means the model is starting to prefer chosen over rejected.'
  - 'If it stays at about 0.693, check that the reference model and data are correct and that the learning rate is not too low.'
  - 'Very low training loss is not automatically good. Compare it with eval loss and rewards/margins, and read samples. DPO can push down the probability of both responses.'
  - 'Other loss types (`ipo`, `hinge`, `robust` and others) have different scales, so the 0.693 rule only applies to the sigmoid loss.'
---
DPO trains directly on preference pairs. The loss is small when the model raises the chosen response's probability, **relative to the reference model**, more than it raises the rejected one's.

## How this is calculated

- **Formula (sigmoid):** −log σ(β · [(log π(chosen) − log π_ref(chosen)) − (log π(rejected) − log π_ref(rejected))]).
- **Range:** always ≥ 0. Values above 0.693 mean the model currently prefers the rejected response.
- **Aggregation:** mean over pairs in the batch.
- **Source:** TRL `DPOTrainer` `loss` (see also `rewards/margins`, `rewards/accuracies`).
