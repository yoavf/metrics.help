---
id: loss-standard
name: Loss (Standard)
parent: loss
shortDescription: Cross-entropy loss for pre-training and fine-tuning.
whatToLookFor:
  - Should decrease over time.
  - If it goes up, your learning rate might be too high.
  - If it flattens out too early, you might be stuck in a local minimum.
  - Validation loss diverging from training loss indicates overfitting.
  - 'Stuck at 0.693 for binary classification? Model is predicting randomly (log(2)).'
  - 'Stuck at 1.098 for 3-class classification? Model is predicting uniformly (log(3)).'
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
---
Cross-entropy loss for token prediction. Used in pre-training, supervised fine-tuning (SFT), and standard language modeling. Always positive, typically starts around 0.5-5.0 depending on initialization.
