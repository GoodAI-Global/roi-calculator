# Acceptance Tests

## Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
open http://localhost:5173
```

## Expected Results

### Page Load
- [ ] Page loads without errors
- [ ] Manufacturing calculator displays by default
- [ ] All default values are populated
- [ ] Header shows "Good AI ROI Calculator"
- [ ] Footer shows methodology disclaimer

### Industry Selector
- [ ] Manufacturing is selected by default
- [ ] Insurance is selectable
- [ ] Healthcare shows "coming soon" and is disabled
- [ ] Aquaculture shows "coming soon" and is disabled
- [ ] Switching industries updates the input form

### Manufacturing Calculator Inputs
- [ ] Current OEE slider works (30-95%)
- [ ] Target OEE Improvement slider works (1-25%)
- [ ] Unplanned Downtime slider works (0-200 hours)
- [ ] Cost per Downtime Hour slider works ($500-$50,000)
- [ ] Implementation Cost slider works ($25,000-$1,000,000)
- [ ] Monthly Maintenance slider works ($0-$20,000)
- [ ] Timeline slider works (1-24 months)
- [ ] Number inputs accept direct typing
- [ ] Sliders and number inputs stay synchronized

### Real-time Calculations
- [ ] Results update immediately when inputs change
- [ ] No lag or delay in calculations
- [ ] Payback period shows reasonable values (1-60 months typical)
- [ ] First Year ROI can be negative (expected for longer implementations)
- [ ] 3-Year ROI shows positive values for default inputs

### Results Display
- [ ] Payback Period is displayed clearly
- [ ] First Year ROI is displayed (may be negative)
- [ ] 3-Year ROI is displayed with percentage
- [ ] 3-Year Net Value shows dollar amount
- [ ] Monthly Recurring Savings is shown
- [ ] Warning indicators appear for long payback or negative ROI

### Assumptions Section
- [ ] Assumptions section is visible
- [ ] Collapsible toggle works
- [ ] All 6 assumptions are listed for manufacturing
- [ ] Assumptions update based on input values (e.g., timeline months)

### Caveats Section
- [ ] Caveats are always visible (not hidden)
- [ ] Red warning styling makes them prominent
- [ ] All 5 caveats are listed for manufacturing
- [ ] Caveats are not collapsed by default

### Sensitivity Analysis
- [ ] Bar chart renders for 3-Year ROI
- [ ] Bar chart renders for Payback Period
- [ ] Conservative scenario shows lower ROI
- [ ] Optimistic scenario shows higher ROI
- [ ] Summary table displays all three scenarios
- [ ] Net values are formatted as currency

### Export Functionality
- [ ] "Copy as JSON" button is visible
- [ ] Clicking button copies data to clipboard
- [ ] Button shows "Copied!" confirmation
- [ ] JSON includes all inputs, results, assumptions, and caveats

### Reset Functionality
- [ ] "Reset to Defaults" button works
- [ ] All inputs return to default values
- [ ] Results recalculate with defaults

### Mobile Responsiveness
- [ ] Layout adapts for screens < 768px
- [ ] Inputs are still usable on mobile
- [ ] Charts resize appropriately
- [ ] No horizontal scrolling on main content

## Insurance Calculator Tests

### Switch to Insurance
- [ ] Click Insurance button in selector
- [ ] Input form changes to insurance-specific fields
- [ ] Default values are loaded

### Insurance Inputs
- [ ] Annual Claims Volume slider works
- [ ] Average Processing Time slider works
- [ ] Labor Cost per Hour slider works
- [ ] Current Fraud Detection Rate slider works
- [ ] Average Fraud Claim Value slider works
- [ ] Implementation Cost slider works
- [ ] Monthly Maintenance slider works
- [ ] Timeline slider works

### Insurance Results
- [ ] ROI calculations are reasonable
- [ ] Assumptions reflect insurance-specific factors
- [ ] Caveats mention regulatory considerations

## Performance Tests

- [ ] Initial page load < 3 seconds
- [ ] Input changes reflect in < 100ms
- [ ] No memory leaks on repeated input changes
- [ ] Charts render smoothly

## Default Values Validation

With default manufacturing inputs:
- Current OEE: 65%
- Target Improvement: 10%
- Downtime: 40 hours/month
- Cost per Hour: $5,000
- Implementation: $150,000
- Maintenance: $2,000/month
- Timeline: 6 months

Expected results (approximate):
- Monthly Savings: ~$48,000
- Payback: ~3-4 months
- First Year ROI: > 100%
- 3-Year ROI: > 500%

## Build Tests

```bash
# Build should complete without errors
npm run build

# Preview build
npm run preview
```

- [ ] Build completes successfully
- [ ] No TypeScript errors
- [ ] Production build runs correctly
