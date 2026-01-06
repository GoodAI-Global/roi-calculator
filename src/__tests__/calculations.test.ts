import { describe, it, expect } from 'vitest';
import { formatCurrency, formatPercentage, formatDuration } from '../utils/calculations';

describe('formatCurrency', () => {
  it('should format positive numbers', () => {
    expect(formatCurrency(1000)).toBe('$1,000');
    expect(formatCurrency(1000000)).toBe('$1,000,000');
  });

  it('should format zero', () => {
    expect(formatCurrency(0)).toBe('$0');
  });

  it('should format negative numbers', () => {
    expect(formatCurrency(-5000)).toBe('-$5,000');
  });

  it('should round to whole numbers', () => {
    expect(formatCurrency(1234.56)).toBe('$1,235');
  });
});

describe('formatPercentage', () => {
  it('should format with default decimals', () => {
    expect(formatPercentage(50)).toBe('50.0%');
    expect(formatPercentage(123.456)).toBe('123.5%');
  });

  it('should format with specified decimals', () => {
    expect(formatPercentage(50, 0)).toBe('50%');
    expect(formatPercentage(50.123, 2)).toBe('50.12%');
  });

  it('should format negative percentages', () => {
    expect(formatPercentage(-25.5)).toBe('-25.5%');
  });
});

describe('formatDuration', () => {
  it('should return N/A for invalid values', () => {
    expect(formatDuration(Infinity)).toBe('N/A');
    expect(formatDuration(-5)).toBe('N/A');
    expect(formatDuration(0)).toBe('N/A');
  });

  it('should format days for less than 1 month', () => {
    expect(formatDuration(0.5)).toBe('15 days');
  });

  it('should format months for less than 12 months', () => {
    expect(formatDuration(6)).toBe('6.0 months');
    expect(formatDuration(11.5)).toBe('11.5 months');
  });

  it('should format years for 12+ months', () => {
    expect(formatDuration(12)).toBe('1 year');
    expect(formatDuration(24)).toBe('2 years');
  });

  it('should format years and months', () => {
    expect(formatDuration(18)).toBe('1 year, 6 months');
    expect(formatDuration(30)).toBe('2 years, 6 months');
  });

  it('should use singular form correctly', () => {
    expect(formatDuration(13)).toBe('1 year, 1 month');
  });
});
