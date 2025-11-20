---
id: recall
name: Recall
aliases: [recall, rec, eval_recall, train_recall, val_recall]
shortDescription: Quantity of positives found.
whatToLookFor:
  - 'Important when false negatives are costly (e.g., cancer detection).'
  - Often trades off with Precision.
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
      - { step: 60, value: 0.89 }
      - { step: 70, value: 0.92 }
      - { step: 80, value: 0.93 }
      - { step: 90, value: 0.94 }
      - { step: 100, value: 0.94 }
    analysis: "High recall. The model is successfully finding most of the relevant positive cases."
  unhealthy:
    data:
      - { step: 0, value: 0.1 }
      - { step: 10, value: 0.2 }
      - { step: 20, value: 0.25 }
      - { step: 30, value: 0.3 }
      - { step: 40, value: 0.32 }
      - { step: 50, value: 0.35 }
      - { step: 60, value: 0.33 }
      - { step: 70, value: 0.34 }
      - { step: 80, value: 0.35 }
      - { step: 90, value: 0.36 }
      - { step: 100, value: 0.35 }
    analysis: "Low recall. The model is missing a significant number of positive examples."
---
Out of all the actual positive examples, how many did the model identify?
