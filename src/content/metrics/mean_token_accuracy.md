---
id: mean_token_accuracy
name: Token Accuracy
aliases: [mean_token_accuracy, eval_mean_token_accuracy, train_mean_token_accuracy]
shortDescription: Share of next tokens the model predicts exactly right.
whatToLookFor:
  - 'In SFT it usually rises alongside falling loss. It levels off well below 100% because many next tokens have more than one valid choice.'
  - 'A large gap where train accuracy keeps rising but eval accuracy stalls or falls suggests overfitting.'
  - 'It only shows the single top guess, so loss and perplexity are better at catching gradual changes in confidence.'
lastReviewed: '2026-10-01'
---
For every position the model is trained on, did its single most likely next token match the real one? Token accuracy is the fraction of positions where it did.

## How this is calculated

- **Formula:** (# tokens where argmax prediction = label) / (# non-masked label tokens).
- **Aggregation:** over tokens in the logging window. Padding and masked prompt tokens are excluded.
- **Units:** fraction from 0 to 1.
- **Source:** TRL `SFTTrainer` logs `mean_token_accuracy`.
