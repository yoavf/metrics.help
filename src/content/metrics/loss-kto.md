---
id: loss-kto
name: Loss (KTO)
parent: loss
shortDescription: Kahneman-Tversky optimization loss.
whatToLookFor:
  - 'Usually decreases, but the scale depends on the desirable/undesirable weights and β.'
  - 'Compare with `rewards/chosen` and `rewards/rejected` and the KL estimate to see whether both kinds of examples are being learned.'
  - 'KTO uses single examples labelled good or bad instead of pairs.'
lastReviewed: '2026-10-01'
---
Kahneman-Tversky loss. Based on binary feedback (good/bad).

## How this is calculated

- **Formula:** for desirable examples 1 − σ(β·(r − z)), for undesirable ones 1 − σ(β·(z − r)), with r the log ratio vs. the reference and z a KL baseline; each part is weighted.
- **Aggregation:** mean over examples in the batch.
- **Source:** TRL `KTOTrainer` `loss`.
