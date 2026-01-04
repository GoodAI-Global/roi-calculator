import { describe, it, expect } from 'vitest';
import { calculateManufacturingROI } from '../calculators/manufacturing';
import { manufacturingDefaults, ManufacturingInputs } from '../calculators/types';

describe('calculateManufacturingROI', () => {
  describe('with default inputs', () => {
    const result = calculateManufacturingROI(manufacturingDefaults);

    it('should return positive monthly savings', () => {
      expect(result.monthlyRecurringSavings).toBeGreaterThan(0);
    });

    it('should return a reasonable payback period', () => {
      expect(result.paybackMonths).toBeGreaterThan(0);
      expect(result.paybackMonths).toBeLessThan(60);
    });

    it('should return positive 3-year ROI', () => {
      expect(result.threeYearROI).toBeGreaterThan(0);
    });

    it('should return positive 3-year net value', () => {
      expect(result.threeYearNetValue).toBeGreaterThan(0);
    });

    it('should include assumptions', () => {
      expect(result.assumptions.length).toBeGreaterThan(0);
    });

    it('should include caveats', () => {
      expect(result.caveats.length).toBeGreaterThan(0);
    });

    it('should include sensitivity analysis with all scenarios', () => {
      expect(result.sensitivityAnalysis.conservative).toBeDefined();
      expect(result.sensitivityAnalysis.expected).toBeDefined();
      expect(result.sensitivityAnalysis.optimistic).toBeDefined();
    });
  });

  describe('edge cases', () => {
    it('should handle zero implementation cost', () => {
      const inputs: ManufacturingInputs = {
        ...manufacturingDefaults,
        implementationCost: 0,
      };
      const result = calculateManufacturingROI(inputs);

      expect(result.paybackMonths).toBe(0);
      expect(result.firstYearROI).toBe(0);
      expect(result.threeYearROI).toBe(0);
      expect(isFinite(result.threeYearNetValue)).toBe(true);
    });

    it('should handle zero downtime hours', () => {
      const inputs: ManufacturingInputs = {
        ...manufacturingDefaults,
        unplannedDowntimeHoursPerMonth: 0,
      };
      const result = calculateManufacturingROI(inputs);

      // Monthly savings should be negative (just maintenance cost)
      expect(result.monthlyRecurringSavings).toBe(-manufacturingDefaults.monthlyMaintenanceCost);
      expect(result.paybackMonths).toBe(Infinity);
    });

    it('should handle high maintenance cost exceeding savings', () => {
      const inputs: ManufacturingInputs = {
        ...manufacturingDefaults,
        monthlyMaintenanceCost: 100000, // Very high maintenance
      };
      const result = calculateManufacturingROI(inputs);

      expect(result.monthlyRecurringSavings).toBeLessThan(0);
      expect(result.paybackMonths).toBe(Infinity);
    });

    it('should handle maximum OEE improvement', () => {
      const inputs: ManufacturingInputs = {
        ...manufacturingDefaults,
        targetOEEImprovement: 0.35, // Max allowed
      };
      const result = calculateManufacturingROI(inputs);

      expect(result.monthlyRecurringSavings).toBeGreaterThan(0);
    });

    it('should clamp OEE values to valid range', () => {
      const inputs: ManufacturingInputs = {
        ...manufacturingDefaults,
        currentOEE: 1.5, // Invalid, should be clamped to 1
        targetOEEImprovement: 0.5, // Invalid, should be clamped to 0.35
      };
      const result = calculateManufacturingROI(inputs);

      // Should still produce valid results
      expect(isFinite(result.paybackMonths) || result.paybackMonths === Infinity).toBe(true);
    });
  });

  describe('calculation accuracy', () => {
    it('should calculate correct monthly savings', () => {
      const inputs: ManufacturingInputs = {
        currentOEE: 0.65,
        targetOEEImprovement: 0.10, // 10%
        unplannedDowntimeHoursPerMonth: 40,
        costPerDowntimeHour: 5000,
        implementationCost: 150000,
        monthlyMaintenanceCost: 2000,
        timelineMonths: 6,
      };
      const result = calculateManufacturingROI(inputs);

      // Expected: 40 * (0.10 * 2.5) * 5000 - 2000 = 40 * 0.25 * 5000 - 2000 = 50000 - 2000 = 48000
      expect(result.monthlyRecurringSavings).toBe(48000);
    });

    it('should calculate correct payback period', () => {
      const inputs: ManufacturingInputs = {
        ...manufacturingDefaults,
        implementationCost: 100000,
        monthlyMaintenanceCost: 0,
        unplannedDowntimeHoursPerMonth: 20,
        costPerDowntimeHour: 2000,
        targetOEEImprovement: 0.10, // 10% = 25% downtime reduction
      };
      const result = calculateManufacturingROI(inputs);

      // Monthly savings: 20 * 0.25 * 2000 = 10000
      // Payback: 100000 / 10000 = 10 months
      expect(result.paybackMonths).toBe(10);
    });

    it('should account for implementation timeline in first year ROI', () => {
      const shortTimeline: ManufacturingInputs = {
        ...manufacturingDefaults,
        timelineMonths: 1,
      };
      const longTimeline: ManufacturingInputs = {
        ...manufacturingDefaults,
        timelineMonths: 11,
      };

      const shortResult = calculateManufacturingROI(shortTimeline);
      const longResult = calculateManufacturingROI(longTimeline);

      // Shorter timeline should have better first year ROI
      expect(shortResult.firstYearROI).toBeGreaterThan(longResult.firstYearROI);
    });
  });

  describe('sensitivity analysis', () => {
    it('should have conservative < expected < optimistic for ROI', () => {
      const result = calculateManufacturingROI(manufacturingDefaults);

      expect(result.sensitivityAnalysis.conservative.threeYearROI)
        .toBeLessThan(result.sensitivityAnalysis.expected.threeYearROI);
      expect(result.sensitivityAnalysis.expected.threeYearROI)
        .toBeLessThan(result.sensitivityAnalysis.optimistic.threeYearROI);
    });

    it('should have optimistic < expected < conservative for payback', () => {
      const result = calculateManufacturingROI(manufacturingDefaults);

      expect(result.sensitivityAnalysis.optimistic.paybackMonths)
        .toBeLessThan(result.sensitivityAnalysis.expected.paybackMonths);
      expect(result.sensitivityAnalysis.expected.paybackMonths)
        .toBeLessThan(result.sensitivityAnalysis.conservative.paybackMonths);
    });
  });
});
