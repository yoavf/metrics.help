---
id: clipped_ratio
name: Truncated Completions
aliases: [completions/clipped_ratio, clipped_ratio]
shortDescription: Cut-off completions.
whatToLookFor:
  - 'A rising value means more completions are being cut off at `max_completion_length` before they finish.'
  - 'Check whether the task genuinely needs longer outputs (raise the limit) or the model is failing to emit the end-of-sequence token (look at samples for repetition).'
  - 'Truncated completions can still receive rewards, so a high value can quietly distort the training signal.'
visualizations:
  yDomain: [0, 1]
  healthy:
    data:
      - { step: 0, value: 0.1 }
      - { step: 100, value: 0.05 }
    analysis: "Low truncation. Most generations fit within the context window."
  unhealthy:
    data:
      - { step: 0, value: 0.8 }
      - { step: 100, value: 0.9 }
    analysis: "High truncation. Most generations are being cut off, meaning the model wants to write more than the limit allows."
lastReviewed: '2026-10-01'
---
The fraction of generated completions that were cut off because they hit the maximum length limit.

**Note:** Don't confuse this with `clip_ratio`, which measures PPO/GRPO policy update clipping (an RL optimization detail). This metric is about text generation being truncated.

## How this is calculated

- **Formula:** completions that hit the length limit without an EOS token / total completions.
- **Aggregation:** over all completions generated in the logging window.
- **Units:** fraction 0–1.
- **Source:** TRL `GRPOTrainer` logs `completions/clipped_ratio`.
