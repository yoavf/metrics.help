---
id: completions
name: Completions
aliases: [completions, completions/mean_length, eval_num_tokens, num_tokens]
shortDescription: Length of generated text.
whatToLookFor:
  - Should align with your task's expected response length.
  - 'Sudden unexpected drop (given similar prompts) can indicate refusal behavior.'
  - 'Sudden explosion can indicate repetition loops or ignored stop signals.'
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
---
The average length of the generated responses (completions) during training.
