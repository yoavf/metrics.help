---
id: clipped_ratio
name: Clipped Ratio
aliases: [completions/clipped_ratio, clipped_ratio]
shortDescription: Cut-off completions.
whatToLookFor:
  - High values mean your max_length is too short.
  - 'Or the model is struggling to learn when to stop (EOS token).'
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
---
The fraction of generated completions that were cut off because they hit the maximum length limit.

**Note:** Don't confuse this with `clip_ratio`, which measures PPO/GRPO policy update clipping (an RL optimization detail). This metric is about text generation being truncated.
