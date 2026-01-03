import { Industry } from '../calculators/types';
import { industryBenchmarks } from '../data/benchmarks';

interface IndustrySelectorProps {
  selectedIndustry: Industry;
  onSelect: (industry: Industry) => void;
}

export default function IndustrySelector({ selectedIndustry, onSelect }: IndustrySelectorProps) {
  const industries: { id: Industry; name: string; enabled: boolean }[] = [
    { id: 'manufacturing', name: 'Manufacturing', enabled: true },
    { id: 'insurance', name: 'Insurance', enabled: true },
    { id: 'healthcare', name: 'Healthcare', enabled: false },
    { id: 'aquaculture', name: 'Aquaculture', enabled: false },
  ];

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Industry
      </label>
      <div className="flex flex-wrap gap-2">
        {industries.map((industry) => (
          <button
            key={industry.id}
            onClick={() => industry.enabled && onSelect(industry.id)}
            disabled={!industry.enabled}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${selectedIndustry === industry.id
                ? 'bg-goodai-teal text-white shadow-md'
                : industry.enabled
                  ? 'bg-white text-gray-700 border border-gray-300 hover:border-goodai-teal hover:text-goodai-teal'
                  : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
              }
            `}
          >
            {industry.name}
            {!industry.enabled && (
              <span className="ml-1 text-xs">(coming soon)</span>
            )}
          </button>
        ))}
      </div>
      {industryBenchmarks[selectedIndustry] && (
        <p className="mt-2 text-sm text-gray-500">
          {industryBenchmarks[selectedIndustry].description}
        </p>
      )}
    </div>
  );
}
