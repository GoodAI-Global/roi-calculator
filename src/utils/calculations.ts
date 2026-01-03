/**
 * Utility functions for ROI calculations
 */

/**
 * Format a number as currency (USD)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a number as a percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format months as a readable duration
 */
export function formatDuration(months: number): string {
  if (!isFinite(months) || months <= 0) {
    return 'N/A';
  }

  if (months < 1) {
    return `${Math.round(months * 30)} days`;
  }

  if (months < 12) {
    return `${months.toFixed(1)} months`;
  }

  const years = Math.floor(months / 12);
  const remainingMonths = Math.round(months % 12);

  if (remainingMonths === 0) {
    return `${years} year${years > 1 ? 's' : ''}`;
  }

  return `${years} year${years > 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
}

/**
 * Calculate Net Present Value (NPV)
 * @param cashFlows Array of cash flows by period
 * @param discountRate Annual discount rate (e.g., 0.10 for 10%)
 * @param periodsPerYear Number of periods per year (12 for monthly)
 */
export function calculateNPV(
  cashFlows: number[],
  discountRate: number,
  periodsPerYear: number = 12
): number {
  const periodRate = discountRate / periodsPerYear;

  return cashFlows.reduce((npv, cashFlow, period) => {
    return npv + cashFlow / Math.pow(1 + periodRate, period);
  }, 0);
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Generate an array of numbers for slider steps
 */
export function generateSteps(min: number, max: number, step: number): number[] {
  const steps: number[] = [];
  for (let i = min; i <= max; i += step) {
    steps.push(Math.round(i * 1000) / 1000);
  }
  return steps;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      document.body.removeChild(textArea);
      return false;
    }
  }
}
