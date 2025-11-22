---
id: orpo
name: ORPO
fullName: Odds Ratio Preference Optimization
shortDescription: Combines SFT and preference alignment in one stage.
relevantMetrics: [loss, log_odds_ratio, accuracy, learning_rate, epoch]
---

## What is ORPO?

Odds Ratio Preference Optimization is a reference-free method that combines supervised fine-tuning and preference alignment in a single training stage. It simultaneously teaches the model the response format AND which responses are preferred.

## How it works

- Takes preference pairs: (prompt, chosen response, rejected response)
- Combines two losses:
  - **SFT loss**: standard next-token prediction on chosen responses (learn the format)
  - **Odds Ratio loss**: penalizes giving high probability to rejected responses (learn preferences)
- No reference model needed (unlike DPO) - directly penalizes bad outputs
- Single training stage (unlike SFT → DPO pipeline)

## When to use it

- **Simplified pipeline**: Combines SFT and alignment in one step, saving time and compute
- **No reference model**: Doesn't require keeping a frozen reference model in memory
- **Strong preference data**: Works best when you have clear chosen/rejected pairs
- **Limited resources**: Fewer training stages means faster iteration

## Common pitfalls

- **Over-penalization**: If the odds ratio penalty is too strong, the model becomes overly conservative. Solution: tune the penalty coefficient (lambda/alpha).
- **Catastrophic forgetting**: Without a reference model, the policy can drift too far from sensible outputs. Solution: monitor loss carefully, use moderate penalty coefficients.
- **Format not learned first**: If preference data has poor chosen examples, the model might not learn basic formatting. Solution: ensure chosen responses are high quality and well-formatted.
- **Log odds not increasing**: If log_odds_ratio stays near zero or decreases, the model isn't learning preferences. Solution: check data quality, increase learning rate, or adjust penalty weight.
- **Loss increasing**: If total loss rises, the preference penalty may be fighting against the SFT objective. Solution: reduce penalty coefficient.

## What to watch

During ORPO training, monitor:
- **Total loss** should decrease steadily (combines SFT + OR loss)
- **Log odds ratio** should increase over time (chosen >> rejected in probability)
- **Accuracy** on preferences should improve
- **Perplexity** on chosen responses should decrease
