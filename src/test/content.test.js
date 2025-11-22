import { describe, it, expect } from 'vitest';
import { getMetrics, getAlgorithms } from '../utils/content';

describe('Content Validation', () => {
  const metrics = getMetrics();
  const algorithms = getAlgorithms();

  describe('Metrics', () => {
    it('should load all metrics without errors', () => {
      expect(metrics.length).toBeGreaterThan(0);
      expect(metrics.every(m => !m.id.startsWith('error'))).toBe(true);
    });

    it('every metric should have required fields', () => {
      metrics.forEach(metric => {
        expect(metric.id, `Metric missing id`).toBeDefined();
        expect(metric.name, `Metric ${metric.id} missing name`).toBeDefined();
        expect(metric.shortDescription, `Metric ${metric.id} missing shortDescription`).toBeDefined();
      });
    });

    it('parent metrics should not have whatToLookFor or visualizations', () => {
      const parentMetrics = metrics.filter(m =>
        metrics.some(child => child.parent === m.id)
      );

      parentMetrics.forEach(parent => {
        // Parents should be landing pages - content lives in children
        expect(parent.whatToLookFor, `Parent metric ${parent.id} should not have whatToLookFor`).toBeUndefined();
        expect(parent.visualizations, `Parent metric ${parent.id} should not have visualizations`).toBeUndefined();
      });
    });

    it('child metrics should have whatToLookFor', () => {
      const childMetrics = metrics.filter(m => m.parent);

      childMetrics.forEach(child => {
        expect(child.whatToLookFor, `Child metric ${child.id} missing whatToLookFor`).toBeDefined();
        expect(Array.isArray(child.whatToLookFor), `Child metric ${child.id} whatToLookFor should be array`).toBe(true);
        expect(child.whatToLookFor.length, `Child metric ${child.id} whatToLookFor should not be empty`).toBeGreaterThan(0);
      });
    });

    it('standalone metrics (no parent, no children) should have whatToLookFor', () => {
      const standaloneMetrics = metrics.filter(m =>
        !m.parent && !metrics.some(child => child.parent === m.id)
      );

      standaloneMetrics.forEach(metric => {
        expect(metric.whatToLookFor, `Standalone metric ${metric.id} missing whatToLookFor`).toBeDefined();
        expect(Array.isArray(metric.whatToLookFor), `Metric ${metric.id} whatToLookFor should be array`).toBe(true);
      });
    });

    it('child metrics should reference valid parents', () => {
      const childMetrics = metrics.filter(m => m.parent);
      const metricIds = new Set(metrics.map(m => m.id));

      childMetrics.forEach(child => {
        expect(metricIds.has(child.parent), `Child metric ${child.id} references non-existent parent ${child.parent}`).toBe(true);
      });
    });

    it('metric IDs should be unique', () => {
      const ids = metrics.map(m => m.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });

    it('visualizations should have valid structure when present', () => {
      metrics.filter(m => m.visualizations).forEach(metric => {
        const viz = metric.visualizations;

        expect(viz.yDomain, `Metric ${metric.id} visualization missing yDomain`).toBeDefined();
        expect(Array.isArray(viz.yDomain), `Metric ${metric.id} yDomain should be array`).toBe(true);
        expect(viz.yDomain.length).toBe(2);

        expect(viz.healthy, `Metric ${metric.id} visualization missing healthy`).toBeDefined();
        expect(viz.unhealthy, `Metric ${metric.id} visualization missing unhealthy`).toBeDefined();
      });
    });
  });

  describe('Algorithms', () => {
    it('should load all algorithms without errors', () => {
      expect(algorithms.length).toBeGreaterThan(0);
      expect(algorithms.every(a => !a.id.startsWith('error'))).toBe(true);
    });

    it('every algorithm should have required fields', () => {
      algorithms.forEach(algo => {
        expect(algo.id, `Algorithm missing id`).toBeDefined();
        expect(algo.name, `Algorithm ${algo.id} missing name`).toBeDefined();
        expect(algo.shortDescription, `Algorithm ${algo.id} missing shortDescription`).toBeDefined();
      });
    });

    it('algorithm IDs should be unique', () => {
      const ids = algorithms.map(a => a.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });
  });
});
