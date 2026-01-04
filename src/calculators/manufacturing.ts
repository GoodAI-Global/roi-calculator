import { ManufacturingInputs, ROIResult } from './types';
import { calculateSensitivityAnalysis } from '../utils/sensitivity';

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
  // Prevent division by zero
  const paybackMonths =
    monthlyRecurringSavings > 0 && validatedInputs.implementationCost > 0
      ? validatedInputs.implementationCost / monthlyRecurringSavings
      : monthlyRecurringSavings <= 0
        ? Infinity
        : 0;

  // First year calculation
  // Assuming savings start after implementation timeline
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
  // Year 1: partial savings (after implementation)
  // Years 2 & 3: full 12 months savings
  const threeYearSavings = firstYearSavings + monthlyRecurringSavings * 24;
  const threeYearNetValue = threeYearSavings - validatedInputs.implementationCost;

  // Prevent division by zero for ROI
  const threeYearROI =
    validatedInputs.implementationCost > 0
      ? (threeYearNetValue / validatedInputs.implementationCost) * 100
      : 0;

  // Sensitivity analysis with different scenarios
  const sensitivityAnalysis = calculateSensitivityAnalysis(
    validatedInputs.implementationCost,
    monthlyRecurringSavings,
    validatedInputs.timelineMonths
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
