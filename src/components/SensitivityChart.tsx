import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';
import { SensitivityAnalysis } from '../calculators/types';
import { formatCurrency, formatDuration } from '../utils/calculations';

interface SensitivityChartProps {
  sensitivity: SensitivityAnalysis;
}

export default function SensitivityChart({ sensitivity }: SensitivityChartProps) {
  const roiData = [
    {
      name: 'Conservative',
      value: sensitivity.conservative.threeYearROI,
      color: '#f59e0b',
    },
    {
      name: 'Expected',
      value: sensitivity.expected.threeYearROI,
      color: '#4ECDC4',
    },
    {
      name: 'Optimistic',
      value: sensitivity.optimistic.threeYearROI,
      color: '#4A90E2',
    },
  ];

  const paybackData = [
    {
      name: 'Conservative',
      value: Math.min(sensitivity.conservative.paybackMonths, 60),
      actual: sensitivity.conservative.paybackMonths,
      color: '#f59e0b',
    },
    {
      name: 'Expected',
      value: Math.min(sensitivity.expected.paybackMonths, 60),
      actual: sensitivity.expected.paybackMonths,
      color: '#4ECDC4',
    },
    {
      name: 'Optimistic',
      value: Math.min(sensitivity.optimistic.paybackMonths, 60),
      actual: sensitivity.optimistic.paybackMonths,
      color: '#4A90E2',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="w-8 h-8 bg-goodai-teal text-white rounded-full flex items-center justify-center text-sm mr-3">3</span>
        Sensitivity Analysis
      </h2>

      <p className="text-sm text-gray-600 mb-6">
        Results vary based on implementation success. Conservative assumes 60% of expected benefits,
        optimistic assumes 140%.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* 3-Year ROI Chart */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-4 text-center">3-Year ROI by Scenario</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roiData} layout="vertical" margin={{ left: 20, right: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis
                  type="number"
                  tickFormatter={(value) => `${value}%`}
                  domain={[0, 'auto']}
                />
                <YAxis type="category" dataKey="name" width={80} />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(1)}%`, '3-Year ROI']}
                  contentStyle={{ borderRadius: '8px' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {roiData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList
                    dataKey="value"
                    position="right"
                    formatter={(value: number) => `${value.toFixed(0)}%`}
                    style={{ fontSize: '12px', fill: '#374151' }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payback Period Chart */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-4 text-center">Payback Period by Scenario</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paybackData} layout="vertical" margin={{ left: 20, right: 60 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis
                  type="number"
                  tickFormatter={(value) => `${value}mo`}
                  domain={[0, 'auto']}
                />
                <YAxis type="category" dataKey="name" width={80} />
                <Tooltip
                  formatter={(_value, _name, props) => {
                    const actual = (props?.payload as { actual?: number })?.actual;
                    return actual !== undefined ? [formatDuration(actual), 'Payback'] : ['-', 'Payback'];
                  }}
                  contentStyle={{ borderRadius: '8px' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {paybackData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList
                    dataKey="actual"
                    position="right"
                    formatter={(value: number) => formatDuration(value)}
                    style={{ fontSize: '11px', fill: '#374151' }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 font-medium text-gray-600">Scenario</th>
              <th className="text-right py-2 font-medium text-gray-600">Payback</th>
              <th className="text-right py-2 font-medium text-gray-600">3-Year ROI</th>
              <th className="text-right py-2 font-medium text-gray-600">3-Year Net Value</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="py-2 text-amber-600 font-medium">Conservative (60%)</td>
              <td className="py-2 text-right">{formatDuration(sensitivity.conservative.paybackMonths)}</td>
              <td className="py-2 text-right">{sensitivity.conservative.threeYearROI.toFixed(1)}%</td>
              <td className="py-2 text-right">{formatCurrency(sensitivity.conservative.threeYearNetValue)}</td>
            </tr>
            <tr className="border-b border-gray-100 bg-goodai-teal/5">
              <td className="py-2 text-goodai-teal font-medium">Expected (100%)</td>
              <td className="py-2 text-right font-medium">{formatDuration(sensitivity.expected.paybackMonths)}</td>
              <td className="py-2 text-right font-medium">{sensitivity.expected.threeYearROI.toFixed(1)}%</td>
              <td className="py-2 text-right font-medium">{formatCurrency(sensitivity.expected.threeYearNetValue)}</td>
            </tr>
            <tr>
              <td className="py-2 text-goodai-blue font-medium">Optimistic (140%)</td>
              <td className="py-2 text-right">{formatDuration(sensitivity.optimistic.paybackMonths)}</td>
              <td className="py-2 text-right">{sensitivity.optimistic.threeYearROI.toFixed(1)}%</td>
              <td className="py-2 text-right">{formatCurrency(sensitivity.optimistic.threeYearNetValue)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
