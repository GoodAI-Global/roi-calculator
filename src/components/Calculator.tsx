import { useState, useMemo, lazy, Suspense } from 'react';
import {
  Industry,
  ManufacturingInputs,
  InsuranceInputs,
  ROIResult,
  manufacturingDefaults,
  insuranceDefaults,
} from '../calculators/types';
import { calculateManufacturingROI } from '../calculators/manufacturing';
import { calculateInsuranceROI } from '../calculators/insurance';
import { copyToClipboard } from '../utils/calculations';
import IndustrySelector from './IndustrySelector';
import MetricsInput from './MetricsInput';
import Results from './Results';
import Assumptions from './Assumptions';

// Lazy load the chart component (uses recharts - largest dependency)
const SensitivityChart = lazy(() => import('./SensitivityChart'));

function ChartLoading() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
      <div className="h-64 bg-gray-100 rounded"></div>
    </div>
  );
}

interface CalculatorProps {
  selectedIndustry: Industry;
  onIndustryChange: (industry: Industry) => void;
}

export default function Calculator({ selectedIndustry, onIndustryChange }: CalculatorProps) {
  const [manufacturingInputs, setManufacturingInputs] = useState<ManufacturingInputs>(manufacturingDefaults);
  const [insuranceInputs, setInsuranceInputs] = useState<InsuranceInputs>(insuranceDefaults);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  // Calculate ROI based on selected industry
  const result: ROIResult = useMemo(() => {
    switch (selectedIndustry) {
      case 'manufacturing':
        return calculateManufacturingROI(manufacturingInputs);
      case 'insurance':
        return calculateInsuranceROI(insuranceInputs);
      default:
        return calculateManufacturingROI(manufacturingInputs);
    }
  }, [selectedIndustry, manufacturingInputs, insuranceInputs]);

  // Handle export to JSON
  const handleCopyJSON = async () => {
    const exportData = {
      calculator: 'Good AI ROI Calculator',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      industry: selectedIndustry,
      inputs: selectedIndustry === 'manufacturing' ? manufacturingInputs : insuranceInputs,
      results: {
        paybackMonths: result.paybackMonths,
        firstYearROI: result.firstYearROI,
        threeYearROI: result.threeYearROI,
        threeYearNetValue: result.threeYearNetValue,
        monthlyRecurringSavings: result.monthlyRecurringSavings,
      },
      sensitivityAnalysis: result.sensitivityAnalysis,
      assumptions: result.assumptions,
      caveats: result.caveats,
      disclaimer: 'These calculations are estimates based on industry benchmarks. Actual results may vary significantly based on implementation quality, data availability, and organizational factors.',
    };

    const success = await copyToClipboard(JSON.stringify(exportData, null, 2));
    setCopyStatus(success ? 'copied' : 'error');
    setTimeout(() => setCopyStatus('idle'), 2000);
  };

  // Handle reset to defaults
  const handleReset = () => {
    if (selectedIndustry === 'manufacturing') {
      setManufacturingInputs(manufacturingDefaults);
    } else if (selectedIndustry === 'insurance') {
      setInsuranceInputs(insuranceDefaults);
    }
  };

  return (
    <div>
      <IndustrySelector
        selectedIndustry={selectedIndustry}
        onSelect={onIndustryChange}
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Inputs */}
        <div>
          <MetricsInput
            industry={selectedIndustry}
            manufacturingInputs={manufacturingInputs}
            insuranceInputs={insuranceInputs}
            onManufacturingChange={setManufacturingInputs}
            onInsuranceChange={setInsuranceInputs}
          />

          {/* Action Buttons */}
          <div className="mt-4 flex gap-3" role="group" aria-label="Calculator actions">
            <button
              onClick={handleReset}
              aria-label="Reset all inputs to default values"
              className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset to Defaults
            </button>
            <button
              onClick={handleCopyJSON}
              aria-label={
                copyStatus === 'copied'
                  ? 'Calculation results copied to clipboard'
                  : copyStatus === 'error'
                    ? 'Failed to copy results'
                    : 'Copy calculation results as JSON to clipboard'
              }
              aria-live="polite"
              className={`
                px-4 py-2 text-sm rounded-lg transition-colors flex items-center gap-2
                ${copyStatus === 'copied'
                  ? 'bg-green-500 text-white'
                  : copyStatus === 'error'
                    ? 'bg-red-500 text-white'
                    : 'bg-goodai-black text-white hover:bg-gray-800'
                }
              `}
            >
              {copyStatus === 'copied' ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : copyStatus === 'error' ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Error
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copy as JSON
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="space-y-6">
          <Results result={result} />
          <Assumptions result={result} />
        </div>
      </div>

      {/* Full Width - Sensitivity Analysis */}
      <div className="mt-6">
        <Suspense fallback={<ChartLoading />}>
          <SensitivityChart sensitivity={result.sensitivityAnalysis} />
        </Suspense>
      </div>
    </div>
  );
}
