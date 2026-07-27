import jsPDF from 'jspdf';

export const generateCertificate = (userName: string, courseTitle: string, completionDate: string): string => {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Background
  pdf.setFillColor(10, 15, 36); // #0A0F24
  pdf.rect(0, 0, 297, 210, 'F');

  // Border
  pdf.setDrawColor(0, 229, 255); // #00E5FF
  pdf.setLineWidth(2);
  pdf.rect(10, 10, 277, 190);

  // Inner border
  pdf.setLineWidth(0.5);
  pdf.rect(15, 15, 267, 180);

  // Title
  pdf.setTextColor(0, 229, 255);
  pdf.setFontSize(40);
  pdf.text('CERTIFICATE', 148.5, 50, { align: 'center' });
  
  pdf.setFontSize(20);
  pdf.text('OF COMPLETION', 148.5, 65, { align: 'center' });

  // Body text
  pdf.setTextColor(230, 247, 255);
  pdf.setFontSize(14);
  pdf.text('This certificate is proudly awarded to', 148.5, 85, { align: 'center' });

  // User name
  pdf.setTextColor(0, 229, 255);
  pdf.setFontSize(28);
  pdf.text(userName, 148.5, 105, { align: 'center' });

  // Course info
  pdf.setTextColor(230, 247, 255);
  pdf.setFontSize(14);
  pdf.text('for successfully completing the', 148.5, 120, { align: 'center' });

  pdf.setTextColor(0, 240, 255);
  pdf.setFontSize(20);
  pdf.text(courseTitle, 148.5, 135, { align: 'center' });

  pdf.setTextColor(230, 247, 255);
  pdf.setFontSize(14);
  pdf.text('course on LearnStreak', 148.5, 150, { align: 'center' });

  // Date
  pdf.setFontSize(12);
  pdf.text(`Completion Date: ${completionDate}`, 148.5, 170, { align: 'center' });

  // Certificate ID
  const certId = `LS-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  pdf.setFontSize(10);
  pdf.text(`Certificate ID: ${certId}`, 148.5, 185, { align: 'center' });

  // Return as data URL for download
  return pdf.output('bloburl') as string;
};