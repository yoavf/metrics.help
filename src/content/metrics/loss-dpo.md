---
id: loss-dpo
name: Loss (DPO)
parent: loss
shortDescription: Bradley-Terry preference ranking loss.
whatToLookFor:
  - Must decrease below 0.693 to show learning.
  - If it stays at 0.693, the model cannot distinguish between chosen and rejected responses.
  - 'Lower is better, but extremely low values (<0.1) might indicate overfitting to the preference dataset.'
---
Bradley-Terry preference ranking loss. Always positive, starts at 0.693 (log(2)). Can exceed 1.0 when the model ranks rejected responses too highly.
