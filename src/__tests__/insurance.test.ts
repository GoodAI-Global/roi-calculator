import { describe, it, expect } from 'vitest';
import { calculateInsuranceROI } from '../calculators/insurance';
import { insuranceDefaults, InsuranceInputs } from '../calculators/types';

describe('calculateInsuranceROI', () => {
  describe('with default inputs', () => {
    const result = calculateInsuranceROI(insuranceDefaults);

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
      const inputs: InsuranceInputs = {
        ...insuranceDefaults,
        implementationCost: 0,
      };
      const result = calculateInsuranceROI(inputs);

      expect(result.paybackMonths).toBe(0);
      expect(result.firstYearROI).toBe(0);
      expect(result.threeYearROI).toBe(0);
    });

    it('should handle zero claims volume', () => {
      const inputs: InsuranceInputs = {
        ...insuranceDefaults,
        annualClaimsVolume: 0,
      };
      const result = calculateInsuranceROI(inputs);

      // Monthly savings should be negative (just maintenance cost)
      expect(result.monthlyRecurringSavings).toBe(-insuranceDefaults.monthlyMaintenanceCost);
      expect(result.paybackMonths).toBe(Infinity);
    });

    it('should cap fraud detection improvement at 60%', () => {
      const inputs: InsuranceInputs = {
        ...insuranceDefaults,
        currentFraudDetectionRate: 0.50, // 50% - doubling would be 100%, should cap at 60%
      };
      const result = calculateInsuranceROI(inputs);

      // Should still produce valid results with capped detection rate
      expect(result.monthlyRecurringSavings).toBeGreaterThan(0);
    });

    it('should handle very short processing time', () => {
      const inputs: InsuranceInputs = {
        ...insuranceDefaults,
        averageClaimProcessingTimeMinutes: 1, // Minimum
      };
      const result = calculateInsuranceROI(inputs);

      expect(isFinite(result.paybackMonths) || result.paybackMonths === Infinity).toBe(true);
    });

    it('should clamp fraud detection rate to valid range', () => {
      const inputs: InsuranceInputs = {
        ...insuranceDefaults,
        currentFraudDetectionRate: 1.5, // Invalid, should be clamped to 1
      };
      const result = calculateInsuranceROI(inputs);

      expect(isFinite(result.paybackMonths) || result.paybackMonths === Infinity).toBe(true);
    });
  });

  describe('calculation accuracy', () => {
    it('should calculate processing savings correctly', () => {
      const inputs: InsuranceInputs = {
        annualClaimsVolume: 12000, // 1000/month
        averageClaimProcessingTimeMinutes: 60, // 1 hour
        laborCostPerHour: 50,
        currentFraudDetectionRate: 0.10,
        averageFraudClaimValue: 10000,
        implementationCost: 100000,
        monthlyMaintenanceCost: 0,
        timelineMonths: 6,
      };
      const result = calculateInsuranceROI(inputs);

      // Annual processing hours: 12000 * 60 / 60 = 12000 hours
      // Hours saved (40%): 12000 * 0.4 = 4800 hours
      // Annual processing savings: 4800 * 50 = 240000
      // Monthly processing savings: 240000 / 12 = 20000

      // Fraud: 12000 * 0.02 = 240 fraudulent claims
      // Detection improvement: 0.20 - 0.10 = 0.10 (10% more caught)
      // Additional fraud caught: 240 * 0.10 = 24
      // Annual fraud savings: 24 * 10000 = 240000
      // Monthly fraud savings: 240000 / 12 = 20000

      // Total monthly: 20000 + 20000 = 40000
      expect(result.monthlyRecurringSavings).toBe(40000);
    });

    it('should account for implementation timeline', () => {
      const shortTimeline: InsuranceInputs = {
        ...insuranceDefaults,
        timelineMonths: 3,
      };
      const longTimeline: InsuranceInputs = {
        ...insuranceDefaults,
        timelineMonths: 11,
      };

      const shortResult = calculateInsuranceROI(shortTimeline);
      const longResult = calculateInsuranceROI(longTimeline);

      expect(shortResult.firstYearROI).toBeGreaterThan(longResult.firstYearROI);
    });
  });

  describe('sensitivity analysis', () => {
    it('should have conservative < expected < optimistic for ROI', () => {
      const result = calculateInsuranceROI(insuranceDefaults);

      expect(result.sensitivityAnalysis.conservative.threeYearROI)
        .toBeLessThan(result.sensitivityAnalysis.expected.threeYearROI);
      expect(result.sensitivityAnalysis.expected.threeYearROI)
        .toBeLessThan(result.sensitivityAnalysis.optimistic.threeYearROI);
    });

    it('should have optimistic < expected < conservative for payback', () => {
      const result = calculateInsuranceROI(insuranceDefaults);

      expect(result.sensitivityAnalysis.optimistic.paybackMonths)
        .toBeLessThan(result.sensitivityAnalysis.expected.paybackMonths);
      expect(result.sensitivityAnalysis.expected.paybackMonths)
        .toBeLessThan(result.sensitivityAnalysis.conservative.paybackMonths);
    });
  });
});
