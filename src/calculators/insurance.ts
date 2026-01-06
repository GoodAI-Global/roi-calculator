import { InsuranceInputs, ROIResult, defaultFinancialConfig } from './types';
import { calculateSensitivityAnalysis } from '../utils/sensitivity';
import { calculateEnhancedFinancialMetrics } from '../utils/financial';

/**
 * Insurance ROI Calculator
 *
 * Calculates return on investment for AI-driven insurance automation,
 * focusing on claims processing efficiency and fraud detection improvement.
 *
 * @see {@link file://../MODEL.md#insurance-roi-model} for complete formula documentation
 * @see {@link file://../__fixtures__/roi_scenarios.json} for test scenarios
 *
 * ## Core Formulas
 * - Claims: `annualHoursSaved = (claims × minutes / 60) × 0.40`
 * - Fraud: `additionalFraudCaught = fraudulentClaims × (newRate - currentRate)`
 * - `newFraudDetectionRate = min(0.60, currentRate × 2)`
 *
 * ## Key Assumptions
 * - AI can reduce claims processing time by 40% (conservative benchmark)
 * - AI fraud detection improves detection rate by 2x, capped at 60%
 * - 2% of claims are fraudulent (industry average)
 * - Labor savings calculated based on time reduction
 *
 * @module calculators/insurance
 */

export function calculateInsuranceROI(inputs: InsuranceInputs): ROIResult {
  // Validate inputs
  const validatedInputs = validateInputs(inputs);

  // Claims processing savings
  const currentAnnualProcessingHours =
    (validatedInputs.annualClaimsVolume * validatedInputs.averageClaimProcessingTimeMinutes) / 60;

  // Conservative 40% time reduction with AI assistance
  const processingSavingsPercent = 0.4;
  const annualHoursSaved = currentAnnualProcessingHours * processingSavingsPercent;
  const annualProcessingSavings = annualHoursSaved * validatedInputs.laborCostPerHour;
  const monthlyProcessingSavings = annualProcessingSavings / 12;

  // Fraud detection improvement
  // Assume 2% of claims are fraudulent (industry average)
  const estimatedFraudulentClaims = validatedInputs.annualClaimsVolume * 0.02;

  // Current fraud caught vs. new fraud caught with AI (2x improvement, capped at 60%)
  const newFraudDetectionRate = Math.min(0.6, validatedInputs.currentFraudDetectionRate * 2);
  const additionalFraudCaught =
    estimatedFraudulentClaims * (newFraudDetectionRate - validatedInputs.currentFraudDetectionRate);
  const annualFraudSavings = additionalFraudCaught * validatedInputs.averageFraudClaimValue;
  const monthlyFraudSavings = annualFraudSavings / 12;

  // Total monthly savings
  const totalMonthlySavings = monthlyProcessingSavings + monthlyFraudSavings;
  const monthlyRecurringSavings = totalMonthlySavings - validatedInputs.monthlyMaintenanceCost;

  // Payback calculation - prevent division by zero
  const paybackMonths =
    monthlyRecurringSavings > 0 && validatedInputs.implementationCost > 0
      ? validatedInputs.implementationCost / monthlyRecurringSavings
      : monthlyRecurringSavings <= 0
        ? Infinity
        : 0;

  // First year calculation
  const savingsMonthsYear1 = Math.max(0, 12 - validatedInputs.timelineMonths);
  const firstYearSavings = monthlyRecurringSavings * savingsMonthsYear1;

  // Prevent division by zero for ROI
  const firstYearROI =
    validatedInputs.implementationCost > 0
      ? ((firstYearSavings - validatedInputs.implementationCost) /
          validatedInputs.implementationCost) *
        100
      : 0;

  // Three year calculation
  const threeYearSavings = firstYearSavings + monthlyRecurringSavings * 24;
  const threeYearNetValue = threeYearSavings - validatedInputs.implementationCost;

  // Prevent division by zero for ROI
  const threeYearROI =
    validatedInputs.implementationCost > 0
      ? (threeYearNetValue / validatedInputs.implementationCost) * 100
      : 0;

  // Sensitivity analysis
  const sensitivityAnalysis = calculateSensitivityAnalysis(
    validatedInputs.implementationCost,
    monthlyRecurringSavings,
    validatedInputs.timelineMonths
  );

  // Calculate enhanced financial metrics (NPV, IRR, TCO, etc.)
  const financialMetrics = calculateEnhancedFinancialMetrics(
    validatedInputs.implementationCost,
    totalMonthlySavings, // Gross savings before maintenance
    validatedInputs.monthlyMaintenanceCost,
    validatedInputs.timelineMonths,
    defaultFinancialConfig
  );

  return {
    paybackMonths: Math.round(paybackMonths * 10) / 10,
    firstYearROI: Math.round(firstYearROI * 10) / 10,
    threeYearROI: Math.round(threeYearROI * 10) / 10,
    threeYearNetValue: Math.round(threeYearNetValue),
    monthlyRecurringSavings: Math.round(monthlyRecurringSavings),
    totalImplementationCost: validatedInputs.implementationCost,
    assumptions: getAssumptions(validatedInputs),
    caveats: getCaveats(),
    sensitivityAnalysis,
    financialMetrics,
    financialConfig: defaultFinancialConfig,
  };
}

function validateInputs(inputs: InsuranceInputs): InsuranceInputs {
  return {
    annualClaimsVolume: Math.max(0, inputs.annualClaimsVolume),
    averageClaimProcessingTimeMinutes: Math.max(1, inputs.averageClaimProcessingTimeMinutes),
    laborCostPerHour: Math.max(0, inputs.laborCostPerHour),
    currentFraudDetectionRate: Math.min(1, Math.max(0, inputs.currentFraudDetectionRate)),
    averageFraudClaimValue: Math.max(0, inputs.averageFraudClaimValue),
    implementationCost: Math.max(0, inputs.implementationCost),
    monthlyMaintenanceCost: Math.max(0, inputs.monthlyMaintenanceCost),
    timelineMonths: Math.max(1, inputs.timelineMonths),
  };
}

function getAssumptions(inputs: InsuranceInputs): string[] {
  return [
    `Claims processing time reduction of 40% achievable (industry benchmark)`,
    `Current fraud detection rate of ${(inputs.currentFraudDetectionRate * 100).toFixed(0)}% can be doubled with AI`,
    `Estimated 2% of claims are fraudulent (industry average)`,
    `Labor cost of $${inputs.laborCostPerHour}/hour remains stable`,
    `Sufficient historical claims data available for model training`,
    `Regulatory approval timeline included in ${inputs.timelineMonths} month implementation`,
  ];
}

function getCaveats(): string[] {
  return [
    `Fraud savings depend on accuracy of fraud rate estimates`,
    `Regulatory compliance may require additional time and costs`,
    `Does not include costs of legacy system integration`,
    `Processing time savings assume consistent claim complexity mix`,
    `Human-in-the-loop requirements may reduce automation benefits`,
  ];
}
