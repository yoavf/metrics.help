---
id: epoch
name: Epoch
aliases: [epoch]
shortDescription: Training progress.
whatToLookFor:
  - 'Should increase steadily; fractional values show progress through the current pass over the data.'
  - 'Use it to line up other curves: overfitting often shows up after a certain number of epochs.'
lastReviewed: '2026-10-01'
---
One full pass through the entire training dataset.

## How this is calculated

- **Formula:** steps completed / steps per epoch.
- **Aggregation:** current value at the logging step.
- **Units:** passes over the training set.
- **Source:** Transformers `Trainer` logs `epoch`.
