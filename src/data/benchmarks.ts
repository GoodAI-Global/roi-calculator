/**
 * Industry Benchmarks for AI Implementation ROI
 *
 * These benchmarks are based on p50 (median) values from industry studies.
 * Good AI philosophy: Use conservative estimates, not optimistic vendor claims.
 *
 * Sources:
 * - McKinsey Global Institute AI studies
 * - Deloitte AI Implementation reports
 * - Industry-specific case studies (anonymized aggregates)
 */

export interface IndustryBenchmark {
  name: string;
  enabled: boolean;
  description: string;
  typicalROIRange: {
    low: number;
    median: number;
    high: number;
  };
  typicalPaybackMonths: {
    fast: number;
    median: number;
    slow: number;
  };
  implementationCostRange: {
    low: number;
    median: number;
    high: number;
  };
  keyMetrics: string[];
}

export const industryBenchmarks: Record<string, IndustryBenchmark> = {
  manufacturing: {
    name: 'Manufacturing',
    enabled: true,
    description: 'Predictive maintenance, quality control, and OEE optimization',
    typicalROIRange: {
      low: 50,
      median: 150,
      high: 300,
    },
    typicalPaybackMonths: {
      fast: 6,
      median: 12,
      slow: 24,
    },
    implementationCostRange: {
      low: 75000,
      median: 150000,
      high: 500000,
    },
    keyMetrics: [
      'OEE (Overall Equipment Effectiveness)',
      'Unplanned Downtime Reduction',
      'Defect Rate Reduction',
      'Maintenance Cost Savings',
    ],
  },

  insurance: {
    name: 'Insurance',
    enabled: true,
    description: 'Claims automation, fraud detection, and underwriting optimization',
    typicalROIRange: {
      low: 75,
      median: 200,
      high: 400,
    },
    typicalPaybackMonths: {
      fast: 9,
      median: 15,
      slow: 30,
    },
    implementationCostRange: {
      low: 100000,
      median: 200000,
      high: 750000,
    },
    keyMetrics: [
      'Claims Processing Time',
      'Fraud Detection Rate',
      'Customer Satisfaction Score',
      'Labor Cost per Claim',
    ],
  },

  healthcare: {
    name: 'Healthcare',
    enabled: false,
    description: 'Clinical decision support, operational efficiency, patient outcomes',
    typicalROIRange: {
      low: 40,
      median: 100,
      high: 250,
    },
    typicalPaybackMonths: {
      fast: 12,
      median: 24,
      slow: 48,
    },
    implementationCostRange: {
      low: 200000,
      median: 500000,
      high: 2000000,
    },
    keyMetrics: [
      'Diagnostic Accuracy',
      'Length of Stay',
      'Readmission Rates',
      'Staff Efficiency',
    ],
  },

  aquaculture: {
    name: 'Aquaculture',
    enabled: false,
    description: 'Feed optimization, disease detection, growth prediction',
    typicalROIRange: {
      low: 30,
      median: 80,
      high: 200,
    },
    typicalPaybackMonths: {
      fast: 12,
      median: 18,
      slow: 36,
    },
    implementationCostRange: {
      low: 50000,
      median: 120000,
      high: 350000,
    },
    keyMetrics: [
      'Feed Conversion Ratio',
      'Mortality Rate',
      'Growth Rate',
      'Water Quality Metrics',
    ],
  },
};

/**
 * OEE Improvement Benchmarks
 * Based on industry studies of AI-driven manufacturing optimization
 */
export const oeeImprovementBenchmarks = {
  conservative: 0.05, // 5 percentage points
  median: 0.10,       // 10 percentage points
  optimistic: 0.15,   // 15 percentage points
  worldClass: 0.20,   // 20 percentage points (rare)
};

/**
 * Downtime Reduction Benchmarks
 * Correlation factor between OEE improvement and downtime reduction
 */
export const downtimeCorrelationFactor = {
  conservative: 2.0,
  median: 2.5,
  optimistic: 3.0,
};
