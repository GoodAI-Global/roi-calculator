import { useState } from 'react';
import { ROIResult } from '../calculators/types';

interface AssumptionsProps {
  result: ROIResult;
}

export default function Assumptions({ result }: AssumptionsProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm mr-3">!</span>
        Transparency Report
      </h2>

      {/* Caveats - Always Visible */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-red-700 uppercase tracking-wide mb-3 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Important Caveats
        </h3>
        <ul className="space-y-2">
          {result.caveats.map((caveat, index) => (
            <li key={index} className="flex items-start">
              <span className="text-red-500 mr-2 mt-0.5">•</span>
              <span className="text-sm text-gray-700">{caveat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Assumptions - Collapsible */}
      <div className="border-t pt-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Calculation Assumptions
          </h3>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isExpanded && (
          <ul className="mt-3 space-y-2">
            {result.assumptions.map((assumption, index) => (
              <li key={index} className="flex items-start">
                <span className="text-goodai-teal mr-2 mt-0.5">•</span>
                <span className="text-sm text-gray-600">{assumption}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-500 italic">
          Good AI believes in transparency. Unlike vendor calculators that hide assumptions
          to inflate ROI projections, we show everything. Real decisions require real data.
        </p>
      </div>
    </div>
  );
}
