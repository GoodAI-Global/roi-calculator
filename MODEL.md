# ROI Calculator Model Documentation

> **Version**: 1.0.0 | **Last Updated**: 2026-01-06

This document provides full transparency into the calculations, formulas, variables, and assumptions used in the Good AI ROI Calculator.

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Manufacturing ROI Model](#manufacturing-roi-model)
3. [Insurance ROI Model](#insurance-roi-model)
4. [Financial Metrics](#financial-metrics)
5. [Sensitivity Analysis](#sensitivity-analysis)
6. [Variable Reference](#variable-reference)
7. [Sources & Benchmarks](#sources--benchmarks)
8. [Limitations & Caveats](#limitations--caveats)

---

## Design Philosophy

The Good AI ROI Calculator follows these principles:

- **Conservative Estimates**: Uses p50 (median) benchmarks, not optimistic vendor claims
- **Transparency**: All assumptions are visible and documented
- **Reproducibility**: Deterministic calculations that can be independently verified
- **Division Safety**: All calculations protect against division by zero

---

## Manufacturing ROI Model

### Core Formula

```
downtimeReductionPercent = targetOEEImprovement × 2.5
monthlyDowntimeSavings = unplannedDowntimeHoursPerMonth × downtimeReductionPercent × costPerDowntimeHour
monthlyRecurringSavings = monthlyDowntimeSavings - monthlyMaintenanceCost
```

### Payback Period

```
paybackMonths = implementationCost / monthlyRecurringSavings

// Edge cases:
// - If monthlyRecurringSavings ≤ 0: paybackMonths = Infinity
// - If implementationCost = 0: paybackMonths = 0
```

### First Year ROI

```
savingsMonthsYear1 = max(0, 12 - timelineMonths)
firstYearSavings = monthlyRecurringSavings × savingsMonthsYear1
firstYearROI = ((firstYearSavings - implementationCost) / implementationCost) × 100

// Edge case: If implementationCost = 0, firstYearROI = 0
```

### Three Year ROI

```
threeYearSavings = firstYearSavings + (monthlyRecurringSavings × 24)
threeYearNetValue = threeYearSavings - implementationCost
threeYearROI = (threeYearNetValue / implementationCost) × 100

// Edge case: If implementationCost = 0, threeYearROI = 0
```

### Key Assumptions

| Assumption | Value | Rationale |
|------------|-------|-----------|
| OEE-to-Downtime Factor | 2.5x | Industry median correlation; each 1% OEE improvement yields 2.5% downtime reduction |
| Savings Start | After implementation | No partial benefits during implementation phase |
| Capital Equipment | None required | Model assumes software-only implementation |

### Input Validation

| Variable | Min | Max |
|----------|-----|-----|
| currentOEE | 0 | 1 (100%) |
| targetOEEImprovement | 0 | 0.35 (35%) |
| unplannedDowntimeHoursPerMonth | 0 | ∞ |
| costPerDowntimeHour | 0 | ∞ |
| implementationCost | 0 | ∞ |
| monthlyMaintenanceCost | 0 | ∞ |
| timelineMonths | 1 | ∞ |

---

## Insurance ROI Model

### Claims Processing Savings

```
currentAnnualProcessingHours = (annualClaimsVolume × averageClaimProcessingTimeMinutes) / 60
processingSavingsPercent = 0.40  // 40% time reduction (industry benchmark)
annualHoursSaved = currentAnnualProcessingHours × processingSavingsPercent
annualProcessingSavings = annualHoursSaved × laborCostPerHour
monthlyProcessingSavings = annualProcessingSavings / 12
```

### Fraud Detection Savings

```
estimatedFraudulentClaims = annualClaimsVolume × 0.02  // 2% fraud rate (industry average)
newFraudDetectionRate = min(0.60, currentFraudDetectionRate × 2)  // 2x improvement, capped at 60%
additionalFraudCaught = estimatedFraudulentClaims × (newFraudDetectionRate - currentFraudDetectionRate)
annualFraudSavings = additionalFraudCaught × averageFraudClaimValue
monthlyFraudSavings = annualFraudSavings / 12
```

### Total Savings

```
totalMonthlySavings = monthlyProcessingSavings + monthlyFraudSavings
monthlyRecurringSavings = totalMonthlySavings - monthlyMaintenanceCost
```

### ROI Calculations

Same formulas as Manufacturing:
- `paybackMonths`, `firstYearROI`, `threeYearROI`, `threeYearNetValue`

### Key Assumptions

| Assumption | Value | Rationale |
|------------|-------|-----------|
| Processing Time Reduction | 40% | Conservative AI-assisted claims processing benchmark |
| Fraud Rate | 2% | Industry average from Coalition Against Insurance Fraud |
| AI Fraud Detection Improvement | 2× | Conservative multiplier, capped at 60% detection rate |
| Labor Cost Stability | Constant | No wage inflation assumed |

### Input Validation

| Variable | Min | Max |
|----------|-----|-----|
| annualClaimsVolume | 0 | ∞ |
| averageClaimProcessingTimeMinutes | 1 | ∞ |
| laborCostPerHour | 0 | ∞ |
| currentFraudDetectionRate | 0 | 1 (100%) |
| averageFraudClaimValue | 0 | ∞ |
| implementationCost | 0 | ∞ |
| monthlyMaintenanceCost | 0 | ∞ |
| timelineMonths | 1 | ∞ |

---

## Financial Metrics

### Net Present Value (NPV)

```
NPV = -initialInvestment + Σ(t=1 to n) [cashFlow_t / (1 + monthlyRate)^t]

where:
  monthlyRate = (1 + annualDiscountRate)^(1/12) - 1
  n = analysisYears × 12 (total months)
```

**Default Configuration**:
- `annualDiscountRate`: 10% (typical enterprise hurdle rate)
- `analysisYears`: 5 years

### Internal Rate of Return (IRR)

IRR is calculated using the Newton-Raphson iterative method:

```
// Find monthlyRate where NPV = 0

repeat until convergence:
  npv = -initialInvestment + Σ(cashFlow_t / (1 + monthlyRate)^(t+1))
  npvDerivative = -Σ((t+1) × cashFlow_t / (1 + monthlyRate)^(t+2))
  monthlyRate = monthlyRate - (npv / npvDerivative)

annualIRR = (1 + monthlyRate)^12 - 1
```

**Parameters**:
- `maxIterations`: 100
- `tolerance`: 0.0001
- `IRR bounds`: [-100%, +500%]

### Total Cost of Ownership (TCO)

```
TCO = initialInvestment + Σ(year=0 to analysisYears-1) [monthlyMaintenance × (1 + inflationRate)^year × 12]
```

**Default Configuration**:
- `inflationRate`: 3% annually

### Profitability Index (PI)

```
PI = (NPV + initialInvestment) / initialInvestment

// Interpretation:
// PI > 1: Investment generates value
// PI = 1: Break-even
// PI < 1: Value destruction
```

### Discounted Payback Period

```
Find month t where: Σ(i=1 to t) [discountedCashFlow_i] ≥ initialInvestment

discountedCashFlow_i = cashFlow_i / (1 + monthlyRate)^i
```

### Cash Flow Generation

Cash flows include a linear ramp-up during implementation:

```
for each month:
  if month < implementationMonths:
    rampUpFactor = (month + 1) / implementationMonths
  else:
    rampUpFactor = 1.0

  inflationFactor = (1 + monthlyInflation)^month
  adjustedSavings = monthlySavings × rampUpFactor × inflationFactor
  adjustedCosts = monthlyMaintenanceCost × inflationFactor
  cashFlow = adjustedSavings - adjustedCosts
```

---

## Sensitivity Analysis

Three scenarios are calculated using multipliers on expected monthly savings:

| Scenario | Factor | Description |
|----------|--------|-------------|
| Conservative | 0.60 (60%) | Pessimistic case - lower adoption, more issues |
| Expected | 1.00 (100%) | Baseline projection |
| Optimistic | 1.40 (140%) | Best case - exceeds expectations |

### Scenario Calculations

For each scenario (`conservative`, `expected`, `optimistic`):

```
scenarioMonthlySavings = expectedMonthlySavings × factor

paybackMonths = implementationCost / scenarioMonthlySavings
threeYearSavings = (savingsMonthsYear1 × scenarioMonthlySavings) + (24 × scenarioMonthlySavings)
threeYearNetValue = threeYearSavings - implementationCost
threeYearROI = (threeYearNetValue / implementationCost) × 100
```

---

## Variable Reference

### Manufacturing Inputs

| Variable | Type | Default | Range | Unit | Description |
|----------|------|---------|-------|------|-------------|
| `currentOEE` | number | 0.65 | [0, 1] | ratio | Current Overall Equipment Effectiveness |
| `targetOEEImprovement` | number | 0.10 | [0, 0.35] | ratio | Target improvement (e.g., 0.10 = 10%) |
| `unplannedDowntimeHoursPerMonth` | number | 40 | [0, ∞) | hours | Monthly unplanned downtime |
| `costPerDowntimeHour` | number | 5000 | [0, ∞) | USD | Cost per hour of downtime |
| `implementationCost` | number | 150000 | [0, ∞) | USD | Total implementation cost |
| `monthlyMaintenanceCost` | number | 2000 | [0, ∞) | USD | Ongoing monthly costs |
| `timelineMonths` | number | 6 | [1, ∞) | months | Implementation timeline |

### Insurance Inputs

| Variable | Type | Default | Range | Unit | Description |
|----------|------|---------|-------|------|-------------|
| `annualClaimsVolume` | number | 50000 | [0, ∞) | claims | Annual claims processed |
| `averageClaimProcessingTimeMinutes` | number | 45 | [1, ∞) | minutes | Avg time per claim |
| `laborCostPerHour` | number | 35 | [0, ∞) | USD | Fully-loaded labor cost |
| `currentFraudDetectionRate` | number | 0.15 | [0, 1] | ratio | Current detection rate |
| `averageFraudClaimValue` | number | 8000 | [0, ∞) | USD | Avg fraudulent claim value |
| `implementationCost` | number | 200000 | [0, ∞) | USD | Total implementation cost |
| `monthlyMaintenanceCost` | number | 3000 | [0, ∞) | USD | Ongoing monthly costs |
| `timelineMonths` | number | 9 | [1, ∞) | months | Implementation timeline |

### Financial Configuration

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `discountRate` | number | 0.10 | Annual discount rate (10%) |
| `analysisYears` | number | 5 | TCO/NPV analysis period |
| `inflationRate` | number | 0.03 | Annual cost inflation (3%) |

---

## Sources & Benchmarks

### Primary Sources

| Citation ID | Source | Year | Methodology |
|-------------|--------|------|-------------|
| `mckinsey2023` | McKinsey Global Institute | 2023 | Survey of 1,684 organizations |
| `deloitte2023` | Deloitte Insights | 2023 | Survey of 2,620 business leaders |
| `gartner2023` | Gartner | 2023 | Survey of 2,500+ executives |
| `mwpvl2023` | MWPVL International | 2023 | Analysis of 500+ manufacturing facilities |
| `coalitionFraud2023` | Coalition Against Insurance Fraud | 2023 | Industry-wide claims analysis |
| `oeeFoundation` | OEE Foundation | 2022 | Global manufacturing benchmarking |

### Industry Benchmarks

#### Manufacturing

| Metric | Low | Median | High | Source |
|--------|-----|--------|------|--------|
| Typical ROI (%) | 50 | 150 | 300 | mckinsey2023 |
| Payback (months) | 6 | 12 | 24 | mwpvl2023 |
| Implementation Cost | $75K | $150K | $500K | deloitte2023 |

#### Insurance

| Metric | Low | Median | High | Source |
|--------|-----|--------|------|--------|
| Typical ROI (%) | 75 | 200 | 400 | deloitte2023 |
| Payback (months) | 9 | 15 | 30 | gartner2023 |
| Implementation Cost | $100K | $200K | $750K | deloitte2023 |

### OEE Benchmarks

| Level | Value | Description |
|-------|-------|-------------|
| Conservative | 5% | Minimal AI-driven improvement |
| Median | 10% | Typical implementation result |
| Optimistic | 15% | High-performing implementation |
| World Class | 20% | Exceptional (rare) |

---

## Limitations & Caveats

### Manufacturing Calculator

1. **Data Quality Dependency**: Results heavily depend on sensor coverage and data quality
2. **Change Management Excluded**: Training and organizational change costs not included
3. **Integration Complexity**: Assumes minimal legacy system integration issues
4. **Stabilization Period**: Actual savings may take 3-6 months to stabilize post-implementation
5. **Production Volume**: Assumes stable production volume throughout analysis period

### Insurance Calculator

1. **Fraud Rate Estimation**: Savings depend on accuracy of assumed 2% fraud rate
2. **Regulatory Compliance**: May require additional time and costs beyond implementation
3. **Legacy Systems**: Does not include costs of legacy system integration
4. **Claim Complexity**: Processing savings assume consistent claim complexity mix
5. **Human-in-the-Loop**: Automation benefits may be reduced by required human review

### Financial Metrics

1. **IRR Convergence**: Newton-Raphson may not converge for unusual cash flow patterns
2. **Discount Rate Assumption**: 10% hurdle rate may not match your organization's WACC
3. **Inflation Linearity**: Assumes constant 3% inflation rate over analysis period
4. **Linear Ramp-Up**: Simplified assumption; real implementations often have S-curve adoption

### General

1. **Historical Benchmarks**: Industry benchmarks from 2022-2023; may not reflect current conditions
2. **No Tail Risk**: Does not model probability of complete project failure
3. **Single Point Estimates**: Uses expected values; actual outcomes have variance
4. **Currency**: All values in USD; no currency conversion

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-06 | Initial model documentation |

---

*For questions about the model methodology, please open an issue on GitHub.*
