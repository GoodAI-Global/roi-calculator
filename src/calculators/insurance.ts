import { InsuranceInputs, ROIResult, SensitivityAnalysis } from './types';

/**
 * Insurance ROI Calculator
 *
 * Key assumptions:
 * - AI can reduce claims processing time by 40% (conservative benchmark)
 * - AI fraud detection improves detection rate by 2x (conservative)
 * - Labor savings calculated based on time reduction
 */

export function calculateInsuranceROI(inputs: InsuranceInputs): ROIResult {
  // Validate inputs
  const validatedInputs = validateInputs(inputs);

  // Claims processing savings
  const currentAnnualProcessingHours =
    (validatedInputs.annualClaimsVolume * validatedInputs.averageClaimProcessingTimeMinutes) / 60;

  // Conservative 40% time reduction with AI assistance
  const processingSavingsPercent = 0.40;
  const annualHoursSaved = currentAnnualProcessingHours * processingSavingsPercent;
  const annualProcessingSavings = annualHoursSaved * validatedInputs.laborCostPerHour;
  const monthlyProcessingSavings = annualProcessingSavings / 12;

  // Fraud detection improvement
  // Assume 2% of claims are fraudulent (industry average)
  const estimatedFraudulentClaims = validatedInputs.annualClaimsVolume * 0.02;

  // Current fraud caught vs. new fraud caught with AI (2x improvement, capped at 60%)
  const newFraudDetectionRate = Math.min(0.60, validatedInputs.currentFraudDetectionRate * 2);
  const additionalFraudCaught = estimatedFraudulentClaims * (newFraudDetectionRate - validatedInputs.currentFraudDetectionRate);
  const annualFraudSavings = additionalFraudCaught * validatedInputs.averageFraudClaimValue;
  const monthlyFraudSavings = annualFraudSavings / 12;

  // Total monthly savings
  const totalMonthlySavings = monthlyProcessingSavings + monthlyFraudSavings;
  const monthlyRecurringSavings = totalMonthlySavings - validatedInputs.monthlyMaintenanceCost;

  // Payback calculation
  const paybackMonths = monthlyRecurringSavings > 0
    ? validatedInputs.implementationCost / monthlyRecurringSavings
    : Infinity;

  // First year calculation
  const savingsMonthsYear1 = Math.max(0, 12 - validatedInputs.timelineMonths);
  const firstYearSavings = monthlyRecurringSavings * savingsMonthsYear1;
  const firstYearROI = ((firstYearSavings - validatedInputs.implementationCost) / validatedInputs.implementationCost) * 100;

  // Three year calculation
  const threeYearSavings = firstYearSavings + (monthlyRecurringSavings * 24);
  const threeYearNetValue = threeYearSavings - validatedInputs.implementationCost;
  const threeYearROI = (threeYearNetValue / validatedInputs.implementationCost) * 100;

  // Sensitivity analysis
  const sensitivityAnalysis = calculateSensitivity(validatedInputs, monthlyRecurringSavings);

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

function calculateSensitivity(
  inputs: InsuranceInputs,
  expectedMonthlySavings: number
): SensitivityAnalysis {
  const conservativeFactor = 0.6;
  const optimisticFactor = 1.4;

  const conservativeSavings = expectedMonthlySavings * conservativeFactor;
  const optimisticSavings = expectedMonthlySavings * optimisticFactor;

  const savingsMonthsYear1 = Math.max(0, 12 - inputs.timelineMonths);

  const calculateScenario = (monthlySavings: number) => {
    const paybackMonths = monthlySavings > 0
      ? inputs.implementationCost / monthlySavings
      : Infinity;

    const firstYearSavings = monthlySavings * savingsMonthsYear1;
    const threeYearSavings = firstYearSavings + (monthlySavings * 24);
    const threeYearNetValue = threeYearSavings - inputs.implementationCost;
    const threeYearROI = (threeYearNetValue / inputs.implementationCost) * 100;

    return {
      paybackMonths: Math.round(paybackMonths * 10) / 10,
      threeYearROI: Math.round(threeYearROI * 10) / 10,
      threeYearNetValue: Math.round(threeYearNetValue),
    };
  };

  return {
    conservative: calculateScenario(conservativeSavings),
    expected: calculateScenario(expectedMonthlySavings),
    optimistic: calculateScenario(optimisticSavings),
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
