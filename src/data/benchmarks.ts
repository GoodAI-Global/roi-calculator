/**
 * Industry Benchmarks for AI Implementation ROI
 *
 * These benchmarks are based on p50 (median) values from industry studies.
 * Good AI philosophy: Use conservative estimates, not optimistic vendor claims.
 */

/**
 * Citation interface for academic/industry source tracking
 */
export interface Citation {
  id: string;
  title: string;
  source: string;
  year: number;
  url?: string;
  accessedDate?: string;
  methodology?: string;
}

/**
 * Master list of citations used across benchmarks
 */
export const benchmarkCitations: Record<string, Citation> = {
  mckinsey2023: {
    id: 'mckinsey2023',
    title: 'The State of AI in 2023: Generative AI\'s Breakout Year',
    source: 'McKinsey Global Institute',
    year: 2023,
    url: 'https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai-in-2023',
    accessedDate: '2024-01-15',
    methodology: 'Survey of 1,684 organizations across industries',
  },
  deloitte2023: {
    id: 'deloitte2023',
    title: 'State of AI in the Enterprise, 5th Edition',
    source: 'Deloitte Insights',
    year: 2023,
    url: 'https://www2.deloitte.com/us/en/insights/focus/cognitive-technologies/state-of-ai-and-intelligent-automation-in-business-survey.html',
    accessedDate: '2024-01-15',
    methodology: 'Survey of 2,620 business leaders globally',
  },
  gartner2023: {
    id: 'gartner2023',
    title: 'Gartner Survey Reveals 45% of Executives Say ChatGPT Has Prompted AI Investment',
    source: 'Gartner',
    year: 2023,
    url: 'https://www.gartner.com/en/newsroom/press-releases',
    accessedDate: '2024-01-15',
    methodology: 'Survey of 2,500+ executive leaders',
  },
  mwpvl2023: {
    id: 'mwpvl2023',
    title: 'Manufacturing Operations Excellence Study',
    source: 'MWPVL International',
    year: 2023,
    methodology: 'Analysis of 500+ manufacturing facilities',
  },
  coalitionFraud2023: {
    id: 'coalitionFraud2023',
    title: 'Insurance Industry Fraud Statistics Report',
    source: 'Coalition Against Insurance Fraud',
    year: 2023,
    url: 'https://insurancefraud.org/fraud-stats/',
    accessedDate: '2024-01-15',
    methodology: 'Industry-wide claims data analysis',
  },
  oeeFoundation: {
    id: 'oeeFoundation',
    title: 'World Class OEE Standards',
    source: 'OEE Foundation',
    year: 2022,
    methodology: 'Global manufacturing benchmarking study',
  },
};

export interface BenchmarkSource {
  citationId: string;
  context: string;
  confidence: 'high' | 'medium' | 'low';
}

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
  sources: BenchmarkSource[];
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
    sources: [
      {
        citationId: 'mckinsey2023',
        context: 'ROI ranges for manufacturing AI implementations',
        confidence: 'high',
      },
      {
        citationId: 'mwpvl2023',
        context: 'OEE improvement benchmarks from 500+ facilities',
        confidence: 'high',
      },
      {
        citationId: 'oeeFoundation',
        context: 'World-class OEE standards (85%+)',
        confidence: 'high',
      },
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
    sources: [
      {
        citationId: 'deloitte2023',
        context: 'Insurance industry AI adoption and ROI metrics',
        confidence: 'high',
      },
      {
        citationId: 'coalitionFraud2023',
        context: 'Fraud detection improvement rates with AI',
        confidence: 'high',
      },
      {
        citationId: 'gartner2023',
        context: 'Claims processing automation benchmarks',
        confidence: 'medium',
      },
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
    sources: [
      {
        citationId: 'mckinsey2023',
        context: 'Healthcare AI implementation ROI estimates',
        confidence: 'medium',
      },
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
    sources: [
      {
        citationId: 'deloitte2023',
        context: 'Agricultural tech AI adoption trends',
        confidence: 'low',
      },
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
