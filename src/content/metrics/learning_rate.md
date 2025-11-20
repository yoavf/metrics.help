---
id: learning_rate
name: Learning Rate
aliases: [learning_rate, lr]
shortDescription: Step size of training.
whatToLookFor:
  - 'Usually follows a schedule (warmup then decay).'
  - "If it's constant, ensure it's not too high (instability) or too low (slow convergence)."
  - Should match your scheduler configuration.
visualizations:
  yDomain: [0, 0.12]
  healthy:
    data:
      - { step: 0, value: 0.001 }
      - { step: 20, value: 0.0008 }
      - { step: 40, value: 0.0006 }
      - { step: 60, value: 0.0004 }
      - { step: 80, value: 0.0002 }
      - { step: 100, value: 0.0 }
    analysis: "Linear decay. The learning rate decreases over time as planned, allowing for fine-tuning in later stages."
  unhealthy:
    data:
      - { step: 0, value: 0.1 }
      - { step: 20, value: 0.1 }
      - { step: 40, value: 0.1 }
      - { step: 60, value: 0.1 }
      - { step: 80, value: 0.1 }
      - { step: 100, value: 0.1 }
    analysis: "Constant high rate. If not intended, a constant high learning rate can prevent the model from converging."
---
Controls how much to change the model in response to the estimated error each time the model weights are updated.
