# TRL Metrics Cross-Library Comparison: Critical Differences You Need To Know

**CRITICAL WARNING**: The same metric names mean fundamentally different things across LLM training libraries. This document expands on the TRL metrics guide to show how metrics differ across Axolotl, LLaMA-Factory, DeepSpeed, Megatron-LM, and OpenRLHF.

## Executive Summary: The Most Dangerous Differences

### 1. "Loss" means four completely different things

**TRL SFTTrainer loss** = Cross-entropy for token prediction (always positive, typically 0.5-5.0)
**TRL DPOTrainer loss** = Bradley-Terry preference ranking loss (always positive, 0-1.0, starts at 0.693)
**TRL PPOTrainer loss/policy_avg** = Negative clipped surrogate objective (typically negative, -10 to 0)
**Axolotl/LLaMA-Factory loss** = Same as TRL (they wrap TRL/transformers)
**DeepSpeed loss** = Depends on the trainer being used, BUT loss scaling behavior differs
**Megatron-LM loss** = Cross-entropy but computed differently with pipeline parallelism
**OpenRLHF PPO loss** = Similar to TRL PPO but with different clipping behavior

**Why this matters**: If you see "loss stuck at 0.693" in DPO it means random performance. In SFT it would mean decent performance. In PPO it would be impossibly high (should be negative).

### 2. "grad_norm" behavior diverges dramatically with DeepSpeed

**Standard PyTorch/TRL** = Computed after gradient accumulation, before clipping
**DeepSpeed** = Computed internally with different timing and scaling behavior
**With DeepSpeed ZeRO-2/3** = Gradients not directly accessible, grad_norm computed differently
**Megatron-LM** = Computed across pipeline parallel stages differently

**Critical issue**: DeepSpeed grad_norm **cannot be directly compared** to non-DeepSpeed runs. DeepSpeed versions 0.13.5+ had a bug where grad_norm could become NaN while training was actually fine. When using DeepSpeed, you may see grad_norm=1.414 which doesn't mean anything is wrong - it's an artifact of DeepSpeed's internal computation.

**Example failure case**: User reports "grad_norm is NaN and loss is 0" when using DeepSpeed 0.14.0. Downgrading to 0.12.3 fixes it. This is a DeepSpeed-specific issue, not a model training issue.

### 3. Gradient accumulation changes loss scaling

**TRL/Transformers default** = Loss is NOT scaled by gradient_accumulation_steps
**DeepSpeed** = Loss IS automatically scaled by gradient_accumulation_steps internally
**Axolotl** = Follows transformers behavior (no automatic scaling)
**LLaMA-Factory** = Follows transformers behavior (no automatic scaling)

**Why this matters**: If you switch from pure PyTorch to DeepSpeed and keep the same learning rate, your effective learning rate just changed. The loss values you see during training will also differ by a factor of gradient_accumulation_steps.

**Example**: With gradient_accumulation_steps=4, loss=2.0 without DeepSpeed equals loss=0.5 with DeepSpeed for the same training state.

### 4. "Perplexity" calculation inconsistencies

**TRL** = Not logged automatically, user must compute as exp(loss)
**LLaMA-Factory** = Can be computed via custom metrics
**Megatron-LM** = Computes perplexity normalized by **original word-level tokens**, not subword tokens
**Standard practice** = Most libraries compute perplexity from **subword token count**

**Why this matters**: A Megatron-LM perplexity of 10.81 is NOT directly comparable to a TRL perplexity of 10.81 because the denominators differ. Megatron normalizes by fewer tokens (words vs subwords), making its perplexity appear better.

## Library-by-Library Detailed Comparison

### Axolotl (Wrapper around TRL/Transformers)

**Architecture**: Axolotl is a configuration-first wrapper around Hugging Face TRL and Transformers. It does NOT implement its own training logic.

**Metrics behavior**: 
- All metrics are **identical to TRL** because Axolotl uses TRL trainers under the hood
- Uses Weights & Biases and TensorBoard for logging (same as TRL)
- Configuration via YAML makes it easy to enable/disable metric logging

**Key differences from base TRL**:
- No metric differences - just easier configuration
- Adds plugins for custom integrations (knowledge distillation, spectrum training, etc.)
- Custom metrics can be added via `compute_metrics` callback

**When Axolotl metrics differ**: Only when using plugins like:
- **KD (Knowledge Distillation) Plugin**: Adds `kd_loss`, `kd_ce_loss` metrics
- **Diffusion Plugin**: Adds diffusion-specific training metrics
- **Spectrum Plugin**: Adds signal-to-noise ratio metrics for targeted layer training

**Compatibility**: Since Axolotl wraps TRL, all TRL metric interpretations apply directly.

### LLaMA-Factory (Wrapper around TRL/Transformers)

**Architecture**: Similar to Axolotl - wraps Hugging Face ecosystem with a WebUI (LLaMA Board) and CLI.

**Metrics behavior**:
- Core metrics **identical to TRL** (uses SFTTrainer, DPOTrainer, etc.)
- Provides **training_loss**, **validation_loss**, **training_token_accuracy**, **validation_token_accuracy**
- Additional metrics: **eval_loss**, **eval_accuracy** computed on full validation split at epoch end

**Key features**:
- **Custom metrics framework**: Allows adding metrics via `sft/metric.py`
- **LLaMA Board**: Visual dashboard showing metric trends
- Supports **compute_accuracy** flag for token-level accuracy tracking

**Unique behaviors**:
- Loss value of 1.0986 is commonly reported as "stuck" - this is log(3) ≈ 1.0986, suggesting the model is predicting uniformly over 3 classes or experiencing numerical issues
- Validation metrics computed in TWO ways:
  1. Per-step on small batch (frequent, noisy)
  2. Per-epoch on full validation set (infrequent, authoritative)

**Compatibility**: 100% compatible with TRL metric interpretations.

### DeepSpeed (Optimizer/Parallelism Framework)

**Architecture**: NOT a trainer library - it's an optimization framework that Trainer libraries integrate with.

**Critical differences in metric behavior**:

#### Loss Scaling
```python
# Without DeepSpeed
loss = model(input)
loss.backward()  # Loss is NOT scaled

# With DeepSpeed  
loss = model(input)
engine.backward(loss)  # Loss IS scaled by 1/gradient_accumulation_steps internally
```

**Impact**: When comparing training runs, loss values differ by a factor of gradient_accumulation_steps between DeepSpeed and non-DeepSpeed runs. Always divide DeepSpeed loss by gradient_accumulation_steps for fair comparison.

#### Gradient Norm Issues

**Known bugs/issues**:
1. **DeepSpeed 0.13.5 - 0.14.0 NaN grad_norm bug**: grad_norm becomes NaN at step 2 even when training is fine
   - **Fix**: Downgrade to 0.10.2 or 0.12.3, OR add specific config flags
   - **Workaround**: Add `"gradient_clipping": "auto"` to deepspeed config

2. **max_grad_norm ignored in FP16** (older versions): Setting max_grad_norm in JSON config had no effect
   - **Fix**: Use newer DeepSpeed versions

3. **Gradient access blocked**: With ZeRO-2/3, `param.grad` is None for all parameters
   - **Reason**: Gradients are partitioned across GPUs
   - **Impact**: Cannot compute custom per-layer gradient norms
   - **Workaround**: DeepSpeed computes global grad_norm internally, trust that value

#### Loss Behavior with Pipeline Parallelism

When using pipeline parallelism:
- Loss is only available on the **last pipeline stage** (last rank)
- Other ranks return None for loss
- `accelerator.is_main_process` returns True for last rank (unusual!)
- Logging must account for this

#### Mixed Precision Loss Scaling

DeepSpeed handles loss scaling internally for FP16/BF16:
- Dynamic loss scaling is automatic
- Loss scale value is logged separately as `loss_scale` metric
- If loss_scale drops rapidly, you have gradient overflow issues

**Key takeaways for DeepSpeed**:
- grad_norm values are **not comparable** to non-DeepSpeed runs
- loss values are **scaled differently** (by gradient_accumulation_steps)
- NaN grad_norm doesn't always mean training failure - check DeepSpeed version
- Always check DeepSpeed-specific logs: `loss_scale`, `skipped_steps`

### Megatron-LM (NVIDIA's Large-Scale Training Framework)

**Architecture**: Built from scratch for extreme-scale training with tensor, pipeline, and data parallelism.

**Fundamentally different metrics approach**:

#### Loss Computation
- Model forward pass returns **ONLY loss**, not logits (unlike transformers)
- Loss is averaged across data parallel ranks automatically
- With pipeline parallelism, loss only available in final pipeline stage
- To get logits (for metrics), must explicitly request: uses special flag and gathering

#### Perplexity Calculation (CRITICAL DIFFERENCE)

```python
# Standard (TRL, PyTorch)
perplexity = exp(mean(cross_entropy_per_subword_token))
# Example: 1000 subword tokens in test set

# Megatron-LM  
perplexity = exp(mean(cross_entropy_per_ORIGINAL_WORD_token))
# Example: 850 original word tokens (before subword tokenization)
```

**Impact**: Megatron-LM perplexity appears **artificially better** than other libraries because it normalizes by fewer tokens. A Megatron perplexity of 10.81 does NOT equal a TRL perplexity of 10.81.

**How to compare fairly**: 
1. Don't compare perplexity values directly between Megatron and other libraries
2. Use the same evaluation protocol if comparing
3. Report both perplexity calculation methods if using Megatron

#### Training Stability Metrics

Megatron logs additional stability metrics:
- **MFU (Model FLOPs Utilization)**: Percentage of theoretical peak FLOPs achieved
  - Good: >40-50%
  - Excellent: >60%
  - Typical for large models: 30-47%
- **Throughput**: Samples/sec, tokens/sec
- **Gradient norm**: Computed across all parallel dimensions

**Deterministic mode**: Megatron supports `--deterministic-mode` for bitwise reproducible training:
- Same config = identical losses, checkpoints, metrics
- BUT: Flash attention breaks determinism (don't use with deterministic mode)
- NCCL algorithm choice affects reproducibility

#### Loss Patterns

Megatron-specific issues:
- **Validation loss < training loss** by ~0.2 is normal (Issue #32) - likely due to dropout
- **Perplexity too high** (e.g., 292) usually means: Wrong tokenization, model not converged, or eval script issues (Issue #6)
- **Abnormal gradient norm + loss with MoE**: Can happen with Mixture of Experts, may need different learning rate or load balancing

### OpenRLHF (Ray-based RLHF Framework)

**Architecture**: Built on Ray for distributed scheduling, uses vLLM for generation, DeepSpeed ZeRO-3 for training.

**Metrics behavior**: Similar to TRL but with important differences in implementation.

#### PPO Metrics (Similar to TRL but not identical)

**Shared metrics with TRL**:
- `objective/rlhf_reward`: Ultimate RLHF objective (should increase)
- `objective/scores`: Raw reward model scores
- `objective/kl`: KL divergence between policy and reference
- `objective/entropy`: Policy entropy
- `loss/policy_avg`: Policy loss
- `val/ratio`: Policy update magnitude

**OpenRLHF-specific behaviors**:

1. **vLLM integration changes generation metrics**:
   - Generation is 80% of PPO time (OpenRLHF optimizes this heavily)
   - Rollout throughput metrics are library-specific
   - Generation uses different engine than training (vLLM vs DeepSpeed)

2. **Reward and return curves**:
   - OpenRLHF documentation emphasizes reward should "rise steadily"
   - KL and loss should "remain stable" (not necessarily decrease)
   - This differs from TRL where we want loss to decrease

3. **Implementation tricks**:
   - OpenRLHF uses "advanced PPO tricks" for stability
   - These affect metric behavior subtly
   - Logging may use different aggregation windows

#### DPO Metrics in OpenRLHF

OpenRLHF implements DPO (and variants like IPO, cDPO) with **same metric names as TRL**:
- `rewards/chosen`, `rewards/rejected`
- `rewards/accuracies`, `rewards/margins`
- `loss`

**BUT**: OpenRLHF adds regularization terms in IPO/cDPO that affect loss values:
- **IPO**: Adds regularization term to reduce overfitting - loss values will be higher
- **cDPO**: Smooths labels - affects margin and accuracy interpretations

#### RLOO (REINFORCE Leave-One-Out)

OpenRLHF's RLOO is **enhanced** compared to theoretical RLOO:
- Adds per-token KL reward (not in original)
- Uses PPO-clip loss mechanism (hybrid approach)
- Metrics: Same names as PPO but computed differently

**GRPO in OpenRLHF**:
- Activated with `--advantage_estimator group_norm`
- Metrics match TRL GRPO but implementation differs
- Dr. GRPO variant: Removes /std normalization

#### Ray/Distributed Logging

OpenRLHF distributes models across nodes:
- Actor, Critic, Reward, Reference models on different GPUs
- Metrics aggregated via Ray
- Logging can have delays or race conditions
- W&B and TensorBoard integration but timing differs from TRL

**Key takeaways for OpenRLHF**:
- Metric names match TRL but internal computation can differ
- vLLM integration makes generation metrics incomparable
- Check which algorithm variant you're using (DPO vs IPO vs cDPO)
- Reward curves should be "steady rise" not necessarily monotonic increase

## Critical Comparison Table

| Metric | TRL | Axolotl | LLaMA-Factory | DeepSpeed | Megatron-LM | OpenRLHF |
|--------|-----|---------|---------------|-----------|-------------|----------|
| **SFT loss** | Cross-entropy, positive, 0.5-5.0 | Same as TRL | Same as TRL | Scaled by gas*, positive | Normalized differently, positive | Same as TRL |
| **DPO loss** | Bradley-Terry, positive, 0-1.0 | Same as TRL | Same as TRL | Scaled by gas*, positive | N/A | Same as TRL (+ variants) |
| **PPO policy loss** | Negative clipped objective, typically negative | Same as TRL | Same as TRL | Scaled by gas*, negative | N/A | Similar but with tricks |
| **grad_norm** | L2 norm after accumulation | Same as TRL | Same as TRL | **DIFFERENT** - internal computation, may show NaN bugs | Computed across parallel dims | Uses DeepSpeed (see DeepSpeed column) |
| **perplexity** | Not logged (manual: exp(loss)) | Not logged | Optional custom metric | Not logged | **DIFFERENT** - normalized by original words not subwords | Not logged |
| **Rewards** | Can be +/- depending on algo | Same as TRL | Same as TRL | Same as TRL | N/A | Same as TRL |
| **KL divergence** | Always ≥ 0 | Same as TRL | Same as TRL | Same as TRL | N/A | Same as TRL |

*gas = gradient_accumulation_steps

## Real-World Failure Cases: What To Look For

### Case 1: Switching from TRL to DeepSpeed

**Symptom**: "My training suddenly became unstable when I added DeepSpeed"

**Likely causes**:
1. Learning rate is now effectively multiplied by gradient_accumulation_steps
2. grad_norm=NaN might be DeepSpeed bug, not training issue
3. Loss values are scaled down, making them look better than they are

**Fix checklist**:
- Divide learning rate by gradient_accumulation_steps OR multiply loss by gradient_accumulation_steps in logs
- Check DeepSpeed version (avoid 0.13.5-0.14.0 for grad_norm issues)
- Add `"gradient_clipping": "auto"` to config
- Monitor `loss_scale` and `skipped_steps` metrics

### Case 2: Comparing Megatron to TRL perplexity

**Symptom**: "My Megatron model has perplexity 10.81 but TRL model has 12.5 - Megatron is better?"

**Reality**: Can't compare directly due to normalization difference.

**Fix**: 
- Report both calculation methods
- Use identical eval protocol
- Or only compare within same framework

### Case 3: Loss stuck at specific values

**LLaMA-Factory loss=1.0986 (stuck)**:
- This is log(3) ≈ 1.0986
- Model might be predicting uniformly over 3 classes
- Check data preprocessing and labels

**TRL DPO loss=0.693 (stuck)**:
- This is log(2) ≈ 0.693
- Model cannot distinguish preferences (random performance)
- Check learning rate, dataset quality, reference model

**TRL SFT loss=0.693**:
- This is actually decent! Not stuck.
- Model is doing better than random coin flips

### Case 4: grad_norm appears to decrease during training

**TRL/Standard**: This is NORMAL if gradient clipping is working. Gradients are being successfully controlled.

**DeepSpeed**: Might indicate numerical issues OR might be normal. Check:
- Is loss still decreasing?
- Is accuracy improving?
- Check `loss_scale` metric - if dropping rapidly, you have overflow

### Case 5: OpenRLHF shows different reward trends than TRL

**Symptom**: "TRL PPO shows steadily increasing rewards, but OpenRLHF rewards fluctuate"

**Causes**:
1. vLLM generation differences
2. Different rollout batch sizes
3. Ray distribution causing aggregation delays
4. PPO implementation tricks

**What to check**:
- Compare on same hardware/batch size
- Check if using same reward model
- Verify KL penalty coefficient (beta) is identical
- Look at reward trends over longer timescales (fluctuation is normal)

## Migration Guide: Switching Between Libraries

### TRL → DeepSpeed (adding DeepSpeed to TRL)

**Required changes**:
1. Learning rate adjustment:
   ```python
   # Option 1: Scale down LR
   learning_rate = base_lr / gradient_accumulation_steps
   
   # Option 2: Scale up loss in logs (for comparison)
   logged_loss = deepspeed_loss * gradient_accumulation_steps
   ```

2. Config updates:
   ```json
   {
     "gradient_clipping": "auto",  // Use trainer's max_grad_norm
     "gradient_accumulation_steps": "auto",
     "train_batch_size": "auto"
   }
   ```

3. Metric interpretation:
   - grad_norm: Trust DeepSpeed's value, don't compare to pre-DeepSpeed runs
   - loss: Multiply by gas for comparison OR divide LR
   - Check `loss_scale` if using FP16

### TRL → OpenRLHF

**Required changes**:
1. Configuration shift: TRL uses Trainer args, OpenRLHF uses Ray configs
2. Model distribution: Specify which models go on which nodes
3. vLLM settings: Configure tensor parallelism for generation
4. Metric aggregation: May see delays in logging

**What stays the same**:
- Metric names and meanings (mostly)
- Hyperparameters (learning rate, KL coeff, etc.)
- Dataset format

### TRL → Megatron-LM

**Required changes** (MAJOR):
1. Complete rewrite - different API
2. Perplexity calculations fundamentally different
3. Only forward() returns loss, not logits
4. Pipeline parallelism changes logging behavior

**DON'T migrate to Megatron unless**:
- Training models >70B parameters
- Need extreme-scale parallelism
- Have significant engineering resources

### Axolotl → LLaMA-Factory (or vice versa)

**Easy migration**: Both wrap TRL, configs are similar.

**Main differences**:
- YAML format slightly different
- LLaMA-Factory has WebUI
- Both support same underlying metrics

## Validation Checklist: Are Your Metrics Trustworthy?

Before trusting metrics across libraries, check:

### ✅ Loss sanity checks
- [ ] SFT loss: 0.5-5.0 and decreasing?
- [ ] DPO loss: Started at ~0.693, now <0.5?
- [ ] PPO policy loss: Negative and relatively stable?
- [ ] If using DeepSpeed: Did you account for scaling factor?

### ✅ Gradient norm sanity checks
- [ ] grad_norm: 0.1-10.0 range?
- [ ] Not NaN (unless DeepSpeed bug)?
- [ ] Not >100 (gradient explosion)?
- [ ] If using DeepSpeed: Did you check version and known issues?

### ✅ Perplexity sanity checks
- [ ] Same calculation method (word vs subword tokens)?
- [ ] Computed on same eval set?
- [ ] Decreasing over training?

### ✅ Reward sanity checks (RL methods)
- [ ] Rewards increasing over time?
- [ ] KL divergence stable (not exploding)?
- [ ] Margin between chosen/rejected positive and growing?

### ✅ Framework-specific checks
- [ ] DeepSpeed: Check loss_scale, skipped_steps
- [ ] Megatron: Check MFU%, throughput
- [ ] OpenRLHF: Check rollout throughput, Ray logs
- [ ] TRL: Check entropy (not collapsing?)

## Recommendations by Use Case

### For Production Training
**Recommended**: TRL with DeepSpeed for training, careful metric tracking

**Why**: Most battle-tested, best documentation, widest community support

**Watch out for**: DeepSpeed metric differences, gradient accumulation scaling

### For Research/Experimentation
**Recommended**: Axolotl or LLaMA-Factory

**Why**: Easy configuration, quick iteration, good defaults

**Watch out for**: Same underlying metrics as TRL but abstracted away - harder to debug issues

### For Extreme Scale (>70B)
**Recommended**: OpenRLHF for RLHF, Megatron-LM for pretraining

**Why**: Built for massive scale, efficient parallelism

**Watch out for**: Metrics not directly comparable to smaller-scale frameworks, different normalization

### For RLHF Specifically
**Recommended**: TRL (easy) or OpenRLHF (scale)

**Why**: TRL for prototyping, OpenRLHF for production RLHF at scale

**Watch out for**: PPO is tricky - reward curves should be steady, not monotonic

## Conclusion: The Golden Rule

**NEVER compare metric values directly across libraries without understanding how they're computed.**

When reporting results:
1. **Always specify which library and version** (e.g., "TRL v0.25.1" not "using TRL")
2. **State the metric calculation method** for perplexity
3. **Note if using DeepSpeed** and its version
4. **Report hyperparameters** that affect metrics (gradient_accumulation_steps, learning_rate, etc.)
5. **Provide comparison within same framework** if claiming improvements

Remember: A metric value is meaningless without context about how it was computed and which library computed it.

---

## Appendix: Quick Reference Commands

### Get TRL version
```bash
pip show trl | grep Version
```

### Get DeepSpeed version
```bash
pip show deepspeed | grep Version
```

### Check if DeepSpeed is being used
```python
from accelerate import Accelerator
accelerator = Accelerator()
print(f"Using DeepSpeed: {accelerator.distributed_type == 'DEEPSPEED'}")
```

### Log metrics consistently across libraries
```python
# Universal logging approach
import wandb

# Scale loss appropriately
if using_deepspeed:
    comparable_loss = reported_loss * gradient_accumulation_steps
else:
    comparable_loss = reported_loss

wandb.log({
    "loss/comparable": comparable_loss,
    "loss/raw": reported_loss,
    "grad_norm": grad_norm,
    "library": "TRL v0.25.1",
    "using_deepspeed": using_deepspeed,
    "gradient_accumulation_steps": gradient_accumulation_steps
})
```

### Verify perplexity calculation
```python
# Standard (TRL-style)
import torch
loss = torch.tensor(2.5)
perplexity = torch.exp(loss)
print(f"Perplexity (standard): {perplexity}")

# Megatron-style would require original word count
# Can't be computed from just the loss value alone
```

This cross-library comparison should help you avoid the most common pitfalls when training LLMs or comparing results across different frameworks.
