import jsPDF from 'jspdf';
import { ROIResult, Industry, ManufacturingInputs, InsuranceInputs } from '../calculators/types';
import { formatCurrency, formatPercentage, formatDuration } from './calculations';

interface PDFExportOptions {
  industry: Industry;
  result: ROIResult;
  inputs: ManufacturingInputs | InsuranceInputs;
  companyName?: string;
  preparedBy?: string;
}

/**
 * Sanitize text input for PDF to prevent injection and formatting issues
 */
function sanitizeText(text: string | undefined, maxLength: number = 100): string {
  if (!text) return '';
  // Remove control characters (ASCII 0-31 and 127) and limit length
  // Using character code filtering instead of regex for clarity
  return text
    .split('')
    .filter((char) => {
      const code = char.charCodeAt(0);
      return code >= 32 && code !== 127;
    })
    .join('')
    .substring(0, maxLength)
    .trim();
}

/**
 * Generate a professional PDF report for ROI analysis
 */
export async function generatePDFReport(options: PDFExportOptions): Promise<void> {
  const { industry, result, inputs } = options;
  const companyName = sanitizeText(options.companyName, 50);
  const preparedBy = sanitizeText(options.preparedBy, 50);
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPos = margin;

  // Helper functions
  const addText = (text: string, x: number, y: number, options?: {
    fontSize?: number;
    fontStyle?: 'normal' | 'bold';
    align?: 'left' | 'center' | 'right';
    color?: [number, number, number];
  }) => {
    const { fontSize = 10, fontStyle = 'normal', align = 'left', color = [0, 0, 0] } = options || {};
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', fontStyle);
    doc.setTextColor(...color);
    doc.text(text, x, y, { align });
  };

  const addLine = (y: number, color: [number, number, number] = [78, 205, 196]) => {
    doc.setDrawColor(...color);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
  };

  const addSection = (title: string) => {
    yPos += 8;
    addText(title, margin, yPos, { fontSize: 14, fontStyle: 'bold', color: [74, 144, 226] });
    yPos += 3;
    addLine(yPos);
    yPos += 8;
  };

  // Header
  addText('Good AI', pageWidth / 2, yPos, {
    fontSize: 24,
    fontStyle: 'bold',
    align: 'center',
    color: [78, 205, 196]
  });
  yPos += 8;
  addText('ROI Analysis Report', pageWidth / 2, yPos, {
    fontSize: 18,
    fontStyle: 'bold',
    align: 'center',
    color: [0, 0, 0]
  });
  yPos += 6;
  addText(`Industry: ${industry.charAt(0).toUpperCase() + industry.slice(1)}`, pageWidth / 2, yPos, {
    fontSize: 12,
    align: 'center',
    color: [100, 100, 100]
  });
  yPos += 10;
  addLine(yPos, [78, 205, 196]);
  yPos += 5;

  // Report metadata
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  addText(`Report Generated: ${currentDate}`, margin, yPos, { fontSize: 9, color: [128, 128, 128] });
  if (companyName) {
    addText(`Prepared for: ${companyName}`, pageWidth - margin, yPos, {
      fontSize: 9,
      color: [128, 128, 128],
      align: 'right'
    });
  }
  yPos += 4;
  if (preparedBy) {
    addText(`Prepared by: ${preparedBy}`, margin, yPos, { fontSize: 9, color: [128, 128, 128] });
  }

  // Executive Summary
  addSection('Executive Summary');

  const summaryItems = [
    { label: 'Payback Period', value: formatDuration(result.paybackMonths) },
    { label: 'First Year ROI', value: formatPercentage(result.firstYearROI) },
    { label: '3-Year ROI', value: formatPercentage(result.threeYearROI) },
    { label: '3-Year Net Value', value: formatCurrency(result.threeYearNetValue) },
  ];

  // Summary boxes
  const boxWidth = (contentWidth - 15) / 4;
  summaryItems.forEach((item, index) => {
    const boxX = margin + (boxWidth + 5) * index;
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(boxX, yPos, boxWidth, 18, 2, 2, 'F');
    addText(item.label, boxX + boxWidth / 2, yPos + 6, {
      fontSize: 8,
      align: 'center',
      color: [100, 100, 100]
    });
    addText(item.value, boxX + boxWidth / 2, yPos + 13, {
      fontSize: 11,
      fontStyle: 'bold',
      align: 'center',
      color: [0, 0, 0]
    });
  });
  yPos += 25;

  // Financial Metrics Section
  addSection('Enterprise Financial Metrics');

  const financialMetrics = [
    {
      label: 'Net Present Value (NPV)',
      value: formatCurrency(result.financialMetrics.npv),
      description: `At ${formatPercentage(result.financialConfig.discountRate * 100)} discount rate`
    },
    {
      label: 'Internal Rate of Return (IRR)',
      value: result.financialMetrics.irr > 5 ? '>500%' : formatPercentage(result.financialMetrics.irr * 100),
      description: result.financialMetrics.irr > result.financialConfig.discountRate
        ? 'Exceeds hurdle rate'
        : 'Below hurdle rate'
    },
    {
      label: 'Total Cost of Ownership',
      value: formatCurrency(result.financialMetrics.tco),
      description: `${result.financialConfig.analysisYears}-year analysis`
    },
    {
      label: 'Profitability Index',
      value: `${result.financialMetrics.profitabilityIndex.toFixed(2)}x`,
      description: result.financialMetrics.profitabilityIndex >= 1 ? 'Value creating' : 'Value destroying'
    },
  ];

  financialMetrics.forEach((metric) => {
    addText(metric.label, margin, yPos, { fontSize: 10, fontStyle: 'bold' });
    addText(metric.value, margin + 80, yPos, { fontSize: 10 });
    addText(metric.description, margin + 130, yPos, { fontSize: 9, color: [128, 128, 128] });
    yPos += 6;
  });

  if (result.financialMetrics.discountedPaybackMonths !== Infinity) {
    addText('Discounted Payback', margin, yPos, { fontSize: 10, fontStyle: 'bold' });
    addText(`${result.financialMetrics.discountedPaybackMonths.toFixed(1)} months`, margin + 80, yPos, { fontSize: 10 });
    yPos += 6;
  }

  // Monthly Economics
  addSection('Monthly Economics');

  addText('Monthly Recurring Savings:', margin, yPos, { fontSize: 10 });
  addText(formatCurrency(result.monthlyRecurringSavings), margin + 60, yPos, {
    fontSize: 10,
    fontStyle: 'bold',
    color: result.monthlyRecurringSavings >= 0 ? [34, 197, 94] : [239, 68, 68]
  });
  yPos += 6;
  addText('Total Implementation Cost:', margin, yPos, { fontSize: 10 });
  addText(formatCurrency(result.totalImplementationCost), margin + 60, yPos, { fontSize: 10, fontStyle: 'bold' });
  yPos += 10;

  // Sensitivity Analysis
  addSection('Sensitivity Analysis');

  const scenarios = [
    { name: 'Conservative (60%)', data: result.sensitivityAnalysis.conservative },
    { name: 'Expected (100%)', data: result.sensitivityAnalysis.expected },
    { name: 'Optimistic (140%)', data: result.sensitivityAnalysis.optimistic },
  ];

  // Table header
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, yPos - 4, contentWidth, 8, 'F');
  addText('Scenario', margin + 5, yPos, { fontSize: 9, fontStyle: 'bold' });
  addText('Payback', margin + 55, yPos, { fontSize: 9, fontStyle: 'bold' });
  addText('3-Year ROI', margin + 95, yPos, { fontSize: 9, fontStyle: 'bold' });
  addText('3-Year Net Value', margin + 140, yPos, { fontSize: 9, fontStyle: 'bold' });
  yPos += 8;

  scenarios.forEach((scenario) => {
    addText(scenario.name, margin + 5, yPos, { fontSize: 9 });
    addText(formatDuration(scenario.data.paybackMonths), margin + 55, yPos, { fontSize: 9 });
    addText(formatPercentage(scenario.data.threeYearROI), margin + 95, yPos, { fontSize: 9 });
    addText(formatCurrency(scenario.data.threeYearNetValue), margin + 140, yPos, { fontSize: 9 });
    yPos += 6;
  });

  // Key Assumptions
  yPos += 5;
  addSection('Key Assumptions');

  result.assumptions.forEach((assumption) => {
    const lines = doc.splitTextToSize(`• ${assumption}`, contentWidth - 10);
    lines.forEach((line: string) => {
      addText(line, margin + 5, yPos, { fontSize: 9, color: [75, 85, 99] });
      yPos += 5;
    });
  });

  // Important Caveats
  yPos += 3;
  addSection('Important Caveats');

  result.caveats.forEach((caveat) => {
    const lines = doc.splitTextToSize(`• ${caveat}`, contentWidth - 10);
    lines.forEach((line: string) => {
      addText(line, margin + 5, yPos, { fontSize: 9, color: [75, 85, 99] });
      yPos += 5;
    });
  });

  // Check if we need a new page for input parameters
  if (yPos > 250) {
    doc.addPage();
    yPos = margin;
  }

  // Input Parameters Used
  yPos += 3;
  addSection('Input Parameters');

  const inputLabels: Record<string, Record<string, string>> = {
    manufacturing: {
      currentOEE: 'Current OEE',
      targetOEEImprovement: 'Target OEE Improvement',
      unplannedDowntimeHoursPerMonth: 'Unplanned Downtime (hrs/month)',
      costPerDowntimeHour: 'Cost per Downtime Hour',
      implementationCost: 'Implementation Cost',
      monthlyMaintenanceCost: 'Monthly Maintenance',
      timelineMonths: 'Implementation Timeline',
    },
    insurance: {
      annualClaimsVolume: 'Annual Claims Volume',
      averageClaimProcessingTimeMinutes: 'Avg Processing Time (min)',
      laborCostPerHour: 'Labor Cost per Hour',
      currentFraudDetectionRate: 'Current Fraud Detection Rate',
      averageFraudClaimValue: 'Avg Fraudulent Claim Value',
      implementationCost: 'Implementation Cost',
      monthlyMaintenanceCost: 'Monthly Maintenance',
      timelineMonths: 'Implementation Timeline',
    },
  };

  const labels = inputLabels[industry] || {};
  Object.entries(inputs).forEach(([key, value]) => {
    const label = labels[key] || key;
    let displayValue: string;

    if (key.includes('Cost') || key.includes('Value') || key.includes('labor')) {
      displayValue = formatCurrency(value);
    } else if (key.includes('Rate') || key.includes('OEE') || key.includes('Improvement')) {
      displayValue = formatPercentage(value * 100);
    } else if (key.includes('Months') || key.includes('Timeline')) {
      displayValue = `${value} months`;
    } else {
      displayValue = value.toLocaleString();
    }

    addText(label + ':', margin, yPos, { fontSize: 9, color: [75, 85, 99] });
    addText(displayValue, margin + 80, yPos, { fontSize: 9 });
    yPos += 5;
  });

  // Footer / Disclaimer
  doc.setPage(doc.getNumberOfPages());
  const pageHeight = doc.internal.pageSize.getHeight();

  addLine(pageHeight - 25, [200, 200, 200]);
  addText(
    'DISCLAIMER: These calculations are estimates based on industry benchmarks.',
    pageWidth / 2,
    pageHeight - 20,
    { fontSize: 8, align: 'center', color: [150, 150, 150] }
  );
  addText(
    'Actual results may vary based on implementation quality, data availability, and organizational factors.',
    pageWidth / 2,
    pageHeight - 15,
    { fontSize: 8, align: 'center', color: [150, 150, 150] }
  );
  addText(
    `© ${new Date().getFullYear()} Good AI - ROI Calculator`,
    pageWidth / 2,
    pageHeight - 10,
    { fontSize: 8, align: 'center', color: [150, 150, 150] }
  );

  // Save the PDF
  const filename = `Good_AI_ROI_Report_${industry}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}
