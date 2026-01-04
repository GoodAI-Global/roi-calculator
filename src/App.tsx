import { useState } from 'react'
import Calculator from './components/Calculator'
import ErrorBoundary from './components/ErrorBoundary'
import { Industry } from './calculators/types'

function App() {
  const [selectedIndustry, setSelectedIndustry] = useState<Industry>('manufacturing')

  return (
    <ErrorBoundary>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-goodai-black text-white py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                <span className="text-goodai-teal">Good AI</span> ROI Calculator
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Evidence-based AI implementation ROI with transparent assumptions
              </p>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-xs text-gray-500">Unlike vendor calculators, we show</p>
              <p className="text-sm text-goodai-teal font-medium">ALL assumptions</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Calculator
          selectedIndustry={selectedIndustry}
          onIndustryChange={setSelectedIndustry}
        />
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-600">
          <p className="mb-2">
            <strong>Methodology:</strong> Calculations based on industry benchmarks (p50 median values).
          </p>
          <p className="text-xs text-gray-500">
            This calculator provides estimates only. Actual results depend on implementation quality,
            data availability, and organizational readiness. Consult with experts before making investment decisions.
          </p>
          <p className="mt-4 text-goodai-teal font-medium">
            Good AI — Evidence over opinions
          </p>
        </div>
      </footer>
    </div>
    </ErrorBoundary>
  )
}

export default App
