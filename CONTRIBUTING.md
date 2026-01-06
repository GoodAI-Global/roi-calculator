# Contributing to Good AI ROI Calculator

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Code of Conduct

This project follows our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/roi-calculator.git`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature-name`

## Development Workflow

```bash
# Install dependencies
make setup

# Run development server
make dev

# Run tests
make test

# Run linter
make lint

# Run all checks before committing
make lint test
```

## Pull Request Process

1. **Create an issue first** for significant changes
2. **Branch from main** using descriptive branch names:
   - `feature/add-healthcare-calculator`
   - `fix/npv-calculation-edge-case`
   - `docs/update-methodology`
3. **Write tests** for new functionality
4. **Update documentation** if needed
5. **Ensure CI passes** — all tests, linting, and type checks must pass
6. **Request review** from maintainers

## Coding Standards

### TypeScript
- Strict mode enabled
- No `any` types without justification
- Explicit return types for public functions

### React
- Functional components with hooks
- Props interfaces defined
- Accessible components (ARIA attributes)

### Testing
- Unit tests for calculation logic
- Edge cases covered (Infinity, zero division, etc.)
- Deterministic tests (no random values without seeds)

### Calculation Guidelines

When adding or modifying calculations:

1. **Transparent assumptions** — All inputs must be visible and editable
2. **Conservative estimates** — Use p50 (median) benchmarks, not optimistic outliers
3. **Include caveats** — Document limitations and risks
4. **Add tests** — Cover normal cases, edge cases, and error conditions
5. **Document methodology** — Explain the calculation in code comments

### Commit Messages

Use conventional commits:

```
feat: add healthcare calculator
fix: handle zero division in payback calculation
docs: update methodology section
test: add edge case tests for IRR
chore: update dependencies
```

## Adding a New Calculator

1. Create `src/calculators/{industry}.ts` following existing patterns
2. Add types to `src/calculators/types.ts`
3. Add input form to `src/components/MetricsInput.tsx`
4. Add benchmarks to `src/data/benchmarks.ts`
5. Enable industry in `src/components/IndustrySelector.tsx`
6. Add comprehensive tests
7. Update README.md

## Questions?

- Open an issue for questions
- Email: hello@goodai.com
