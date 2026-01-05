export type Industry = 'manufacturing' | 'insurance' | 'healthcare' | 'aquaculture';

/**
 * Financial configuration for enterprise calculations
 */
export interface FinancialConfig {
  discountRate: number;        // Annual discount rate for NPV (e.g., 0.10 for 10%)
  analysisYears: number;       // Number of years for TCO/NPV analysis (default: 5)
  inflationRate: number;       // Annual cost inflation rate (e.g., 0.03 for 3%)
}

export const defaultFinancialConfig: FinancialConfig = {
  discountRate: 0.10,          // 10% - typical enterprise hurdle rate
  analysisYears: 5,
  inflationRate: 0.03,         // 3% annual inflation
};

/**
 * Enhanced financial metrics for enterprise decision-making
 */
export interface EnhancedFinancialMetrics {
  npv: number;                 // Net Present Value
  irr: number;                 // Internal Rate of Return (as decimal, e.g., 0.25 for 25%)
  tco: number;                 // Total Cost of Ownership (5-year)
  profitabilityIndex: number;  // NPV / Initial Investment
  discountedPaybackMonths: number;  // Payback accounting for time value of money
}

export interface SensitivityScenario {
  paybackMonths: number;
  threeYearROI: number;
  threeYearNetValue: number;
}

export interface SensitivityAnalysis {
  conservative: SensitivityScenario;
  expected: SensitivityScenario;
  optimistic: SensitivityScenario;
}

export interface ROIResult {
  paybackMonths: number;
  firstYearROI: number;
  threeYearROI: number;
  threeYearNetValue: number;
  monthlyRecurringSavings: number;
  totalImplementationCost: number;
  assumptions: string[];
  caveats: string[];
  sensitivityAnalysis: SensitivityAnalysis;
  // Enhanced financial metrics
  financialMetrics: EnhancedFinancialMetrics;
  financialConfig: FinancialConfig;
}

export interface ManufacturingInputs {
  currentOEE: number;              // 0-1 (e.g., 0.65 for 65%)
  targetOEEImprovement: number;    // percentage points (e.g., 0.10 for 10%)
  unplannedDowntimeHoursPerMonth: number;
  costPerDowntimeHour: number;     // USD
  implementationCost: number;      // USD
  monthlyMaintenanceCost: number;  // USD
  timelineMonths: number;
}

export interface InsuranceInputs {
  annualClaimsVolume: number;
  averageClaimProcessingTimeMinutes: number;
  laborCostPerHour: number;        // USD
  currentFraudDetectionRate: number; // 0-1
  averageFraudClaimValue: number;  // USD
  implementationCost: number;      // USD
  monthlyMaintenanceCost: number;  // USD
  timelineMonths: number;
}

export const manufacturingDefaults: ManufacturingInputs = {
  currentOEE: 0.65,
  targetOEEImprovement: 0.10,
  unplannedDowntimeHoursPerMonth: 40,
  costPerDowntimeHour: 5000,
  implementationCost: 150000,
  monthlyMaintenanceCost: 2000,
  timelineMonths: 6,
};

export const insuranceDefaults: InsuranceInputs = {
  annualClaimsVolume: 50000,
  averageClaimProcessingTimeMinutes: 45,
  laborCostPerHour: 35,
  currentFraudDetectionRate: 0.15,
  averageFraudClaimValue: 8000,
  implementationCost: 200000,
  monthlyMaintenanceCost: 3000,
  timelineMonths: 9,
};
