---
id: grad_norm
name: Gradient Norm
aliases: [grad_norm, gradient_norm, total_grad_norm]
shortDescription: Magnitude of model updates.
whatToLookFor:
  - 'Should be stable (not too high, not too low).'
  - Spikes indicate instability or bad data batches.
  - 'Exploding (going to infinity) means you need gradient clipping.'
  - 'Vanishing (going to zero) means the model stopped learning.'
visualizations:
  yDomain: [0, 50]
  healthy:
    data:
      - { step: 0, value: 5.0 }
      - { step: 10, value: 4.2 }
      - { step: 20, value: 3.8 }
      - { step: 30, value: 4.5 }
      - { step: 40, value: 3.2 }
      - { step: 50, value: 3.6 }
      - { step: 60, value: 2.8 }
      - { step: 70, value: 3.1 }
      - { step: 80, value: 2.5 }
      - { step: 90, value: 2.2 }
      - { step: 100, value: 2.0 }
    analysis: "Stable updates. The gradient norm stays in a reasonable range (1-5) with natural variation, indicating controlled learning."
  unhealthy:
    data:
      - { step: 0, value: 1.5 }
      - { step: 10, value: 1.4 }
      - { step: 20, value: 5.0 }
      - { step: 30, value: 1.2 }
      - { step: 40, value: 10.0 }
      - { step: 50, value: 1.0 }
      - { step: 60, value: 1.3 }
      - { step: 70, value: 20.0 }
      - { step: 80, value: 2.4 }
      - { step: 90, value: 3.1 }
      - { step: 100, value: 50.0 }
    analysis: "Exploding gradients. The massive spikes suggest the model updates are too large, likely leading to instability. Gradient clipping is needed."
---
Measures the size of the gradient updates. It indicates how much the model weights are changing at each step.
