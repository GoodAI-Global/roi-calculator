import { SensitivityAnalysis } from '../calculators/types';

/**
 * Calculate sensitivity analysis scenarios
 *
 * @param implementationCost - Total implementation cost
 * @param expectedMonthlySavings - Expected monthly savings after implementation
 * @param timelineMonths - Implementation timeline in months
 * @returns Sensitivity analysis with conservative, expected, and optimistic scenarios
 */
export function calculateSensitivityAnalysis(
  implementationCost: number,
  expectedMonthlySavings: number,
  timelineMonths: number
): SensitivityAnalysis {
  // Conservative: 60% of expected benefits
  const conservativeFactor = 0.6;
  // Optimistic: 140% of expected benefits
  const optimisticFactor = 1.4;

  const conservativeSavings = expectedMonthlySavings * conservativeFactor;
  const optimisticSavings = expectedMonthlySavings * optimisticFactor;

  const savingsMonthsYear1 = Math.max(0, 12 - timelineMonths);

  const calculateScenario = (monthlySavings: number) => {
    // Prevent division by zero
    const paybackMonths =
      monthlySavings > 0 && implementationCost > 0
        ? implementationCost / monthlySavings
        : monthlySavings <= 0
          ? Infinity
          : 0;

    const firstYearSavings = monthlySavings * savingsMonthsYear1;
    const threeYearSavings = firstYearSavings + monthlySavings * 24;
    const threeYearNetValue = threeYearSavings - implementationCost;

    // Prevent division by zero for ROI
    const threeYearROI =
      implementationCost > 0 ? (threeYearNetValue / implementationCost) * 100 : 0;

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
