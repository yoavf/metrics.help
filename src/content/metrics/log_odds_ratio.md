---
id: log_odds_ratio
name: Log Odds Ratio
aliases: [log_odds_chosen]
shortDescription: ORPO preference strength.
whatToLookFor:
  - 'This chart shows `log_odds_chosen`: log odds(chosen) minus log odds(rejected). It should rise above 0 and keep growing as the model learns the preference.'
  - 'TRL also logs `log_odds_ratio`, which is a different quantity: log σ(log odds). It is always 0 or below and moves toward 0 as learning improves. Do not compare it directly with this chart.'
  - 'If log_odds_chosen stays near zero or goes negative, check the pair quality and the λ (beta) weight on the odds-ratio term.'
visualizations:
  yDomain: [-0.5, 2.5]
  healthy:
    data:
      - { step: 0, value: 0.1 }
      - { step: 20, value: 0.5 }
      - { step: 40, value: 1.0 }
      - { step: 60, value: 1.5 }
      - { step: 80, value: 1.8 }
      - { step: 100, value: 2.0 }
    analysis: "Increasing preference. The model is assigning significantly higher probability to the chosen response over the rejected one."
  unhealthy:
    data:
      - { step: 0, value: 0.1 }
      - { step: 20, value: 0.1 }
      - { step: 40, value: 0.0 }
      - { step: 60, value: -0.1 }
      - { step: 80, value: -0.2 }
      - { step: 100, value: -0.2 }
    analysis: "No preference learning. The model fails to distinguish between chosen and rejected responses, or even prefers the rejected one (negative value)."
lastReviewed: '2026-10-01'
---
Specific to ORPO. It compares the **odds** of the model producing the chosen response with the odds of it producing the rejected one. Odds = p / (1 − p), where p is the response's average per-token probability.

## How this is calculated

- **log_odds_chosen:** log(odds(chosen)) − log(odds(rejected)), averaged over the batch. Above 0 means the chosen response is favored.
- **log_odds_ratio (TRL):** log σ(log_odds_chosen). This is the term that, multiplied by λ, forms the preference part of the ORPO loss.
- **Source:** TRL `ORPOTrainer`.
