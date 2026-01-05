import { FinancialConfig, EnhancedFinancialMetrics, defaultFinancialConfig } from '../calculators/types';

/**
 * Calculate Net Present Value (NPV)
 * NPV = Σ (Cash Flow_t / (1 + r)^t) - Initial Investment
 *
 * @param initialInvestment - Upfront implementation cost
 * @param monthlyCashFlows - Array of monthly net cash flows (savings - costs)
 * @param annualDiscountRate - Annual discount rate (e.g., 0.10 for 10%)
 * @returns NPV value
 */
export function calculateNPV(
  initialInvestment: number,
  monthlyCashFlows: number[],
  annualDiscountRate: number
): number {
  // Convert annual discount rate to monthly
  const monthlyRate = Math.pow(1 + annualDiscountRate, 1 / 12) - 1;

  let npv = -initialInvestment;

  for (let t = 0; t < monthlyCashFlows.length; t++) {
    const discountFactor = Math.pow(1 + monthlyRate, t + 1);
    npv += monthlyCashFlows[t] / discountFactor;
  }

  return npv;
}

/**
 * Calculate Internal Rate of Return (IRR) using Newton-Raphson method
 * IRR is the discount rate that makes NPV = 0
 *
 * @param initialInvestment - Upfront implementation cost
 * @param monthlyCashFlows - Array of monthly net cash flows
 * @param maxIterations - Maximum iterations for convergence
 * @param tolerance - Convergence tolerance
 * @returns Annual IRR as decimal (e.g., 0.25 for 25%)
 */
export function calculateIRR(
  initialInvestment: number,
  monthlyCashFlows: number[],
  maxIterations: number = 100,
  tolerance: number = 0.0001
): number {
  // Initial guess for monthly IRR
  let monthlyRate = 0.01;

  for (let i = 0; i < maxIterations; i++) {
    let npv = -initialInvestment;
    let npvDerivative = 0;

    for (let t = 0; t < monthlyCashFlows.length; t++) {
      const discountFactor = Math.pow(1 + monthlyRate, t + 1);
      npv += monthlyCashFlows[t] / discountFactor;
      npvDerivative -= (t + 1) * monthlyCashFlows[t] / Math.pow(1 + monthlyRate, t + 2);
    }

    // Avoid division by zero
    if (Math.abs(npvDerivative) < 1e-10) {
      break;
    }

    const newRate = monthlyRate - npv / npvDerivative;

    // Check for convergence
    if (Math.abs(newRate - monthlyRate) < tolerance) {
      monthlyRate = newRate;
      break;
    }

    // Bound the rate to avoid divergence
    monthlyRate = Math.max(-0.99, Math.min(newRate, 10));
  }

  // Convert monthly IRR to annual IRR
  const annualIRR = Math.pow(1 + monthlyRate, 12) - 1;

  // Cap IRR at reasonable bounds (negative to 500%)
  return Math.max(-1, Math.min(annualIRR, 5));
}

/**
 * Calculate Total Cost of Ownership (TCO) over analysis period
 * TCO includes initial investment + ongoing costs with inflation
 *
 * @param initialInvestment - Upfront implementation cost
 * @param monthlyMaintenanceCost - Monthly recurring costs
 * @param analysisYears - Number of years for analysis
 * @param inflationRate - Annual inflation rate
 * @returns Total cost of ownership
 */
export function calculateTCO(
  initialInvestment: number,
  monthlyMaintenanceCost: number,
  analysisYears: number,
  inflationRate: number
): number {
  let tco = initialInvestment;

  for (let year = 0; year < analysisYears; year++) {
    // Apply inflation to maintenance costs each year
    const inflatedMonthlyCost = monthlyMaintenanceCost * Math.pow(1 + inflationRate, year);
    tco += inflatedMonthlyCost * 12;
  }

  return tco;
}

/**
 * Calculate discounted payback period
 * Time required to recover investment accounting for time value of money
 *
 * @param initialInvestment - Upfront implementation cost
 * @param monthlyCashFlows - Array of monthly net cash flows
 * @param annualDiscountRate - Annual discount rate
 * @returns Payback period in months (Infinity if never pays back)
 */
export function calculateDiscountedPayback(
  initialInvestment: number,
  monthlyCashFlows: number[],
  annualDiscountRate: number
): number {
  const monthlyRate = Math.pow(1 + annualDiscountRate, 1 / 12) - 1;

  let cumulativeDiscountedCashFlow = -initialInvestment;

  for (let t = 0; t < monthlyCashFlows.length; t++) {
    const discountFactor = Math.pow(1 + monthlyRate, t + 1);
    const discountedCashFlow = monthlyCashFlows[t] / discountFactor;
    cumulativeDiscountedCashFlow += discountedCashFlow;

    if (cumulativeDiscountedCashFlow >= 0) {
      // Interpolate for more accurate payback month
      const previousCumulative = cumulativeDiscountedCashFlow - discountedCashFlow;
      // Protect against division by zero
      if (discountedCashFlow === 0) {
        return t;
      }
      const fractionOfMonth = -previousCumulative / discountedCashFlow;
      return t + fractionOfMonth;
    }
  }

  // If payback not achieved within analysis period
  return Infinity;
}

/**
 * Generate monthly cash flow array for ROI analysis
 * Accounts for implementation timeline (ramp-up period)
 *
 * @param monthlySavings - Expected monthly savings at full implementation
 * @param monthlyMaintenanceCost - Monthly recurring costs
 * @param implementationMonths - Months until full implementation
 * @param analysisMonths - Total months to analyze
 * @param inflationRate - Annual inflation rate
 * @returns Array of monthly net cash flows
 */
export function generateMonthlyCashFlows(
  monthlySavings: number,
  monthlyMaintenanceCost: number,
  implementationMonths: number,
  analysisMonths: number,
  inflationRate: number
): number[] {
  const cashFlows: number[] = [];
  const monthlyInflation = Math.pow(1 + inflationRate, 1 / 12) - 1;

  // Ensure implementationMonths is at least 1 to avoid division by zero
  const safeImplementationMonths = Math.max(1, implementationMonths);

  for (let month = 0; month < analysisMonths; month++) {
    // Calculate ramp-up factor (linear ramp during implementation)
    let rampUpFactor: number;
    if (month < safeImplementationMonths) {
      // During implementation: linear ramp from 0 to 100%
      rampUpFactor = (month + 1) / safeImplementationMonths;
    } else {
      // Post implementation: full savings
      rampUpFactor = 1;
    }

    // Apply inflation to both savings and costs
    const inflationFactor = Math.pow(1 + monthlyInflation, month);
    const adjustedSavings = monthlySavings * rampUpFactor * inflationFactor;
    const adjustedCosts = monthlyMaintenanceCost * inflationFactor;

    cashFlows.push(adjustedSavings - adjustedCosts);
  }

  return cashFlows;
}

/**
 * Calculate all enhanced financial metrics
 *
 * @param initialInvestment - Upfront implementation cost
 * @param monthlySavings - Expected monthly savings at full implementation
 * @param monthlyMaintenanceCost - Monthly recurring costs
 * @param implementationMonths - Months until full implementation
 * @param config - Financial configuration (discount rate, analysis years, inflation)
 * @returns Complete enhanced financial metrics
 */
export function calculateEnhancedFinancialMetrics(
  initialInvestment: number,
  monthlySavings: number,
  monthlyMaintenanceCost: number,
  implementationMonths: number,
  config: FinancialConfig = defaultFinancialConfig
): EnhancedFinancialMetrics {
  const analysisMonths = config.analysisYears * 12;

  // Generate cash flows for the analysis period
  const cashFlows = generateMonthlyCashFlows(
    monthlySavings,
    monthlyMaintenanceCost,
    implementationMonths,
    analysisMonths,
    config.inflationRate
  );

  // Calculate NPV
  const npv = calculateNPV(initialInvestment, cashFlows, config.discountRate);

  // Calculate IRR
  const irr = calculateIRR(initialInvestment, cashFlows);

  // Calculate TCO
  const tco = calculateTCO(
    initialInvestment,
    monthlyMaintenanceCost,
    config.analysisYears,
    config.inflationRate
  );

  // Calculate Profitability Index
  // PI = (NPV + Initial Investment) / Initial Investment = 1 + (NPV / Initial Investment)
  const profitabilityIndex = initialInvestment > 0
    ? (npv + initialInvestment) / initialInvestment
    : 0;

  // Calculate Discounted Payback
  const discountedPaybackMonths = calculateDiscountedPayback(
    initialInvestment,
    cashFlows,
    config.discountRate
  );

  return {
    npv: Math.round(npv),
    irr,
    tco: Math.round(tco),
    profitabilityIndex: Math.round(profitabilityIndex * 100) / 100,
    discountedPaybackMonths: discountedPaybackMonths === Infinity
      ? Infinity
      : Math.round(discountedPaybackMonths * 10) / 10,
  };
}
