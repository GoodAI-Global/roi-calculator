import { useState } from 'react';
import { ROIResult, Industry, ManufacturingInputs, InsuranceInputs } from '../calculators/types';
import { formatCurrency, formatPercentage, formatDuration } from '../utils/calculations';

interface SavedScenario {
  id: string;
  name: string;
  industry: Industry;
  inputs: ManufacturingInputs | InsuranceInputs;
  result: ROIResult;
  createdAt: Date;
}

interface ScenarioComparisonProps {
  currentIndustry: Industry;
  currentInputs: ManufacturingInputs | InsuranceInputs;
  currentResult: ROIResult;
}

export default function ScenarioComparison({
  currentIndustry,
  currentInputs,
  currentResult,
}: ScenarioComparisonProps) {
  const [scenarios, setScenarios] = useState<SavedScenario[]>([]);
  const [scenarioName, setScenarioName] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSaveForm, setShowSaveForm] = useState(false);

  const handleSaveScenario = () => {
    if (!scenarioName.trim()) return;

    const newScenario: SavedScenario = {
      id: crypto.randomUUID(),
      name: scenarioName.trim().substring(0, 50),
      industry: currentIndustry,
      inputs: { ...currentInputs },
      result: { ...currentResult },
      createdAt: new Date(),
    };

    setScenarios([...scenarios, newScenario]);
    setScenarioName('');
    setShowSaveForm(false);
    setIsExpanded(true);
  };

  const handleDeleteScenario = (id: string) => {
    setScenarios(scenarios.filter((s) => s.id !== id));
  };

  const handleClearAll = () => {
    setScenarios([]);
  };

  // Compare metrics helper
  const getComparisonClass = (current: number, saved: number, higherIsBetter: boolean) => {
    if (current === saved) return 'text-gray-900';
    if (higherIsBetter) {
      return current > saved ? 'text-green-600' : 'text-red-600';
    }
    return current < saved ? 'text-green-600' : 'text-red-600';
  };

  const getDiffIndicator = (current: number, saved: number, higherIsBetter: boolean) => {
    const diff = current - saved;
    if (diff === 0) return '';
    const isPositive = higherIsBetter ? diff > 0 : diff < 0;
    return isPositive ? '↑' : '↓';
  };

  if (scenarios.length === 0 && !showSaveForm) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <svg className="w-5 h-5 mr-2 text-goodai-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Scenario Comparison
          </h2>
        </div>
        <p className="text-gray-600 mb-4">
          Save the current calculation as a scenario to compare different configurations side by side.
        </p>
        <button
          type="button"
          onClick={() => setShowSaveForm(true)}
          className="px-4 py-2 bg-goodai-teal text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Save Current as Scenario
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <svg className="w-5 h-5 mr-2 text-goodai-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Scenario Comparison
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({scenarios.length} saved)
          </span>
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowSaveForm(true)}
            className="px-3 py-1.5 text-sm bg-goodai-teal text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Save Current
          </button>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            aria-label={isExpanded ? 'Collapse comparison' : 'Expand comparison'}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>

      {/* Save Form */}
      {showSaveForm && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              placeholder="Scenario name (e.g., 'Conservative Estimate')"
              maxLength={50}
              aria-label="Enter scenario name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-goodai-teal focus:border-transparent"
              onKeyDown={(e) => e.key === 'Enter' && handleSaveScenario()}
            />
            <button
              type="button"
              onClick={handleSaveScenario}
              disabled={!scenarioName.trim()}
              className="px-4 py-2 bg-goodai-teal text-white rounded-lg hover:bg-teal-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setShowSaveForm(false);
                setScenarioName('');
              }}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Comparison Table */}
      {isExpanded && scenarios.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-3 font-semibold text-gray-700">Metric</th>
                <th className="text-center p-3 font-semibold text-goodai-teal bg-teal-50 border-x border-teal-100">
                  Current
                </th>
                {scenarios.map((scenario) => (
                  <th key={scenario.id} className="text-center p-3 font-semibold text-gray-700">
                    <div className="flex items-center justify-center gap-1">
                      <span className="truncate max-w-[100px]" title={scenario.name}>
                        {scenario.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteScenario(scenario.id)}
                        className="text-gray-400 hover:text-red-500 ml-1"
                        aria-label={`Delete ${scenario.name}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <span className="text-xs font-normal text-gray-400 block">
                      {scenario.industry}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Payback Period */}
              <tr className="border-b">
                <td className="p-3 text-gray-600">Payback Period</td>
                <td className="p-3 text-center font-medium bg-teal-50 border-x border-teal-100">
                  {formatDuration(currentResult.paybackMonths)}
                </td>
                {scenarios.map((scenario) => (
                  <td
                    key={scenario.id}
                    className={`p-3 text-center font-medium ${getComparisonClass(
                      currentResult.paybackMonths,
                      scenario.result.paybackMonths,
                      false
                    )}`}
                  >
                    {formatDuration(scenario.result.paybackMonths)}
                    <span className="ml-1 text-xs">
                      {getDiffIndicator(currentResult.paybackMonths, scenario.result.paybackMonths, false)}
                    </span>
                  </td>
                ))}
              </tr>

              {/* 3-Year ROI */}
              <tr className="border-b">
                <td className="p-3 text-gray-600">3-Year ROI</td>
                <td className="p-3 text-center font-medium bg-teal-50 border-x border-teal-100">
                  {formatPercentage(currentResult.threeYearROI)}
                </td>
                {scenarios.map((scenario) => (
                  <td
                    key={scenario.id}
                    className={`p-3 text-center font-medium ${getComparisonClass(
                      currentResult.threeYearROI,
                      scenario.result.threeYearROI,
                      true
                    )}`}
                  >
                    {formatPercentage(scenario.result.threeYearROI)}
                    <span className="ml-1 text-xs">
                      {getDiffIndicator(currentResult.threeYearROI, scenario.result.threeYearROI, true)}
                    </span>
                  </td>
                ))}
              </tr>

              {/* 3-Year Net Value */}
              <tr className="border-b">
                <td className="p-3 text-gray-600">3-Year Net Value</td>
                <td className="p-3 text-center font-medium bg-teal-50 border-x border-teal-100">
                  {formatCurrency(currentResult.threeYearNetValue)}
                </td>
                {scenarios.map((scenario) => (
                  <td
                    key={scenario.id}
                    className={`p-3 text-center font-medium ${getComparisonClass(
                      currentResult.threeYearNetValue,
                      scenario.result.threeYearNetValue,
                      true
                    )}`}
                  >
                    {formatCurrency(scenario.result.threeYearNetValue)}
                    <span className="ml-1 text-xs">
                      {getDiffIndicator(currentResult.threeYearNetValue, scenario.result.threeYearNetValue, true)}
                    </span>
                  </td>
                ))}
              </tr>

              {/* NPV */}
              <tr className="border-b">
                <td className="p-3 text-gray-600">NPV (5-Year)</td>
                <td className="p-3 text-center font-medium bg-teal-50 border-x border-teal-100">
                  {formatCurrency(currentResult.financialMetrics.npv)}
                </td>
                {scenarios.map((scenario) => (
                  <td
                    key={scenario.id}
                    className={`p-3 text-center font-medium ${getComparisonClass(
                      currentResult.financialMetrics.npv,
                      scenario.result.financialMetrics.npv,
                      true
                    )}`}
                  >
                    {formatCurrency(scenario.result.financialMetrics.npv)}
                    <span className="ml-1 text-xs">
                      {getDiffIndicator(currentResult.financialMetrics.npv, scenario.result.financialMetrics.npv, true)}
                    </span>
                  </td>
                ))}
              </tr>

              {/* IRR */}
              <tr className="border-b">
                <td className="p-3 text-gray-600">IRR</td>
                <td className="p-3 text-center font-medium bg-teal-50 border-x border-teal-100">
                  {currentResult.financialMetrics.irr > 5
                    ? '>500%'
                    : formatPercentage(currentResult.financialMetrics.irr * 100)}
                </td>
                {scenarios.map((scenario) => (
                  <td
                    key={scenario.id}
                    className={`p-3 text-center font-medium ${getComparisonClass(
                      currentResult.financialMetrics.irr,
                      scenario.result.financialMetrics.irr,
                      true
                    )}`}
                  >
                    {scenario.result.financialMetrics.irr > 5
                      ? '>500%'
                      : formatPercentage(scenario.result.financialMetrics.irr * 100)}
                    <span className="ml-1 text-xs">
                      {getDiffIndicator(currentResult.financialMetrics.irr, scenario.result.financialMetrics.irr, true)}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Profitability Index */}
              <tr className="border-b">
                <td className="p-3 text-gray-600">Profitability Index</td>
                <td className="p-3 text-center font-medium bg-teal-50 border-x border-teal-100">
                  {currentResult.financialMetrics.profitabilityIndex.toFixed(2)}x
                </td>
                {scenarios.map((scenario) => (
                  <td
                    key={scenario.id}
                    className={`p-3 text-center font-medium ${getComparisonClass(
                      currentResult.financialMetrics.profitabilityIndex,
                      scenario.result.financialMetrics.profitabilityIndex,
                      true
                    )}`}
                  >
                    {scenario.result.financialMetrics.profitabilityIndex.toFixed(2)}x
                    <span className="ml-1 text-xs">
                      {getDiffIndicator(
                        currentResult.financialMetrics.profitabilityIndex,
                        scenario.result.financialMetrics.profitabilityIndex,
                        true
                      )}
                    </span>
                  </td>
                ))}
              </tr>

              {/* TCO */}
              <tr className="border-b">
                <td className="p-3 text-gray-600">TCO (5-Year)</td>
                <td className="p-3 text-center font-medium bg-teal-50 border-x border-teal-100">
                  {formatCurrency(currentResult.financialMetrics.tco)}
                </td>
                {scenarios.map((scenario) => (
                  <td
                    key={scenario.id}
                    className={`p-3 text-center font-medium ${getComparisonClass(
                      currentResult.financialMetrics.tco,
                      scenario.result.financialMetrics.tco,
                      false
                    )}`}
                  >
                    {formatCurrency(scenario.result.financialMetrics.tco)}
                    <span className="ml-1 text-xs">
                      {getDiffIndicator(currentResult.financialMetrics.tco, scenario.result.financialMetrics.tco, false)}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Monthly Savings */}
              <tr>
                <td className="p-3 text-gray-600">Monthly Savings</td>
                <td className="p-3 text-center font-medium bg-teal-50 border-x border-teal-100">
                  {formatCurrency(currentResult.monthlyRecurringSavings)}
                </td>
                {scenarios.map((scenario) => (
                  <td
                    key={scenario.id}
                    className={`p-3 text-center font-medium ${getComparisonClass(
                      currentResult.monthlyRecurringSavings,
                      scenario.result.monthlyRecurringSavings,
                      true
                    )}`}
                  >
                    {formatCurrency(scenario.result.monthlyRecurringSavings)}
                    <span className="ml-1 text-xs">
                      {getDiffIndicator(
                        currentResult.monthlyRecurringSavings,
                        scenario.result.monthlyRecurringSavings,
                        true
                      )}
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>

          {scenarios.length > 0 && (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleClearAll}
                className="text-sm text-red-600 hover:text-red-700 hover:underline"
              >
                Clear all scenarios
              </button>
            </div>
          )}
        </div>
      )}

      {/* Collapsed State with Summary */}
      {!isExpanded && scenarios.length > 0 && (
        <div className="text-sm text-gray-600">
          <p>
            {scenarios.length} scenario{scenarios.length !== 1 ? 's' : ''} saved.{' '}
            <button type="button" onClick={() => setIsExpanded(true)} className="text-goodai-teal hover:underline">
              Expand to compare
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
