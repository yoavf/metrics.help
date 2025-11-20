---
id: log_odds_ratio
name: Log Odds Ratio
aliases: [log_odds_ratio, log_odds_chosen, log_odds_rejected]
shortDescription: ORPO preference strength.
whatToLookFor:
  - Should increase over time.
  - Indicates the model is distinguishing better between chosen and rejected responses.
  - "If it decreases or stays near zero, the model isn't learning the preference."
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
---
Specific to ORPO. Measures the log ratio of the likelihood of the chosen response vs the rejected response.
