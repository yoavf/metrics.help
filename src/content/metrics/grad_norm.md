---
id: grad_norm
name: Gradient Norm
aliases: [grad_norm, gradient_norm, total_grad_norm]
shortDescription: Magnitude of model updates.
whatToLookFor:
  - 'There is no universal healthy value; watch for changes relative to earlier in the same run.'
  - 'Isolated spikes often come from unusual batches; frequent or growing spikes suggest instability (try a lower learning rate).'
  - 'A value that keeps growing toward very large numbers or NaN means training is diverging. Note that `max_grad_norm` clips the update, but the logged value is usually measured before clipping.'
  - 'A value shrinking toward zero while loss is flat can mean learning has stalled.'
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
lastReviewed: '2026-10-01'
---
Measures the size of the gradient updates. It indicates how much the model weights are changing at each step.

## How this is calculated

- **Formula:** √(Σ g²) over all trainable parameters' gradients (L2 norm).
- **Aggregation:** per optimizer step, before gradient clipping.
- **Units:** unitless.
- **Source:** Transformers `Trainer` logs `grad_norm`.
