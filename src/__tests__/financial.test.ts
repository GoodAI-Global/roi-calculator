import { describe, it, expect } from 'vitest';
import {
  calculateNPV,
  calculateIRR,
  calculateTCO,
  calculateDiscountedPayback,
  generateMonthlyCashFlows,
  calculateEnhancedFinancialMetrics,
} from '../utils/financial';
import { defaultFinancialConfig } from '../calculators/types';

describe('Financial Calculations', () => {
  describe('calculateNPV', () => {
    it('should return negative initial investment for zero cash flows', () => {
      const cashFlows = Array(60).fill(0);
      const npv = calculateNPV(100000, cashFlows, 0.10);
      expect(npv).toBe(-100000);
    });

    it('should calculate positive NPV for profitable investment', () => {
      // $100k investment, $5k monthly savings for 60 months at 10% discount
      const cashFlows = Array(60).fill(5000);
      const npv = calculateNPV(100000, cashFlows, 0.10);
      expect(npv).toBeGreaterThan(100000); // Should be well profitable
    });

    it('should return higher NPV with lower discount rate', () => {
      const cashFlows = Array(60).fill(3000);
      const npv10 = calculateNPV(100000, cashFlows, 0.10);
      const npv05 = calculateNPV(100000, cashFlows, 0.05);
      expect(npv05).toBeGreaterThan(npv10);
    });

    it('should return negative NPV for unprofitable investment', () => {
      const cashFlows = Array(60).fill(500); // Only $500/month
      const npv = calculateNPV(100000, cashFlows, 0.10);
      expect(npv).toBeLessThan(0);
    });

    it('should handle zero discount rate correctly', () => {
      const cashFlows = Array(12).fill(10000);
      const npv = calculateNPV(100000, cashFlows, 0);
      expect(npv).toBeCloseTo(20000, 0); // 12 * 10000 - 100000 = 20000
    });
  });

  describe('calculateIRR', () => {
    it('should return positive IRR for profitable investment', () => {
      const cashFlows = Array(60).fill(5000);
      const irr = calculateIRR(100000, cashFlows);
      expect(irr).toBeGreaterThan(0);
    });

    it('should return higher IRR for faster payback', () => {
      const highCashFlows = Array(60).fill(10000);
      const lowCashFlows = Array(60).fill(3000);
      const irrHigh = calculateIRR(100000, highCashFlows);
      const irrLow = calculateIRR(100000, lowCashFlows);
      expect(irrHigh).toBeGreaterThan(irrLow);
    });

    it('should handle very high returns (cap at 500%)', () => {
      const cashFlows = Array(60).fill(100000); // Very high returns
      const irr = calculateIRR(100000, cashFlows);
      expect(irr).toBeLessThanOrEqual(5); // Capped at 500%
    });

    it('should return negative IRR for unprofitable investment', () => {
      const cashFlows = Array(60).fill(100); // Only $100/month
      const irr = calculateIRR(100000, cashFlows);
      expect(irr).toBeLessThan(0);
    });
  });

  describe('calculateTCO', () => {
    it('should include initial investment plus maintenance', () => {
      const tco = calculateTCO(100000, 1000, 5, 0);
      // 100000 + (1000 * 12 * 5) = 100000 + 60000 = 160000
      expect(tco).toBe(160000);
    });

    it('should apply inflation to maintenance costs', () => {
      const tcoNoInflation = calculateTCO(100000, 1000, 5, 0);
      const tcoWithInflation = calculateTCO(100000, 1000, 5, 0.03);
      expect(tcoWithInflation).toBeGreaterThan(tcoNoInflation);
    });

    it('should return only initial investment when no maintenance cost', () => {
      const tco = calculateTCO(100000, 0, 5, 0.03);
      expect(tco).toBe(100000);
    });

    it('should increase TCO with longer analysis period', () => {
      const tco3Year = calculateTCO(100000, 1000, 3, 0);
      const tco5Year = calculateTCO(100000, 1000, 5, 0);
      expect(tco5Year).toBeGreaterThan(tco3Year);
    });
  });

  describe('calculateDiscountedPayback', () => {
    it('should return payback period in months', () => {
      // $100k investment, $10k monthly savings
      const cashFlows = Array(60).fill(10000);
      const payback = calculateDiscountedPayback(100000, cashFlows, 0.10);
      expect(payback).toBeGreaterThan(10); // More than 10 months due to discounting
      expect(payback).toBeLessThan(15); // But less than 15
    });

    it('should return Infinity when payback not achieved', () => {
      const cashFlows = Array(60).fill(100); // Too low
      const payback = calculateDiscountedPayback(100000, cashFlows, 0.10);
      expect(payback).toBe(Infinity);
    });

    it('should return longer payback with higher discount rate', () => {
      const cashFlows = Array(60).fill(5000);
      const payback5 = calculateDiscountedPayback(100000, cashFlows, 0.05);
      const payback15 = calculateDiscountedPayback(100000, cashFlows, 0.15);
      expect(payback15).toBeGreaterThan(payback5);
    });

    it('should return 0 when no investment required', () => {
      const cashFlows = Array(60).fill(5000);
      const payback = calculateDiscountedPayback(0, cashFlows, 0.10);
      expect(payback).toBeLessThan(1); // Immediate payback
    });
  });

  describe('generateMonthlyCashFlows', () => {
    it('should generate correct number of cash flows', () => {
      const cashFlows = generateMonthlyCashFlows(10000, 1000, 6, 60, 0);
      expect(cashFlows.length).toBe(60);
    });

    it('should ramp up savings during implementation', () => {
      const cashFlows = generateMonthlyCashFlows(10000, 0, 6, 12, 0);
      // First month should be ~1/6 of full savings
      expect(cashFlows[0]).toBeCloseTo(10000 / 6, -1);
      // Last implementation month should be full savings
      expect(cashFlows[5]).toBeCloseTo(10000, -1);
    });

    it('should have full savings after implementation', () => {
      const cashFlows = generateMonthlyCashFlows(10000, 1000, 6, 12, 0);
      // Month 7 (index 6) should have full savings minus maintenance
      expect(cashFlows[6]).toBeCloseTo(10000 - 1000, -1);
    });

    it('should apply inflation over time', () => {
      const cashFlows = generateMonthlyCashFlows(10000, 0, 1, 24, 0.12);
      // After 1 year (~12 months), savings should be higher due to inflation
      expect(cashFlows[12]).toBeGreaterThan(cashFlows[1]);
    });

    it('should net savings minus maintenance costs', () => {
      const cashFlows = generateMonthlyCashFlows(10000, 5000, 1, 12, 0);
      // After implementation, net should be savings - maintenance
      expect(cashFlows[1]).toBeCloseTo(10000 - 5000, -1);
    });
  });

  describe('calculateEnhancedFinancialMetrics', () => {
    it('should return all required metrics', () => {
      const metrics = calculateEnhancedFinancialMetrics(
        150000,
        50000,
        2000,
        6,
        defaultFinancialConfig
      );

      expect(metrics).toHaveProperty('npv');
      expect(metrics).toHaveProperty('irr');
      expect(metrics).toHaveProperty('tco');
      expect(metrics).toHaveProperty('profitabilityIndex');
      expect(metrics).toHaveProperty('discountedPaybackMonths');
    });

    it('should calculate positive NPV for typical manufacturing scenario', () => {
      const metrics = calculateEnhancedFinancialMetrics(
        150000,
        50000,
        2000,
        6,
        defaultFinancialConfig
      );

      expect(metrics.npv).toBeGreaterThan(0);
      expect(metrics.irr).toBeGreaterThan(defaultFinancialConfig.discountRate);
      expect(metrics.profitabilityIndex).toBeGreaterThan(1);
    });

    it('should calculate negative NPV for unprofitable scenario', () => {
      const metrics = calculateEnhancedFinancialMetrics(
        500000,
        5000,
        10000,
        12,
        defaultFinancialConfig
      );

      expect(metrics.npv).toBeLessThan(0);
      expect(metrics.profitabilityIndex).toBeLessThan(1);
    });

    it('should handle zero implementation cost', () => {
      const metrics = calculateEnhancedFinancialMetrics(
        0,
        10000,
        1000,
        1,
        defaultFinancialConfig
      );

      // TCO still includes maintenance costs over 5 years
      expect(metrics.tco).toBeGreaterThan(0);
      // Profitability index is 0 when no initial investment (divide by zero protection)
      expect(metrics.profitabilityIndex).toBe(0);
    });

    it('should calculate TCO correctly', () => {
      const metrics = calculateEnhancedFinancialMetrics(
        100000,
        50000,
        1000,
        6,
        { discountRate: 0.10, analysisYears: 5, inflationRate: 0 }
      );

      // TCO should be initial + 5 years of maintenance
      expect(metrics.tco).toBeCloseTo(100000 + 1000 * 12 * 5, -2);
    });

    it('should return finite discounted payback for profitable scenarios', () => {
      const metrics = calculateEnhancedFinancialMetrics(
        100000,
        30000,
        2000,
        3,
        defaultFinancialConfig
      );

      expect(metrics.discountedPaybackMonths).toBeLessThan(Infinity);
      expect(metrics.discountedPaybackMonths).toBeGreaterThan(0);
    });

    it('should handle different financial configurations', () => {
      const conservativeConfig = {
        discountRate: 0.15,
        analysisYears: 3,
        inflationRate: 0.05,
      };

      const metrics = calculateEnhancedFinancialMetrics(
        150000,
        50000,
        2000,
        6,
        conservativeConfig
      );

      expect(metrics.tco).toBeDefined();
      expect(metrics.npv).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very small monthly savings', () => {
      const metrics = calculateEnhancedFinancialMetrics(
        100000,
        100,
        50,
        12,
        defaultFinancialConfig
      );

      expect(metrics.npv).toBeDefined();
      expect(metrics.irr).toBeDefined();
    });

    it('should handle very large values', () => {
      const metrics = calculateEnhancedFinancialMetrics(
        10000000,
        1000000,
        50000,
        12,
        defaultFinancialConfig
      );

      expect(metrics.npv).toBeDefined();
      expect(Number.isFinite(metrics.npv)).toBe(true);
    });

    it('should handle immediate implementation (1 month timeline)', () => {
      const metrics = calculateEnhancedFinancialMetrics(
        100000,
        20000,
        1000,
        1,
        defaultFinancialConfig
      );

      expect(metrics.discountedPaybackMonths).toBeLessThan(10);
    });

    it('should handle very long implementation timeline', () => {
      const metrics = calculateEnhancedFinancialMetrics(
        100000,
        20000,
        1000,
        24,
        defaultFinancialConfig
      );

      expect(metrics.npv).toBeDefined();
      // Payback should be longer than immediate implementation, but not necessarily > 24
      // due to ramp-up savings during implementation
      expect(metrics.discountedPaybackMonths).toBeGreaterThan(5);
    });
  });
});
