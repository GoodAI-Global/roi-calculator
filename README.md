# Good AI ROI Calculator

An interactive ROI calculator for AI implementations with transparent assumptions and conservative estimates.

## What This Is

- A **client-side React application** for calculating AI implementation ROI
- **Manufacturing & Insurance calculators** with industry-specific metrics
- **Transparent calculations** — all assumptions visible and editable
- **Conservative estimates** — uses p50 (median) benchmarks, not optimistic outliers
- **Sensitivity analysis** — shows conservative, expected, and optimistic scenarios
- **Enterprise financial metrics** — NPV, IRR, TCO, profitability index

## What This Is NOT

- **Not production-ready** — this is v0.x software under active development
- **Not financial advice** — projections are estimates based on industry benchmarks
- **Not a backend service** — all calculations run client-side, no data is stored
- **Not vendor-certified** — benchmarks are from public industry research
- **Not complete** — Healthcare and Aquaculture calculators are planned but not implemented

## Quickstart

```bash
# Clone and install (Node.js 18+ required)
git clone https://github.com/good-ai/roi-calculator.git
cd roi-calculator
npm install

# Run development server
npm run dev
# Open http://localhost:5173

# Or use Make
make setup
make dev
```

## Available Commands

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run test       # Run tests
npm run lint       # Run ESLint
npm run typecheck  # TypeScript check
```

## Project Status

| Feature | Status |
|---------|--------|
| Manufacturing Calculator | Implemented |
| Insurance Calculator | Implemented |
| PDF Export | Implemented |
| Scenario Comparison | Implemented |
| Healthcare Calculator | Planned |
| Aquaculture Calculator | Planned |
| Data Persistence | Not Planned |

## Calculation Methodology

### Manufacturing ROI
- **Downtime Reduction**: OEE improvement correlates with downtime reduction at 2.5x factor
- **Savings**: `Downtime Hours × Reduction % × Cost per Hour - Maintenance Costs`
- **Sensitivity**: Conservative (60%), Expected (100%), Optimistic (140%)

### Insurance ROI
- **Processing Savings**: 40% reduction in claims processing time
- **Fraud Detection**: 2x improvement in detection rate, capped at 60%

### Financial Metrics
- **NPV**: Net Present Value at 10% discount rate over 3 years
- **IRR**: Internal Rate of Return using Newton-Raphson method
- **TCO**: Total Cost of Ownership with 3% inflation adjustment

## Test Coverage

```
88 tests across 5 test files:
- Financial calculations (33 tests)
- Manufacturing calculator (17 tests)
- Insurance calculator (15 tests)
- Calculations utilities (13 tests)
- Sensitivity analysis (10 tests)
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Security

See [SECURITY.md](SECURITY.md) for reporting vulnerabilities.

## License

MIT License — see [LICENSE](LICENSE)

---

*Built by Good AI — "Evidence over opinions"*
