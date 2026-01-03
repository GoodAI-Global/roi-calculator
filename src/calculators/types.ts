export type Industry = 'manufacturing' | 'insurance' | 'healthcare' | 'aquaculture';

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
