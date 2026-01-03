# Good AI ROI Calculator

An interactive, transparent ROI calculator for AI implementations. Unlike vendor calculators that inflate projections with hidden assumptions, this tool shows **everything**.

**[Live Demo](#)** *(placeholder)*

## Philosophy

**Evidence over opinions.** This calculator is built on Good AI's core principles:

- **Transparent assumptions** — Every input visible and editable
- **Conservative estimates** — Uses p50 (median) benchmarks, not optimistic outliers
- **No vendor inflation** — Includes sensitivity analysis and prominent caveats
- **Honest caveats** — Risks and limitations always visible

## Features

- **Manufacturing Calculator** — Predictive maintenance, OEE optimization, downtime reduction
- **Insurance Calculator** — Claims automation, fraud detection improvements
- **Real-time calculations** — Results update as you adjust inputs
- **Sensitivity analysis** — Conservative, expected, and optimistic scenarios
- **Export to JSON** — Full data export for further analysis

## How This Differs from Vendor Calculators

| Typical Vendor Calculator | Good AI Calculator |
|---------------------------|-------------------|
| Hidden assumptions | All assumptions visible |
| p90 (optimistic) benchmarks | p50 (median) benchmarks |
| Single-point estimates | Sensitivity ranges (60%-140%) |
| Caveats buried in fine print | Caveats prominently displayed |
| Fantasy ROI numbers | Conservative, defensible projections |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/good-ai/roi-calculator.git
cd roi-calculator

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

## Calculation Methodology

### Manufacturing ROI

The manufacturing calculator focuses on **predictive maintenance** and **OEE optimization**:

1. **Downtime Reduction** — OEE improvement correlates with downtime reduction at a 2.5x factor (conservative industry benchmark)
2. **Monthly Savings** — `Downtime Hours × Reduction % × Cost per Hour - Maintenance Costs`
3. **Payback Period** — `Implementation Cost ÷ Monthly Net Savings`
4. **ROI Calculation** — Accounts for implementation timeline (no savings during implementation)

**Key Benchmarks:**
- Typical OEE improvement: 5-15 percentage points
- Downtime correlation factor: 2.5x (median)
- Conservative scenario: 60% of expected benefits
- Optimistic scenario: 140% of expected benefits

### Insurance ROI

The insurance calculator covers **claims automation** and **fraud detection**:

1. **Processing Savings** — 40% reduction in claims processing time (conservative benchmark)
2. **Fraud Detection** — 2x improvement in detection rate, capped at 60%
3. **Combined Benefits** — Labor cost savings + fraud prevention savings

## Default Values

### Manufacturing

| Parameter | Default | Notes |
|-----------|---------|-------|
| Current OEE | 65% | Industry average |
| Target Improvement | +10% | Realistic for AI implementation |
| Unplanned Downtime | 40 hrs/month | Typical manufacturing facility |
| Cost per Hour | $5,000 | Includes lost production, labor |
| Implementation Cost | $150,000 | Software, integration, training |
| Monthly Maintenance | $2,000 | Ongoing license and support |
| Timeline | 6 months | Time to measurable results |

### Insurance

| Parameter | Default | Notes |
|-----------|---------|-------|
| Annual Claims Volume | 50,000 | Mid-size insurer |
| Processing Time | 45 min/claim | Manual processing average |
| Labor Cost | $35/hour | Fully loaded |
| Fraud Detection Rate | 15% | Current industry average |
| Avg Fraud Claim | $8,000 | Industry benchmark |
| Implementation Cost | $200,000 | Includes integration |
| Monthly Maintenance | $3,000 | Platform fees |
| Timeline | 9 months | Regulatory approval included |

## Project Structure

```
roi-calculator/
├── src/
│   ├── components/          # React components
│   │   ├── Calculator.tsx   # Main calculator orchestrator
│   │   ├── IndustrySelector.tsx
│   │   ├── MetricsInput.tsx
│   │   ├── Results.tsx
│   │   ├── Assumptions.tsx
│   │   └── SensitivityChart.tsx
│   ├── calculators/         # Calculation logic
│   │   ├── types.ts         # TypeScript interfaces
│   │   ├── manufacturing.ts # Manufacturing ROI logic
│   │   └── insurance.ts     # Insurance ROI logic
│   ├── data/
│   │   └── benchmarks.ts    # Industry benchmark data
│   └── utils/
│       └── calculations.ts  # Utility functions
├── public/
│   └── favicon.ico
└── package.json
```

## Contributing

We welcome contributions! Please ensure:

1. All calculations include visible assumptions
2. Use conservative (p50) benchmarks
3. Include appropriate caveats
4. Test with realistic industry data

## License

MIT License — see [LICENSE](LICENSE)

## About Good AI

Good AI is a premium enterprise AI consultancy focused on **evidence-based** AI implementations. We believe in transparency, conservative estimates, and honest assessments of AI capabilities.

**Contact:** [hello@goodai.com](mailto:hello@goodai.com)

---

*"Evidence over opinions"* — Good AI
