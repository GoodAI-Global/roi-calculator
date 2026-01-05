import { ROIResult } from '../calculators/types';
import { formatCurrency, formatPercentage, formatDuration } from '../utils/calculations';

interface MetricCardProps {
  label: string;
  value: string;
  subValue?: string;
  highlight?: boolean;
  warning?: boolean;
}

function MetricCard({ label, value, subValue, highlight, warning }: MetricCardProps) {
  return (
    <div
      className={`
        p-4 rounded-lg border-2 transition-all
        ${highlight
          ? 'border-goodai-teal bg-goodai-teal/5'
          : warning
            ? 'border-amber-400 bg-amber-50'
            : 'border-gray-200 bg-white'
        }
      `}
    >
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p
        className={`
          text-2xl font-bold
          ${highlight ? 'text-goodai-teal' : warning ? 'text-amber-600' : 'text-gray-900'}
        `}
      >
        {value}
      </p>
      {subValue && (
        <p className="text-xs text-gray-500 mt-1">{subValue}</p>
      )}
    </div>
  );
}

interface ResultsProps {
  result: ROIResult;
}

export default function Results({ result }: ResultsProps) {
  const isNegativeROI = result.firstYearROI < 0;
  const isLongPayback = result.paybackMonths > 24;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="w-8 h-8 bg-goodai-blue text-white rounded-full flex items-center justify-center text-sm mr-3">2</span>
        ROI Results
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard
          label="Payback Period"
          value={formatDuration(result.paybackMonths)}
          warning={isLongPayback}
          subValue={isLongPayback ? 'Longer than typical' : undefined}
        />

        <MetricCard
          label="First Year ROI"
          value={formatPercentage(result.firstYearROI)}
          warning={isNegativeROI}
          subValue={isNegativeROI ? 'Investment not recovered in Y1' : undefined}
        />

        <MetricCard
          label="3-Year ROI"
          value={formatPercentage(result.threeYearROI)}
          highlight={result.threeYearROI > 100}
        />

        <MetricCard
          label="3-Year Net Value"
          value={formatCurrency(result.threeYearNetValue)}
          highlight={result.threeYearNetValue > 0}
        />
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Monthly Breakdown</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Monthly Recurring Savings:</span>
            <span className="ml-2 font-medium text-green-600">
              {formatCurrency(result.monthlyRecurringSavings)}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Total Implementation Cost:</span>
            <span className="ml-2 font-medium text-gray-900">
              {formatCurrency(result.totalImplementationCost)}
            </span>
          </div>
        </div>
      </div>

      {/* Enterprise Financial Metrics */}
      <div className="mt-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-4 border border-slate-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <svg className="w-4 h-4 mr-2 text-goodai-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Enterprise Financial Metrics ({result.financialConfig.analysisYears}-Year Analysis)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="bg-white rounded p-3 border border-slate-100">
            <p className="text-xs text-gray-500 uppercase tracking-wide">NPV</p>
            <p className={`text-lg font-bold ${result.financialMetrics.npv >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(result.financialMetrics.npv)}
            </p>
            <p className="text-xs text-gray-400">at {formatPercentage(result.financialConfig.discountRate * 100)} discount</p>
          </div>
          <div className="bg-white rounded p-3 border border-slate-100">
            <p className="text-xs text-gray-500 uppercase tracking-wide">IRR</p>
            <p className={`text-lg font-bold ${result.financialMetrics.irr > result.financialConfig.discountRate ? 'text-green-600' : 'text-amber-600'}`}>
              {result.financialMetrics.irr > 5 ? '>500%' : formatPercentage(result.financialMetrics.irr * 100)}
            </p>
            <p className="text-xs text-gray-400">
              {result.financialMetrics.irr > result.financialConfig.discountRate ? 'Exceeds hurdle rate' : 'Below hurdle rate'}
            </p>
          </div>
          <div className="bg-white rounded p-3 border border-slate-100">
            <p className="text-xs text-gray-500 uppercase tracking-wide">TCO</p>
            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(result.financialMetrics.tco)}
            </p>
            <p className="text-xs text-gray-400">{result.financialConfig.analysisYears}-year total cost</p>
          </div>
          <div className="bg-white rounded p-3 border border-slate-100">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Profitability Index</p>
            <p className={`text-lg font-bold ${result.financialMetrics.profitabilityIndex >= 1 ? 'text-green-600' : 'text-amber-600'}`}>
              {result.financialMetrics.profitabilityIndex.toFixed(2)}x
            </p>
            <p className="text-xs text-gray-400">
              {result.financialMetrics.profitabilityIndex >= 1 ? 'Value creating' : 'Value destroying'}
            </p>
          </div>
        </div>
        {result.financialMetrics.discountedPaybackMonths !== Infinity && (
          <p className="mt-3 text-xs text-gray-500">
            Discounted payback: {result.financialMetrics.discountedPaybackMonths.toFixed(1)} months (accounting for time value of money)
          </p>
        )}
      </div>

      {(isNegativeROI || isLongPayback) && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> These projections show extended payback.
            Consider adjusting inputs or evaluating non-financial benefits.
          </p>
        </div>
      )}
    </div>
  );
}
