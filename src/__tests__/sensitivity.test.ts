import { describe, it, expect } from 'vitest';
import { calculateSensitivityAnalysis } from '../utils/sensitivity';

describe('calculateSensitivityAnalysis', () => {
  describe('with positive savings', () => {
    const result = calculateSensitivityAnalysis(100000, 10000, 6);

    it('should calculate conservative scenario at 60%', () => {
      // Conservative savings: 10000 * 0.6 = 6000/month
      // Payback: 100000 / 6000 = 16.67 months
      expect(result.conservative.paybackMonths).toBeCloseTo(16.7, 0);
    });

    it('should calculate expected scenario at 100%', () => {
      // Expected savings: 10000/month
      // Payback: 100000 / 10000 = 10 months
      expect(result.expected.paybackMonths).toBe(10);
    });

    it('should calculate optimistic scenario at 140%', () => {
      // Optimistic savings: 10000 * 1.4 = 14000/month
      // Payback: 100000 / 14000 = 7.14 months
      expect(result.optimistic.paybackMonths).toBeCloseTo(7.1, 0);
    });

    it('should have correct ordering of scenarios', () => {
      expect(result.conservative.threeYearROI).toBeLessThan(result.expected.threeYearROI);
      expect(result.expected.threeYearROI).toBeLessThan(result.optimistic.threeYearROI);
    });
  });

  describe('edge cases', () => {
    it('should handle zero implementation cost', () => {
      const result = calculateSensitivityAnalysis(0, 10000, 6);

      expect(result.expected.paybackMonths).toBe(0);
      expect(result.expected.threeYearROI).toBe(0);
    });

    it('should handle zero savings', () => {
      const result = calculateSensitivityAnalysis(100000, 0, 6);

      expect(result.expected.paybackMonths).toBe(Infinity);
    });

    it('should handle negative savings', () => {
      const result = calculateSensitivityAnalysis(100000, -5000, 6);

      expect(result.expected.paybackMonths).toBe(Infinity);
    });

    it('should handle long implementation timeline', () => {
      const result = calculateSensitivityAnalysis(100000, 10000, 12);

      // With 12 month timeline, no savings in Year 1
      // 3-year savings: 0 + 24 * 10000 = 240000
      // Net: 240000 - 100000 = 140000
      // ROI: 140000 / 100000 * 100 = 140%
      expect(result.expected.threeYearROI).toBe(140);
    });

    it('should handle timeline exceeding 12 months', () => {
      const result = calculateSensitivityAnalysis(100000, 10000, 15);

      // Year 1 savings months: max(0, 12-15) = 0
      // Still calculates correctly
      expect(result.expected.threeYearROI).toBeGreaterThan(0);
    });
  });

  describe('3-year net value calculations', () => {
    it('should calculate correct 3-year net value', () => {
      const result = calculateSensitivityAnalysis(100000, 10000, 6);

      // Year 1 savings months: 12 - 6 = 6
      // Year 1 savings: 6 * 10000 = 60000
      // Years 2-3 savings: 24 * 10000 = 240000
      // Total savings: 300000
      // Net value: 300000 - 100000 = 200000
      expect(result.expected.threeYearNetValue).toBe(200000);
    });
  });
});
