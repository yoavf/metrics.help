---
id: completions
name: Completions
aliases: ['completions', 'completions/mean_length', 'completions/min_length', 'completions/max_length', 'completions/mean_terminated_length']
shortDescription: Length of generated text.
whatToLookFor:
  - 'Should match your task: a math solution and a one-word classification have very different healthy lengths.'
  - 'A sudden drop on similar prompts can mean the model learned to give short or refusing answers — read some samples.'
  - 'A steady climb toward the length limit often means repetition loops or a missing stop token; check `completions/clipped_ratio` alongside it.'
visualizations:
  yDomain: [0, 8500]
  healthy:
    data:
      - { step: 0, value: 800 }
      - { step: 20, value: 1200 }
      - { step: 40, value: 1500 }
      - { step: 60, value: 1600 }
      - { step: 80, value: 1650 }
      - { step: 100, value: 1700 }
    analysis: "Stable length. The model is generating full responses of expected length."
  unhealthy:
    refusal:
      label: "Refusal Collapse"
      data:
        - { step: 0, value: 800 }
        - { step: 20, value: 1200 }
        - { step: 40, value: 1500 }
        - { step: 60, value: 400 }
        - { step: 80, value: 100 }
        - { step: 100, value: 50 }
      analysis: "Refusal collapse. The model has learned to output very short responses (or empty strings), likely refusing to answer."
    repetition:
      label: "Repetition Loop"
      data:
        - { step: 0, value: 800 }
        - { step: 20, value: 1200 }
        - { step: 40, value: 1800 }
        - { step: 60, value: 3500 }
        - { step: 80, value: 6000 }
        - { step: 100, value: 8000 }
      analysis: "Repetition loop. The model is stuck repeating the same phrase or token, causing the generation length to explode."
lastReviewed: '2026-10-01'
---
The average length of the generated responses (completions) during training.

## How this is calculated

- **Formula:** number of generated tokens per completion.
- **Aggregation:** mean (plus min/max) over completions in the logging window.
- **Units:** tokens.
- **Source:** TRL `GRPOTrainer` logs `completions/mean_length`, `completions/min_length`, `completions/max_length`.
