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
import { generatePDFReport } from '../utils/pdfExport';
import IndustrySelector from './IndustrySelector';
import MetricsInput from './MetricsInput';
import Results from './Results';
import Assumptions from './Assumptions';
import ScenarioComparison from './ScenarioComparison';
import BenchmarkSources from './BenchmarkSources';
import CalculationAuditTrail from './CalculationAuditTrail';
import ErrorBoundary from './ErrorBoundary';

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

function ChartError() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h3 className="text-lg font-bold text-gray-800">Sensitivity Chart Unavailable</h3>
      </div>
      <p className="text-gray-600 text-sm">
        The sensitivity analysis chart could not be rendered. Your ROI calculations above are still accurate.
        Try refreshing the page if you need to view the chart.
      </p>
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
  const [pdfStatus, setPdfStatus] = useState<'idle' | 'generating' | 'done' | 'error'>('idle');

  // Calculate ROI based on selected industry
  const result: ROIResult = useMemo(() => {
    switch (selectedIndustry) {
      case 'manufacturing':
        return calculateManufacturingROI(manufacturingInputs);
      case 'insurance':
        return calculateInsuranceROI(insuranceInputs);
      case 'healthcare':
      case 'aquaculture':
        // These industries are not yet implemented (disabled in UI)
        // Fall back to manufacturing with a console warning for debugging
        console.warn(`Industry "${selectedIndustry}" is not yet implemented. Using manufacturing calculator.`);
        return calculateManufacturingROI(manufacturingInputs);
      default: {
        // Exhaustive check - TypeScript will error if a new Industry is added without handling
        const _exhaustiveCheck: never = selectedIndustry;
        console.error(`Unexpected industry: ${_exhaustiveCheck}`);
        return calculateManufacturingROI(manufacturingInputs);
      }
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

  // Handle PDF export
  const handleExportPDF = async () => {
    setPdfStatus('generating');
    try {
      const inputs = selectedIndustry === 'manufacturing'
        ? manufacturingInputs
        : insuranceInputs;

      await generatePDFReport({
        industry: selectedIndustry,
        result,
        inputs,
      });
      setPdfStatus('done');
      setTimeout(() => setPdfStatus('idle'), 2000);
    } catch (error) {
      console.error('PDF generation failed:', error);
      setPdfStatus('error');
      setTimeout(() => setPdfStatus('idle'), 2000);
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
            <button
              onClick={handleExportPDF}
              disabled={pdfStatus === 'generating'}
              aria-label={
                pdfStatus === 'generating'
                  ? 'Generating PDF report'
                  : pdfStatus === 'done'
                    ? 'PDF report downloaded'
                    : pdfStatus === 'error'
                      ? 'Failed to generate PDF'
                      : 'Export ROI analysis as PDF report'
              }
              aria-live="polite"
              className={`
                px-4 py-2 text-sm rounded-lg transition-colors flex items-center gap-2
                ${pdfStatus === 'generating'
                  ? 'bg-gray-400 text-white cursor-wait'
                  : pdfStatus === 'done'
                    ? 'bg-green-500 text-white'
                    : pdfStatus === 'error'
                      ? 'bg-red-500 text-white'
                      : 'bg-goodai-blue text-white hover:bg-blue-600'
                }
              `}
            >
              {pdfStatus === 'generating' ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : pdfStatus === 'done' ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Downloaded!
                </>
              ) : pdfStatus === 'error' ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Error
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export PDF
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
        <ErrorBoundary fallback={<ChartError />}>
          <Suspense fallback={<ChartLoading />}>
            <SensitivityChart sensitivity={result.sensitivityAnalysis} />
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* Scenario Comparison */}
      <ScenarioComparison
        currentIndustry={selectedIndustry}
        currentInputs={selectedIndustry === 'manufacturing' ? manufacturingInputs : insuranceInputs}
        currentResult={result}
      />

      {/* Benchmark Sources */}
      <BenchmarkSources industry={selectedIndustry} />

      {/* Calculation Audit Trail */}
      <CalculationAuditTrail
        industry={selectedIndustry}
        inputs={selectedIndustry === 'manufacturing' ? manufacturingInputs : insuranceInputs}
        result={result}
      />
    </div>
  );
}
