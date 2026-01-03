import { ManufacturingInputs, ROIResult, SensitivityAnalysis } from './types';

/**
 * Manufacturing ROI Calculator
 *
 * Key assumptions:
 * - OEE improvement correlates with downtime reduction at 2.5x factor (conservative)
 * - Savings begin after implementation timeline completes
 * - No additional capital equipment required
 */

export function calculateManufacturingROI(inputs: ManufacturingInputs): ROIResult {
  // Validate inputs
  const validatedInputs = validateInputs(inputs);

  // Core calculation: Downtime reduction based on OEE improvement
  // Conservative factor: Each 1% OEE improvement = 2.5% downtime reduction
  const downtimeReductionPercent = validatedInputs.targetOEEImprovement * 2.5;

  // Monthly savings from reduced downtime
  const monthlyDowntimeSavings =
    validatedInputs.unplannedDowntimeHoursPerMonth *
    downtimeReductionPercent *
    validatedInputs.costPerDowntimeHour;

  // Net monthly savings after maintenance costs
  const monthlyRecurringSavings = monthlyDowntimeSavings - validatedInputs.monthlyMaintenanceCost;

  // Payback calculation (months to recover implementation cost)
  const paybackMonths = monthlyRecurringSavings > 0
    ? validatedInputs.implementationCost / monthlyRecurringSavings
    : Infinity;

  // First year calculation
  // Assuming savings start after implementation timeline
  const savingsMonthsYear1 = Math.max(0, 12 - validatedInputs.timelineMonths);
  const firstYearSavings = monthlyRecurringSavings * savingsMonthsYear1;
  const firstYearROI = ((firstYearSavings - validatedInputs.implementationCost) / validatedInputs.implementationCost) * 100;

  // Three year calculation
  // Year 1: partial savings (after implementation)
  // Years 2 & 3: full 12 months savings
  const threeYearSavings = firstYearSavings + (monthlyRecurringSavings * 24);
  const threeYearNetValue = threeYearSavings - validatedInputs.implementationCost;
  const threeYearROI = (threeYearNetValue / validatedInputs.implementationCost) * 100;

  // Sensitivity analysis with different scenarios
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

function validateInputs(inputs: ManufacturingInputs): ManufacturingInputs {
  return {
    currentOEE: Math.min(1, Math.max(0, inputs.currentOEE)),
    targetOEEImprovement: Math.min(0.35, Math.max(0, inputs.targetOEEImprovement)),
    unplannedDowntimeHoursPerMonth: Math.max(0, inputs.unplannedDowntimeHoursPerMonth),
    costPerDowntimeHour: Math.max(0, inputs.costPerDowntimeHour),
    implementationCost: Math.max(0, inputs.implementationCost),
    monthlyMaintenanceCost: Math.max(0, inputs.monthlyMaintenanceCost),
    timelineMonths: Math.max(1, inputs.timelineMonths),
  };
}

function calculateSensitivity(
  inputs: ManufacturingInputs,
  expectedMonthlySavings: number
): SensitivityAnalysis {
  // Conservative: 60% of expected benefits
  const conservativeFactor = 0.6;
  // Optimistic: 140% of expected benefits
  const optimisticFactor = 1.4;

  const conservativeSavings = expectedMonthlySavings * conservativeFactor;
  const optimisticSavings = expectedMonthlySavings * optimisticFactor;

  const savingsMonthsYear1 = Math.max(0, 12 - inputs.timelineMonths);

  // Calculate scenarios
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

function getAssumptions(inputs: ManufacturingInputs): string[] {
  return [
    `OEE improvement of ${(inputs.targetOEEImprovement * 100).toFixed(0)}% achievable within ${inputs.timelineMonths} months`,
    `Downtime reduction correlates with OEE improvement at 2.5x factor (industry median)`,
    `No major capital equipment changes required`,
    `Baseline data available for accurate measurement`,
    `Current process stability sufficient for AI optimization`,
    `Dedicated implementation team available during rollout`,
  ];
}

function getCaveats(): string[] {
  return [
    `Results depend heavily on data quality and sensor coverage`,
    `Does not include change management or training costs`,
    `Assumes minimal integration complexity with existing systems`,
    `Actual savings may take 3-6 months to stabilize post-implementation`,
    `ROI calculations assume stable production volume`,
  ];
}
