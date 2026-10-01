---
id: learning_rate
name: Learning Rate
aliases: [learning_rate, lr]
shortDescription: Step size of training.
whatToLookFor:
  - 'Usually follows a schedule, such as warmup then decay; check it matches what you configured.'
  - 'Many instabilities (loss spikes, exploding grad norm) line up with the peak of warmup — compare curves.'
  - 'There is no universally right value; it depends on the model size, optimizer and method (full fine-tune vs. LoRA).'
visualizations:
  yDomain: [0, 0.00012]
  healthy:
    linear_decay:
      label: "Linear Decay"
      data:
        - { step: 0, value: 0.0001 }
        - { step: 20, value: 0.00008 }
        - { step: 40, value: 0.00006 }
        - { step: 60, value: 0.00004 }
        - { step: 80, value: 0.00002 }
        - { step: 100, value: 0.0 }
      analysis: "Linear decay. The learning rate decreases steadily over time, allowing for fine-tuning in later stages."
    cosine:
      label: "Cosine Annealing"
      data:
        - { step: 0, value: 0.0001 }
        - { step: 20, value: 0.000095 }
        - { step: 40, value: 0.00008 }
        - { step: 60, value: 0.00005 }
        - { step: 80, value: 0.00002 }
        - { step: 100, value: 0.0 }
      analysis: "Cosine annealing. Smooth S-curve decay that slows down gradually, often leading to better final convergence."
    warmup_decay:
      label: "Warmup + Decay"
      data:
        - { step: 0, value: 0.00001 }
        - { step: 10, value: 0.00005 }
        - { step: 20, value: 0.0001 }
        - { step: 40, value: 0.00008 }
        - { step: 60, value: 0.00005 }
        - { step: 80, value: 0.00002 }
        - { step: 100, value: 0.0 }
      analysis: "Warmup + decay. Starts low to stabilize training, ramps up, then decays. Common in transformer fine-tuning."
  unhealthy:
    data:
      - { step: 0, value: 0.0001 }
      - { step: 10, value: 0.00011 }
      - { step: 20, value: 0.0001 }
      - { step: 30, value: 0.00011 }
      - { step: 40, value: 0.0001 }
      - { step: 50, value: 0.00011 }
      - { step: 60, value: 0.0001 }
      - { step: 70, value: 0.00011 }
      - { step: 80, value: 0.0001 }
      - { step: 90, value: 0.00011 }
      - { step: 100, value: 0.0001 }
    analysis: "Constant rate with no decay. The model may oscillate around the optimum and fail to converge to a good solution."
lastReviewed: '2026-10-01'
---
Controls how much to change the model in response to the estimated error each time the model weights are updated.

## How this is calculated

- **Formula:** the value set by the scheduler at this step.
- **Aggregation:** current value at the logging step.
- **Units:** unitless step size.
- **Source:** Transformers `Trainer` logs `learning_rate`.
