import { useId } from 'react';
import { ManufacturingInputs, InsuranceInputs, Industry } from '../calculators/types';
import { formatCurrency } from '../utils/calculations';

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  formatValue?: (value: number) => string;
  helpText?: string;
}

function SliderInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
  formatValue = (v) => v.toString(),
  helpText,
}: SliderInputProps) {
  const id = useId();
  const numberId = `${id}-number`;
  const sliderId = `${id}-slider`;
  const helpId = helpText ? `${id}-help` : undefined;

  return (
    <div className="mb-4" role="group" aria-labelledby={`${id}-label`}>
      <div className="flex justify-between items-center mb-1">
        <label id={`${id}-label`} htmlFor={numberId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="flex items-center gap-2">
          <input
            id={numberId}
            type="number"
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            min={min}
            max={max}
            step={step}
            aria-describedby={helpId}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            className="w-24 px-2 py-1 text-right text-sm border border-gray-300 rounded focus:ring-2 focus:ring-goodai-teal focus:border-transparent"
          />
          <span className="text-sm text-gray-500 w-16" aria-hidden="true">
            {formatValue(value)}
          </span>
        </div>
      </div>
      <input
        id={sliderId}
        type="range"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        min={min}
        max={max}
        step={step}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={formatValue(value)}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-gray-400" aria-hidden="true">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
      {helpText && (
        <p id={helpId} className="mt-1 text-xs text-gray-500">
          {helpText}
        </p>
      )}
    </div>
  );
}

interface ManufacturingInputFormProps {
  inputs: ManufacturingInputs;
  onChange: (inputs: ManufacturingInputs) => void;
}

function ManufacturingInputForm({ inputs, onChange }: ManufacturingInputFormProps) {
  const updateField = <K extends keyof ManufacturingInputs>(
    field: K,
    value: ManufacturingInputs[K]
  ) => {
    onChange({ ...inputs, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Operations</h3>

      <SliderInput
        label="Current OEE"
        value={inputs.currentOEE * 100}
        onChange={(v) => updateField('currentOEE', v / 100)}
        min={30}
        max={95}
        step={1}
        formatValue={(v) => `${v.toFixed(0)}%`}
        helpText="Overall Equipment Effectiveness - world class is 85%+"
      />

      <SliderInput
        label="Target OEE Improvement"
        value={inputs.targetOEEImprovement * 100}
        onChange={(v) => updateField('targetOEEImprovement', v / 100)}
        min={1}
        max={25}
        step={1}
        formatValue={(v) => `+${v.toFixed(0)}%`}
        helpText="Realistic improvements are 5-15 percentage points"
      />

      <SliderInput
        label="Unplanned Downtime (hours/month)"
        value={inputs.unplannedDowntimeHoursPerMonth}
        onChange={(v) => updateField('unplannedDowntimeHoursPerMonth', v)}
        min={0}
        max={200}
        step={5}
        formatValue={(v) => `${v}h`}
      />

      <SliderInput
        label="Cost per Downtime Hour"
        value={inputs.costPerDowntimeHour}
        onChange={(v) => updateField('costPerDowntimeHour', v)}
        min={500}
        max={50000}
        step={500}
        formatValue={(v) => formatCurrency(v)}
        helpText="Include lost production, labor, and opportunity costs"
      />

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-4">Investment</h3>

      <SliderInput
        label="Implementation Cost"
        value={inputs.implementationCost}
        onChange={(v) => updateField('implementationCost', v)}
        min={25000}
        max={1000000}
        step={5000}
        formatValue={(v) => formatCurrency(v)}
        helpText="Total implementation including software, integration, and training"
      />

      <SliderInput
        label="Monthly Maintenance Cost"
        value={inputs.monthlyMaintenanceCost}
        onChange={(v) => updateField('monthlyMaintenanceCost', v)}
        min={0}
        max={20000}
        step={500}
        formatValue={(v) => formatCurrency(v)}
        helpText="Ongoing license, support, and maintenance costs"
      />

      <SliderInput
        label="Implementation Timeline"
        value={inputs.timelineMonths}
        onChange={(v) => updateField('timelineMonths', v)}
        min={1}
        max={24}
        step={1}
        formatValue={(v) => `${v} mo`}
        helpText="Time to full deployment and measurable results"
      />
    </div>
  );
}

interface InsuranceInputFormProps {
  inputs: InsuranceInputs;
  onChange: (inputs: InsuranceInputs) => void;
}

function InsuranceInputForm({ inputs, onChange }: InsuranceInputFormProps) {
  const updateField = <K extends keyof InsuranceInputs>(field: K, value: InsuranceInputs[K]) => {
    onChange({ ...inputs, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Claims Operations</h3>

      <SliderInput
        label="Annual Claims Volume"
        value={inputs.annualClaimsVolume}
        onChange={(v) => updateField('annualClaimsVolume', v)}
        min={1000}
        max={500000}
        step={1000}
        formatValue={(v) => v.toLocaleString()}
      />

      <SliderInput
        label="Average Processing Time (minutes)"
        value={inputs.averageClaimProcessingTimeMinutes}
        onChange={(v) => updateField('averageClaimProcessingTimeMinutes', v)}
        min={5}
        max={120}
        step={5}
        formatValue={(v) => `${v} min`}
      />

      <SliderInput
        label="Labor Cost per Hour"
        value={inputs.laborCostPerHour}
        onChange={(v) => updateField('laborCostPerHour', v)}
        min={15}
        max={100}
        step={5}
        formatValue={(v) => formatCurrency(v)}
        helpText="Fully loaded cost including benefits"
      />

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-4">Fraud Detection</h3>

      <SliderInput
        label="Current Fraud Detection Rate"
        value={inputs.currentFraudDetectionRate * 100}
        onChange={(v) => updateField('currentFraudDetectionRate', v / 100)}
        min={5}
        max={50}
        step={1}
        formatValue={(v) => `${v.toFixed(0)}%`}
        helpText="Percentage of fraudulent claims currently caught"
      />

      <SliderInput
        label="Average Fraudulent Claim Value"
        value={inputs.averageFraudClaimValue}
        onChange={(v) => updateField('averageFraudClaimValue', v)}
        min={1000}
        max={50000}
        step={500}
        formatValue={(v) => formatCurrency(v)}
      />

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-4">Investment</h3>

      <SliderInput
        label="Implementation Cost"
        value={inputs.implementationCost}
        onChange={(v) => updateField('implementationCost', v)}
        min={50000}
        max={2000000}
        step={10000}
        formatValue={(v) => formatCurrency(v)}
      />

      <SliderInput
        label="Monthly Maintenance Cost"
        value={inputs.monthlyMaintenanceCost}
        onChange={(v) => updateField('monthlyMaintenanceCost', v)}
        min={0}
        max={30000}
        step={500}
        formatValue={(v) => formatCurrency(v)}
      />

      <SliderInput
        label="Implementation Timeline"
        value={inputs.timelineMonths}
        onChange={(v) => updateField('timelineMonths', v)}
        min={3}
        max={36}
        step={1}
        formatValue={(v) => `${v} mo`}
      />
    </div>
  );
}

interface MetricsInputProps {
  industry: Industry;
  manufacturingInputs: ManufacturingInputs;
  insuranceInputs: InsuranceInputs;
  onManufacturingChange: (inputs: ManufacturingInputs) => void;
  onInsuranceChange: (inputs: InsuranceInputs) => void;
}

export default function MetricsInput({
  industry,
  manufacturingInputs,
  insuranceInputs,
  onManufacturingChange,
  onInsuranceChange,
}: MetricsInputProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="w-8 h-8 bg-goodai-teal text-white rounded-full flex items-center justify-center text-sm mr-3">
          1
        </span>
        Input Your Metrics
      </h2>

      {industry === 'manufacturing' && (
        <ManufacturingInputForm inputs={manufacturingInputs} onChange={onManufacturingChange} />
      )}

      {industry === 'insurance' && (
        <InsuranceInputForm inputs={insuranceInputs} onChange={onInsuranceChange} />
      )}
    </div>
  );
}
