---
id: loss-standard
name: Loss (Standard)
parent: loss
shortDescription: Cross-entropy loss for pre-training and fine-tuning.
whatToLookFor:
  - 'Should generally decrease, quickly at first and then more slowly.'
  - 'A sudden rise or spikes often point to a learning rate that is too high or a bad batch.'
  - 'A widening gap where eval loss rises while training loss falls indicates overfitting.'
  - 'For classification, a loss stuck at ln(number of classes) (0.693 for 2, 1.099 for 3) means uniform guessing.'
visualizations:
  yDomain: [0, 5]
  healthy:
    data:
      - { step: 0, value: 2.5 }
      - { step: 10, value: 1.8 }
      - { step: 20, value: 1.2 }
      - { step: 30, value: 0.8 }
      - { step: 40, value: 0.5 }
      - { step: 50, value: 0.3 }
      - { step: 60, value: 0.25 }
      - { step: 70, value: 0.22 }
      - { step: 80, value: 0.2 }
      - { step: 90, value: 0.19 }
      - { step: 100, value: 0.18 }
    analysis: "Ideal behavior. The loss decreases rapidly at first and then stabilizes, indicating the model is learning effectively."
  unhealthy:
    divergence:
      label: "Loss Divergence"
      data:
        - { step: 0, value: 2.5 }
        - { step: 10, value: 1.8 }
        - { step: 20, value: 1.2 }
        - { step: 30, value: 0.9 }
        - { step: 40, value: 0.8 }
        - { step: 50, value: 1.0 }
        - { step: 60, value: 1.3 }
        - { step: 70, value: 1.8 }
        - { step: 80, value: 2.4 }
        - { step: 90, value: 3.1 }
        - { step: 100, value: 4.0 }
      analysis: "Divergence. The loss starts to decrease but then rises significantly. This often indicates a learning rate that is too high or training instability."
    overfitting:
      label: "Overfitting"
      data:
        - { step: 0, train: 2.5, val: 2.5 }
        - { step: 20, train: 1.5, val: 1.6 }
        - { step: 40, train: 0.8, val: 1.3 }
        - { step: 60, train: 0.4, val: 1.8 }
        - { step: 80, train: 0.15, val: 2.5 }
        - { step: 100, train: 0.05, val: 3.2 }
      analysis: "Classic overfitting. Training loss keeps dropping while validation loss increases - the model is memorizing the training data rather than learning generalizable patterns."
lastReviewed: '2026-10-01'
---
Cross-entropy loss for token prediction. Used in pre-training, supervised fine-tuning (SFT), and standard language modeling. Always positive, typically starts around 0.5-5.0 depending on initialization.

## How this is calculated

- **Formula:** mean cross-entropy, −log p(correct token or class).
- **Aggregation:** averaged over non-masked tokens (or examples) in the logging window.
- **Units:** nats.
- **Source:** Transformers `Trainer` logs `loss` and `eval_loss`.
