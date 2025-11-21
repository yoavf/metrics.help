---
id: accuracy
name: Accuracy
aliases: [accuracy, acc, eval_accuracy, train_accuracy, val_accuracy, eval_mean_token_accuracy]
shortDescription: Percentage of correct predictions.
whatToLookFor:
  - Should increase over time.
  - 'If it stays at 50% (for binary classification), the model is guessing.'
  - High training accuracy but low validation accuracy means overfitting.
visualizations:
  yDomain: [0, 1]
  healthy:
    data:
      - { step: 0, value: 0.1 }
      - { step: 10, value: 0.3 }
      - { step: 20, value: 0.5 }
      - { step: 30, value: 0.7 }
      - { step: 40, value: 0.8 }
      - { step: 50, value: 0.85 }
      - { step: 60, value: 0.88 }
      - { step: 70, value: 0.9 }
      - { step: 80, value: 0.91 }
      - { step: 90, value: 0.92 }
      - { step: 100, value: 0.92 }
    analysis: "Strong learning. Accuracy climbs steadily and plateaus at a high value."
  unhealthy:
    random:
      label: "Random Guessing"
      data:
        - { step: 0, value: 0.5 }
        - { step: 10, value: 0.48 }
        - { step: 20, value: 0.52 }
        - { step: 30, value: 0.5 }
        - { step: 40, value: 0.49 }
        - { step: 50, value: 0.51 }
        - { step: 60, value: 0.5 }
        - { step: 70, value: 0.5 }
        - { step: 80, value: 0.5 }
        - { step: 90, value: 0.5 }
        - { step: 100, value: 0.5 }
      analysis: "Random guessing. For binary classification, staying near 0.5 means the model isn't learning anything better than a coin flip."
    instability:
      label: "Overfitting/Instability"
      data:
        - { step: 0, value: 0.15 }
        - { step: 10, value: 0.35 }
        - { step: 20, value: 0.55 }
        - { step: 30, value: 0.72 }
        - { step: 40, value: 0.85 }
        - { step: 50, value: 0.78 }
        - { step: 60, value: 0.88 }
        - { step: 70, value: 0.65 }
        - { step: 80, value: 0.82 }
        - { step: 90, value: 0.58 }
        - { step: 100, value: 0.71 }
      analysis: "Instability. Accuracy improves initially but then fluctuates wildly. This often indicates overfitting, a learning rate that's too high, or noisy gradients. Consider lowering the learning rate or adding regularization."
---
The fraction of predictions our model got right. Useful for balanced datasets.
