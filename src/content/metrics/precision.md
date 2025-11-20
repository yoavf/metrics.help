---
id: precision
name: Precision
aliases: [precision, prec, eval_precision, train_precision, val_precision]
shortDescription: Quality of positive predictions.
whatToLookFor:
  - 'Important when false positives are costly (e.g., spam filter).'
  - Often trades off with Recall.
visualizations:
  yDomain: [0, 1]
  healthy:
    data:
      - { step: 0, value: 0.2 }
      - { step: 10, value: 0.4 }
      - { step: 20, value: 0.6 }
      - { step: 30, value: 0.75 }
      - { step: 40, value: 0.82 }
      - { step: 50, value: 0.88 }
      - { step: 60, value: 0.91 }
      - { step: 70, value: 0.93 }
      - { step: 80, value: 0.94 }
      - { step: 90, value: 0.95 }
      - { step: 100, value: 0.95 }
    analysis: "High precision. The model is becoming very selective and accurate in its positive predictions."
  unhealthy:
    data:
      - { step: 0, value: 0.2 }
      - { step: 10, value: 0.3 }
      - { step: 20, value: 0.35 }
      - { step: 30, value: 0.4 }
      - { step: 40, value: 0.42 }
      - { step: 50, value: 0.45 }
      - { step: 60, value: 0.43 }
      - { step: 70, value: 0.46 }
      - { step: 80, value: 0.44 }
      - { step: 90, value: 0.45 }
      - { step: 100, value: 0.45 }
    analysis: "Low precision. The model is making too many false positive errors, failing to distinguish true positives."
---
Out of all the examples the model predicted as positive, how many were actually positive?
