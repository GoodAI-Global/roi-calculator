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
