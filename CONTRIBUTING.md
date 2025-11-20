# Contributing to metrics.help

Thank you for your interest in contributing to metrics.help!

## How to Contribute

### Adding or Improving Metrics

Create or edit a markdown file in `src/content/metrics/` using this structure:

```markdown
---
id: metric-id
name: Display Name
aliases: [metric_id, alternative_name, another_alias]
shortDescription: Brief one-line description of the metric.
whatToLookFor:
  - Key point to watch for
  - Another important indicator
  - Warning signs
visualizations:
  yDomain: [min, max]  # e.g., [0, 1] or [0, 100]
  healthy:
    data:
      - { step: 0, value: 0.5 }
      - { step: 10, value: 0.7 }
      # Add more data points showing healthy progression
  unhealthy:
    data:
      - { step: 0, value: 0.5 }
      - { step: 10, value: 0.3 }
      # Add more data points showing problematic patterns
---

# Detailed Explanation

Provide a clear, beginner-friendly explanation of what this metric measures and why it matters.

## Common Issues

Describe common problems or patterns to watch out for.

## Related Metrics

Link to related metrics that practitioners should also monitor.
```

### Adding or Improving Algorithms

Create or edit a markdown file in `src/content/algorithms/` following a similar structure, explaining:
- What the algorithm does
- Key metrics to watch when using this algorithm
- Common issues and solutions
- Links to papers or resources

### Fixing Errors or Improving Clarity

- Fix typos or unclear explanations
- Add examples or better visualizations
- Improve accuracy of technical content

## Content Guidelines

When adding or editing content:

- **Be beginner-friendly**: Assume readers are learning
- **Be practical**: Focus on actionable insights
- **Be concise**: Get to the point quickly
- **Use examples**: Show real patterns, not just theory
- **Test visualizations**: Ensure data points create clear, understandable graphs

## Submitting Changes

1. Fork the repository
2. Make your changes
3. Submit a pull request with a clear description of what you've added or fixed

## License

By contributing, you agree that your contributions will be licensed under the MIT License (code) and CC0 (content).
