---
id: rewards-kto
name: Rewards (KTO)
parent: rewards
shortDescription: Implicit rewards from KTO loss.
whatToLookFor:
  - '`rewards/chosen` (desirable examples) should rise and `rewards/rejected` (undesirable) should fall.'
  - 'These are implicit rewards relative to the reference model, not scores from a reward model.'
  - 'If both move down together, the model may be lowering probability of all outputs — read samples.'
lastReviewed: '2026-10-01'
---
Implicit rewards derived from the KTO loss.

## How this is calculated

- **Formula:** β · (log π(y) − log π_ref(y)) for each example.
- **Aggregation:** mean over desirable and undesirable examples separately.
- **Source:** TRL `KTOTrainer` logs `rewards/chosen`, `rewards/rejected`.
