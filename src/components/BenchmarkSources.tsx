import { useState } from 'react';
import { Industry } from '../calculators/types';
import { industryBenchmarks, benchmarkCitations } from '../data/benchmarks';

interface BenchmarkSourcesProps {
  industry: Industry;
}

export default function BenchmarkSources({ industry }: BenchmarkSourcesProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const benchmark = industryBenchmarks[industry];
  if (!benchmark?.sources) return null;

  const sources = benchmark.sources
    .map((source) => ({
      ...source,
      citation: benchmarkCitations[source.citationId],
    }))
    .filter((s) => s.citation);

  if (sources.length === 0) return null;

  const getConfidenceBadge = (confidence: 'high' | 'medium' | 'low') => {
    switch (confidence) {
      case 'high':
        return (
          <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
            High Confidence
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
            Medium Confidence
          </span>
        );
      case 'low':
        return (
          <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
            Low Confidence
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
        aria-expanded={isExpanded}
        aria-label={isExpanded ? 'Collapse benchmark sources' : 'Expand benchmark sources'}
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
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          Benchmark Sources
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({sources.length} citation{sources.length !== 1 ? 's' : ''})
          </span>
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
          Our calculations are based on peer-reviewed industry studies. Click to view sources.
        </p>
      )}

      {isExpanded && (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-gray-600">
            Good AI uses conservative, evidence-based benchmarks from reputable industry sources.
            All calculations use p50 (median) values rather than optimistic vendor claims.
          </p>

          <div className="space-y-3">
            {sources.map((source) => (
              <div
                key={source.citationId}
                className="p-4 bg-gray-50 rounded-lg border border-gray-100"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{source.citation.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {source.citation.source} ({source.citation.year})
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      <span className="font-medium">Used for:</span> {source.context}
                    </p>
                    {source.citation.methodology && (
                      <p className="text-xs text-gray-400 mt-1">
                        <span className="font-medium">Methodology:</span>{' '}
                        {source.citation.methodology}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getConfidenceBadge(source.confidence)}
                    {source.citation.url && (
                      <a
                        href={source.citation.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-goodai-blue hover:underline flex items-center gap-1"
                      >
                        View Source
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note on Methodology:</strong> We deliberately use conservative estimates
              (p50/median values) rather than optimistic outliers to provide realistic expectations
              for ROI calculations. Actual results depend on implementation quality, data
              availability, and organizational factors.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
