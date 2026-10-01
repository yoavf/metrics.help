## 2026-10-01

### Accuracy fixes
- **GRPO rewards:** clarified that the logged `reward` is the raw score; only the advantages used for training are group-normalized.
- **PPO:** corrected the roles of the reward model and the value model (critic); the policy loss can be negative and doesn't need to go down.
- **KL divergence:** removed fixed "healthy" ranges, explained how the scale depends on the estimator and aggregation, and noted that TRL's GRPO defaults to beta = 0.
- **DPO loss:** the 0.693 starting point only applies to the default sigmoid loss.
- **ORPO:** separated `log_odds_chosen` (should rise above 0) from TRL's `log_odds_ratio` (≤ 0, moves toward 0).
- **Completions:** `num_tokens` is no longer treated as completion length (it's the running total of tokens seen).
- Replaced one-size-fits-all thresholds across metric pages with "compare against your own run or a baseline" guidance.

### New
- Metric pages: **Token Accuracy**, **Reward Margins (DPO)** and **Value Loss (PPO)**.
- A **How this is calculated** section (formula, aggregation, units, source) on every metric page.
- A **Last reviewed** date on every metric and algorithm page.
- The log analyzer now understands `train/` and `eval/` prefixes, per-reward-function keys like `rewards/<name>/mean`, and more TRL field names.

### Changed
- Renamed the two clip metrics to **Clip Ratio (Policy Updates)** and **Truncated Completions** so they're harder to confuse.
