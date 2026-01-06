import { useState } from 'react';
import { ROIResult, Industry, ManufacturingInputs, InsuranceInputs } from '../calculators/types';
import { formatCurrency, formatPercentage } from '../utils/calculations';

interface AuditStep {
  id: string;
  label: string;
  formula: string;
  inputs: { name: string; value: string }[];
  result: string;
  explanation: string;
}

interface CalculationAuditTrailProps {
  industry: Industry;
  inputs: ManufacturingInputs | InsuranceInputs;
  result: ROIResult;
}

function generateManufacturingAuditSteps(
  inputs: ManufacturingInputs,
  result: ROIResult
): AuditStep[] {
  const downtimeReductionPercent = inputs.targetOEEImprovement * 2.5;
  const monthlyDowntimeSavings =
    inputs.unplannedDowntimeHoursPerMonth * downtimeReductionPercent * inputs.costPerDowntimeHour;

  return [
    {
      id: 'step1',
      label: 'Calculate Downtime Reduction %',
      formula: 'Downtime Reduction = OEE Improvement × 2.5 (correlation factor)',
      inputs: [
        {
          name: 'Target OEE Improvement',
          value: formatPercentage(inputs.targetOEEImprovement * 100),
        },
        { name: 'Correlation Factor', value: '2.5' },
      ],
      result: formatPercentage(downtimeReductionPercent * 100),
      explanation:
        'Industry studies show OEE improvements correlate with downtime reduction at approximately 2.5x factor (conservative median estimate).',
    },
    {
      id: 'step2',
      label: 'Calculate Monthly Downtime Savings',
      formula: 'Monthly Savings = Downtime Hours × Reduction % × Cost per Hour',
      inputs: [
        { name: 'Monthly Downtime Hours', value: `${inputs.unplannedDowntimeHoursPerMonth}h` },
        { name: 'Downtime Reduction', value: formatPercentage(downtimeReductionPercent * 100) },
        { name: 'Cost per Hour', value: formatCurrency(inputs.costPerDowntimeHour) },
      ],
      result: formatCurrency(monthlyDowntimeSavings),
      explanation:
        'Total potential monthly savings from reduced unplanned downtime based on your current costs.',
    },
    {
      id: 'step3',
      label: 'Calculate Net Monthly Recurring Savings',
      formula: 'Net Savings = Monthly Downtime Savings - Monthly Maintenance Cost',
      inputs: [
        { name: 'Monthly Downtime Savings', value: formatCurrency(monthlyDowntimeSavings) },
        { name: 'Monthly Maintenance', value: formatCurrency(inputs.monthlyMaintenanceCost) },
      ],
      result: formatCurrency(result.monthlyRecurringSavings),
      explanation: 'Net savings after subtracting ongoing maintenance and licensing costs.',
    },
    {
      id: 'step4',
      label: 'Calculate Simple Payback Period',
      formula: 'Payback = Implementation Cost ÷ Net Monthly Savings',
      inputs: [
        { name: 'Implementation Cost', value: formatCurrency(inputs.implementationCost) },
        { name: 'Net Monthly Savings', value: formatCurrency(result.monthlyRecurringSavings) },
      ],
      result: `${result.paybackMonths.toFixed(1)} months`,
      explanation: 'Time required to recover the initial investment through monthly savings.',
    },
    {
      id: 'step5',
      label: 'Calculate First Year ROI',
      formula:
        'Year 1 ROI = ((Savings × Months After Implementation) - Investment) ÷ Investment × 100',
      inputs: [
        {
          name: 'Months After Implementation',
          value: `${Math.max(0, 12 - inputs.timelineMonths)}`,
        },
        { name: 'Net Monthly Savings', value: formatCurrency(result.monthlyRecurringSavings) },
        { name: 'Implementation Cost', value: formatCurrency(inputs.implementationCost) },
      ],
      result: formatPercentage(result.firstYearROI),
      explanation: 'Return on investment for Year 1, accounting for the implementation timeline.',
    },
    {
      id: 'step6',
      label: 'Calculate 3-Year Net Value',
      formula: '3-Year Value = (Year 1 Savings) + (24 months × Net Savings) - Investment',
      inputs: [
        {
          name: 'Total 3-Year Savings',
          value: formatCurrency(result.threeYearNetValue + inputs.implementationCost),
        },
        { name: 'Implementation Cost', value: formatCurrency(inputs.implementationCost) },
      ],
      result: formatCurrency(result.threeYearNetValue),
      explanation: 'Total net value generated over 3 years after implementation costs.',
    },
    {
      id: 'step7',
      label: 'Calculate 5-Year NPV',
      formula: 'NPV = Σ(Cash Flow_t ÷ (1 + r)^t) - Initial Investment',
      inputs: [
        {
          name: 'Discount Rate',
          value: formatPercentage(result.financialConfig.discountRate * 100),
        },
        { name: 'Analysis Period', value: `${result.financialConfig.analysisYears} years` },
        { name: 'Initial Investment', value: formatCurrency(inputs.implementationCost) },
      ],
      result: formatCurrency(result.financialMetrics.npv),
      explanation:
        'Net Present Value accounts for the time value of money using the specified discount rate.',
    },
  ];
}

function generateInsuranceAuditSteps(inputs: InsuranceInputs, result: ROIResult): AuditStep[] {
  const currentAnnualProcessingHours =
    (inputs.annualClaimsVolume * inputs.averageClaimProcessingTimeMinutes) / 60;
  const processingSavingsPercent = 0.4;
  const annualHoursSaved = currentAnnualProcessingHours * processingSavingsPercent;
  const annualProcessingSavings = annualHoursSaved * inputs.laborCostPerHour;
  const monthlyProcessingSavings = annualProcessingSavings / 12;

  const estimatedFraudulentClaims = inputs.annualClaimsVolume * 0.02;
  const newFraudDetectionRate = Math.min(0.6, inputs.currentFraudDetectionRate * 2);
  const additionalFraudCaught =
    estimatedFraudulentClaims * (newFraudDetectionRate - inputs.currentFraudDetectionRate);
  const annualFraudSavings = additionalFraudCaught * inputs.averageFraudClaimValue;
  const monthlyFraudSavings = annualFraudSavings / 12;

  return [
    {
      id: 'step1',
      label: 'Calculate Current Processing Hours',
      formula: 'Processing Hours = Claims Volume × Avg Time per Claim ÷ 60',
      inputs: [
        { name: 'Annual Claims', value: inputs.annualClaimsVolume.toLocaleString() },
        { name: 'Avg Processing Time', value: `${inputs.averageClaimProcessingTimeMinutes} min` },
      ],
      result: `${currentAnnualProcessingHours.toLocaleString()} hours/year`,
      explanation:
        'Total annual processing time based on current claims volume and average handling time.',
    },
    {
      id: 'step2',
      label: 'Calculate Processing Time Savings',
      formula: 'Savings = Hours × 40% Reduction × Labor Cost',
      inputs: [
        {
          name: 'Current Processing Hours',
          value: `${currentAnnualProcessingHours.toLocaleString()}h`,
        },
        { name: 'Time Reduction', value: '40% (conservative benchmark)' },
        { name: 'Labor Cost per Hour', value: formatCurrency(inputs.laborCostPerHour) },
      ],
      result: formatCurrency(monthlyProcessingSavings) + '/month',
      explanation:
        'AI-assisted processing typically reduces claims handling time by 40% (industry benchmark).',
    },
    {
      id: 'step3',
      label: 'Calculate Fraud Detection Improvement',
      formula: 'Additional Detection = Fraudulent Claims × (New Rate - Current Rate)',
      inputs: [
        {
          name: 'Est. Fraudulent Claims',
          value: Math.round(estimatedFraudulentClaims).toLocaleString(),
        },
        {
          name: 'Current Detection Rate',
          value: formatPercentage(inputs.currentFraudDetectionRate * 100),
        },
        { name: 'New Detection Rate', value: formatPercentage(newFraudDetectionRate * 100) },
      ],
      result: `${Math.round(additionalFraudCaught).toLocaleString()} additional claims caught`,
      explanation:
        'AI fraud detection typically doubles detection rates (capped at 60% to avoid false positives).',
    },
    {
      id: 'step4',
      label: 'Calculate Fraud Savings',
      formula: 'Fraud Savings = Additional Claims Caught × Avg Fraud Value',
      inputs: [
        {
          name: 'Additional Claims Caught',
          value: Math.round(additionalFraudCaught).toLocaleString(),
        },
        {
          name: 'Avg Fraudulent Claim Value',
          value: formatCurrency(inputs.averageFraudClaimValue),
        },
      ],
      result: formatCurrency(monthlyFraudSavings) + '/month',
      explanation: 'Value saved by catching additional fraudulent claims.',
    },
    {
      id: 'step5',
      label: 'Calculate Total Monthly Savings',
      formula: 'Total = Processing Savings + Fraud Savings - Maintenance',
      inputs: [
        { name: 'Processing Savings', value: formatCurrency(monthlyProcessingSavings) },
        { name: 'Fraud Savings', value: formatCurrency(monthlyFraudSavings) },
        { name: 'Monthly Maintenance', value: formatCurrency(inputs.monthlyMaintenanceCost) },
      ],
      result: formatCurrency(result.monthlyRecurringSavings),
      explanation: 'Net monthly savings after all costs.',
    },
    {
      id: 'step6',
      label: 'Calculate Payback Period',
      formula: 'Payback = Implementation Cost ÷ Net Monthly Savings',
      inputs: [
        { name: 'Implementation Cost', value: formatCurrency(inputs.implementationCost) },
        { name: 'Net Monthly Savings', value: formatCurrency(result.monthlyRecurringSavings) },
      ],
      result: `${result.paybackMonths.toFixed(1)} months`,
      explanation: 'Time to recover initial investment.',
    },
    {
      id: 'step7',
      label: 'Calculate 5-Year NPV',
      formula: 'NPV = Σ(Cash Flow_t ÷ (1 + r)^t) - Initial Investment',
      inputs: [
        {
          name: 'Discount Rate',
          value: formatPercentage(result.financialConfig.discountRate * 100),
        },
        { name: 'Analysis Period', value: `${result.financialConfig.analysisYears} years` },
      ],
      result: formatCurrency(result.financialMetrics.npv),
      explanation: 'Net Present Value with time value of money adjustment.',
    },
  ];
}

export default function CalculationAuditTrail({
  industry,
  inputs,
  result,
}: CalculationAuditTrailProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

  const steps =
    industry === 'manufacturing'
      ? generateManufacturingAuditSteps(inputs as ManufacturingInputs, result)
      : generateInsuranceAuditSteps(inputs as InsuranceInputs, result);

  const toggleStep = (stepId: string) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  const expandAll = () => {
    setExpandedSteps(new Set(steps.map((s) => s.id)));
  };

  const collapseAll = () => {
    setExpandedSteps(new Set());
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
        aria-expanded={isExpanded}
        aria-label={
          isExpanded ? 'Collapse calculation audit trail' : 'Expand calculation audit trail'
        }
      >
        <h2 className="text-lg font-bold text-gray-800 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-goodai-blue"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
          Calculation Audit Trail
        </h2>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {!isExpanded && (
        <p className="mt-2 text-sm text-gray-500">
          Full transparency: see exactly how each number is calculated.
        </p>
      )}

      {isExpanded && (
        <div className="mt-4">
          <div className="flex justify-end gap-2 mb-4">
            <button
              type="button"
              onClick={expandAll}
              className="text-sm text-goodai-teal hover:underline"
            >
              Expand All
            </button>
            <span className="text-gray-300">|</span>
            <button
              type="button"
              onClick={collapseAll}
              className="text-sm text-gray-500 hover:underline"
            >
              Collapse All
            </button>
          </div>

          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={step.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleStep(step.id)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                  aria-expanded={expandedSteps.has(step.id)}
                  aria-label={`${step.label}: ${step.result}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-goodai-teal text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="font-medium text-gray-800">{step.label}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-goodai-teal">{step.result}</span>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        expandedSteps.has(step.id) ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                {expandedSteps.has(step.id) && (
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Formula:</p>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-800">
                        {step.formula}
                      </code>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Inputs:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {step.inputs.map((input) => (
                          <div
                            key={input.name}
                            className="flex justify-between text-sm bg-gray-50 p-2 rounded"
                          >
                            <span className="text-gray-600">{input.name}:</span>
                            <span className="font-medium text-gray-900">{input.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 italic">{step.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-500">
              <strong>Audit Trail Purpose:</strong> This breakdown ensures full transparency in our
              ROI calculations. All formulas use conservative, industry-standard assumptions. For
              detailed methodology, see our benchmark sources.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
