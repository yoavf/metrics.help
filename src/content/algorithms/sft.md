---
id: sft
name: SFT
fullName: Supervised Fine-Tuning
shortDescription: Train models to follow instructions with curated examples.
relevantMetrics: [loss, accuracy, perplexity, learning_rate, epoch, train_flos]
---

## What is SFT?

Supervised Fine-Tuning teaches a pre-trained language model to follow instructions by training it on curated examples of high-quality instruction-response pairs.

## How it works

- Takes a pre-trained model (like GPT, LLaMA, or Mistral) that already knows language
- Trains it on a dataset of instruction-response pairs (e.g., "Explain photosynthesis" → detailed explanation)
- Uses standard language modeling: predict the next token, minimize cross-entropy loss
- Result: the model learns to follow instructions and generate responses in the desired format and style

## When to use it

- **First step after pre-training**: SFT is typically the first alignment step before more complex methods
- **When you have quality data**: Works best with curated instruction-response datasets
- **Before RL methods**: Often used before DPO, PPO, or other preference-based methods
- **Task-specific adaptation**: Great for teaching domain-specific knowledge or formatting

## Common pitfalls

- **Overfitting on small datasets**: With limited data, models memorize rather than generalize. Solution: use data augmentation, early stopping, or larger datasets.
- **Format collapse**: Model learns surface patterns (like always starting with "Sure!") without real understanding. Solution: ensure dataset diversity.
- **Distribution mismatch**: Training data doesn't match your actual use case. Solution: carefully curate data that reflects real usage.
- **Catastrophic forgetting**: Over-training can make the model forget its pre-trained knowledge. Solution: monitor validation loss and stop early.

## What to watch

During SFT training, monitor these metrics closely:
- **Loss** should decrease steadily and plateau
- **Perplexity** should drop as the model becomes more confident
- **Validation vs training loss** should stay close (divergence = overfitting)
