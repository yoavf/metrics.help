---
id: perplexity
name: Perplexity
aliases: [perplexity, ppl, eval_perplexity]
shortDescription: How confused the model is.
whatToLookFor:
  - 'Lower is better and it should fall alongside loss; it is just exp(loss).'
  - 'Only compare perplexities measured with the same tokenizer and dataset.'
  - '1.0 would mean perfect certainty; very low values on training data can mean memorization.'
visualizations:
  yDomain: [0, 100]
  healthy:
    data:
      - { step: 0, value: 100 }
      - { step: 20, value: 50 }
      - { step: 40, value: 25 }
      - { step: 60, value: 15 }
      - { step: 80, value: 12 }
      - { step: 100, value: 10.5 }
    analysis: "Decreasing confusion. As the model learns, it becomes less surprised by the data, leading to lower perplexity."
  unhealthy:
    data:
      - { step: 0, value: 100 }
      - { step: 20, value: 95 }
      - { step: 40, value: 90 }
      - { step: 60, value: 85 }
      - { step: 80, value: 80 }
      - { step: 100, value: 75 }
    analysis: "High confusion. The model is barely improving its predictions, remaining uncertain about the next tokens."
lastReviewed: '2026-10-01'
---
The exponent of the cross-entropy loss. Intuitively, if perplexity is 10, the model is as confused as if it were choosing uniformly from 10 possibilities.

## How this is calculated

- **Formula:** exp(mean cross-entropy loss).
- **Aggregation:** computed from the averaged loss, not averaged per batch.
- **Units:** unitless (effective number of choices).
- **Source:** usually computed by you from `eval_loss`.
