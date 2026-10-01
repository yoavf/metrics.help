---
id: loss-orpo
name: Loss (ORPO)
parent: loss
shortDescription: Combined SFT and odds ratio loss.
whatToLookFor:
  - 'Total loss usually decreases; it combines an SFT term and a weighted odds-ratio term.'
  - 'Look at the parts separately (`nll_loss` and `log_odds_ratio`) to see which one is moving.'
  - 'If total loss rises while the SFT part worsens, the odds-ratio weight (λ, `beta` in TRL) may be too strong.'
lastReviewed: '2026-10-01'
---
Combined loss: SFT Loss + Odds Ratio Loss.

## How this is calculated

- **Formula:** NLL(chosen) − λ · log σ(log odds(chosen) − log odds(rejected)).
- **Aggregation:** mean over preference pairs.
- **Source:** TRL `ORPOTrainer` `loss` (with `nll_loss`, `log_odds_ratio`).
