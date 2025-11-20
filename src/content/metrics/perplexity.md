---
id: perplexity
name: Perplexity
aliases: [perplexity, ppl, eval_perplexity]
shortDescription: How confused the model is.
whatToLookFor:
  - Lower is better.
  - Should decrease alongside loss.
  - 'A value of 1.0 is perfect (certainty).'
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
variations:
  trl-sft:
    description: 'Calculated as exp(loss) using subword tokens.'
    whatToLookFor:
      - Standard calculation method.
      - Directly comparable to other Hugging Face based libraries.
---
The exponent of the cross-entropy loss. Intuitively, if perplexity is 10, the model is as confused as if it were choosing uniformly from 10 possibilities.
