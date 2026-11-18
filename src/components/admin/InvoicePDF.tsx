'use client';
import React, { useRef, useEffect, useCallback } from 'react';
import { Download, Printer, X } from 'lucide-react';
import logoUrl from '@/assets/logo.jpg';

const BANKING = [
  ['Bank',           'Standard Bank'],
  ['Account Holder', 'ADEQUATE STRATEGIES (PTY) LTD'],
  ['Reg Number',     '2024/021247/07'],
  ['Account Type',   'Current'],
  ['Account Number', '10277149124'],
  ['Branch',         'Melville Branch'],
  ['Branch Code',    '051001'],
  ['SWIFT',          'SBZAZAJJ'],
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildPreviewHTML(invoice: any, logoSrc: string): string {
  const isQuote = invoice.document_type === 'quote';
  const label   = isQuote ? 'Quote' : 'Invoice';
  const fmt     = (n: number) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(n);
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });

  const rows = invoice.invoice_items?.length
    ? invoice.invoice_items.map((item: { description: string; amount: number }) =>
        `<tr>
          <td style="border:1px solid #e5e7eb;padding:10px 12px;">${item.description}</td>
          <td style="border:1px solid #e5e7eb;padding:10px 12px;text-align:right;">${fmt(item.amount)}</td>
        </tr>`).join('')
    : `<tr>
        <td style="border:1px solid #e5e7eb;padding:10px 12px;color:#888;">No items</td>
        <td style="border:1px solid #e5e7eb;padding:10px 12px;text-align:right;">—</td>
      </tr>`;

  const banking = [...BANKING, ['Reference', invoice.invoice_number]]
    .map(([k, v]) => `<tr>
      <td style="padding:2px 8px 2px 0;font-weight:600;width:40%;">${k}:</td>
      <td style="padding:2px 0;color:#374151;">${v}</td>
    </tr>`).join('');

  return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  html{background:#e5e7eb;}
  body{font-family:Arial,sans-serif;color:#1a1a1a;background:#e5e7eb;padding:24px 16px;display:flex;justify-content:center;}
  .page{background:#fff;width:100%;max-width:720px;padding:28px 32px;display:flex;flex-direction:column;min-height:calc(100vh - 48px);box-shadow:0 2px 12px rgba(0,0,0,0.10);border-radius:4px;}
  .spacer{flex:1;}
  @media(max-width:600px){
    body{padding:8px;}
    .page{padding:16px 12px;min-height:auto;}
    .hdr{flex-direction:column!important;gap:10px!important;}
    .hdr-right{text-align:left!important;}
    .bill{flex-direction:column!important;gap:12px!important;}
    .bill-right{text-align:left!important;}
    table{font-size:11px!important;}
  }
</style>
</head><body>
<div class="page">
  <div class="hdr" style="border-bottom:2px solid #C79527;padding-bottom:16px;margin-bottom:24px;display:flex;align-items:center;justify-content:space-between;">
    <div style="display:flex;align-items:center;gap:12px;">
      <img src="${logoSrc}" alt="ADQS" style="height:44px;width:auto;border-radius:4px;"/>
      <div>
        <div style="font-weight:700;font-size:15px;color:#0B2854;">Adequate Strategies (Pty) Ltd</div>
        <div style="font-size:11px;color:#888;">Legal Consulting · Reg: 2024/021247/07</div>
        <div style="font-size:11px;color:#888;">252 Cole Road, Shere, Pretoria, 0084</div>
      </div>
    </div>
    <div class="hdr-right" style="text-align:right;">
      <div style="font-size:22px;font-weight:900;color:#0B2854;text-transform:uppercase;letter-spacing:0.05em;">${label}</div>
      <div style="font-size:12px;color:#C79527;font-weight:700;">${invoice.invoice_number}</div>
    </div>
  </div>
  <div class="bill" style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;">
    <div>
      <h3 style="font-weight:700;margin-bottom:8px;font-size:14px;">${label} To:</h3>
      <p style="font-weight:600;margin:2px 0;">${invoice.customer_name}</p>
      ${invoice.customer_email ? `<p style="font-size:13px;color:#6b7280;margin:2px 0;">${invoice.customer_email}</p>` : ''}
      ${invoice.customer_phone ? `<p style="font-size:13px;color:#6b7280;margin:2px 0;">${invoice.customer_phone}</p>` : ''}
      ${invoice.matter_reference ? `<p style="font-size:13px;color:#6b7280;margin:2px 0;">Matter Ref: ${invoice.matter_reference}</p>` : ''}
    </div>
    <div class="bill-right" style="text-align:right;">
      <h3 style="font-weight:700;margin-bottom:8px;font-size:14px;">${label} Details:</h3>
      <p style="font-size:13px;margin:2px 0;"><strong>Number:</strong> ${invoice.invoice_number}</p>
      <p style="font-size:13px;margin:2px 0;"><strong>Date:</strong> ${fmtDate(invoice.invoice_date)}</p>
      ${invoice.due_date ? `<p style="font-size:13px;margin:2px 0;"><strong>Due:</strong> ${fmtDate(invoice.due_date)}</p>` : ''}
      ${!isQuote ? `<p style="font-size:13px;margin:2px 0;"><strong>Status:</strong> ${invoice.status?.toUpperCase()}</p>` : ''}
    </div>
  </div>
  <table style="width:100%;border-collapse:collapse;margin-bottom:20px;font-size:13px;">
    <thead>
      <tr style="background:#0B2854;">
        <th style="border:1px solid #e5e7eb;padding:10px 12px;text-align:left;color:#fff;">Description</th>
        <th style="border:1px solid #e5e7eb;padding:10px 12px;text-align:right;color:#fff;">Amount</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <div style="text-align:right;margin-bottom:8px;">
    <p style="font-size:18px;font-weight:700;border-top:2px solid #e5e7eb;padding-top:8px;display:inline-block;">Total: ${fmt(invoice.total_amount)}</p>
  </div>
  <p style="font-size:10px;color:#aaa;text-align:right;margin-bottom:20px;font-style:italic;">
    Adequate Strategies (Pty) Ltd is not registered for VAT. No VAT is applicable to this ${label.toLowerCase()}.
  </p>
  ${invoice.notes ? `
  <div style="background:#fffef5;border:1px solid #fef3c7;border-radius:7px;padding:14px 16px;margin-bottom:20px;">
    <h3 style="font-weight:700;margin-bottom:6px;font-size:13px;color:#92400e;">Notes</h3>
    <p style="font-size:13px;color:#78350f;line-height:1.6;white-space:pre-wrap;">${invoice.notes}</p>
  </div>` : ''}
  <div style="background:#f9fafb;border-radius:7px;padding:16px;margin-bottom:20px;">
    <h3 style="font-weight:700;margin-bottom:8px;font-size:14px;">Banking Details</h3>
    <table style="width:100%;font-size:13px;border-collapse:collapse;"><tbody>${banking}</tbody></table>
  </div>
  <div class="spacer"></div>
  <div style="text-align:center;border-top:2px solid #e5e7eb;padding-top:12px;margin-top:16px;">
    <p style="font-weight:600;margin:0 0 3px;font-size:13px;">Thank you for choosing Adequate Strategies (Pty) Ltd!</p>
    <p style="font-size:11px;color:#6b7280;margin:0;">252 Cole Road, Shere, Pretoria · info@adqs.co.za · adqs.co.za · Confidential</p>
  </div>
</div>
</body></html>`;
}

// Builds PDF using jsPDF drawing API directly — zero DOM capture, zero html2canvas, zero oklch
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function downloadPDF(invoice: any) {
  const { jsPDF } = await import('jspdf');

  const isQuote = invoice.document_type === 'quote';
  const label   = isQuote ? 'Quote' : 'Invoice';
  const fmt     = (n: number) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(n);
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });

  const pdf     = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const W       = pdf.internal.pageSize.getWidth();
  const H       = pdf.internal.pageSize.getHeight();
  const L       = 14;
  const R       = W - 14;
  const HDR_H   = 46; // header block height
  const FTR_H   = 20; // footer reserved height
  const SAFE_B  = H - FTR_H; // y must not exceed this
  let   y       = 14;
  let   pageNum = 1;

  // Pre-load logo once
  let logoDataUrl = '';
  try {
    const img = new Image();
    img.src = logoUrl;
    await new Promise(r => { img.onload = r; img.onerror = r; });
    if (img.naturalWidth) logoDataUrl = logoUrl;
  } catch { /* skip */ }

  const hex = (h: string): [number,number,number] => [
    parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16),
  ];

  const drawPageHeader = () => {
    if (logoDataUrl) {
      const img2 = new Image(); img2.src = logoDataUrl;
      const ratio = img2.naturalHeight / img2.naturalWidth || 1;
      pdf.addImage(logoDataUrl, 'JPEG', L, y, 28, 28 * ratio);
    }
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(11); pdf.setTextColor(...hex('#0B2854'));
    pdf.text('Adequate Strategies (Pty) Ltd', L + 32, y + 5);
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8); pdf.setTextColor(...hex('#888888'));
    pdf.text('Legal Consulting · Reg: 2024/021247/07', L + 32, y + 10);
    pdf.text('252 Cole Road, Shere, Pretoria, 0084', L + 32, y + 15);
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(20); pdf.setTextColor(...hex('#0B2854'));
    pdf.text(label.toUpperCase(), R, y + 8, { align: 'right' });
    pdf.setFontSize(9); pdf.setTextColor(...hex('#C79527'));
    pdf.text(invoice.invoice_number, R, y + 15, { align: 'right' });
    y += HDR_H - 8;
    pdf.setDrawColor(...hex('#C79527')); pdf.setLineWidth(0.5);
    pdf.line(L, y, R, y);
    y += 8;
  };

  const drawPageFooter = () => {
    const fy = H - 14;
    pdf.setDrawColor(...hex('#e5e7eb')); pdf.setLineWidth(0.4);
    pdf.line(L, fy - 5, R, fy - 5);
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(9); pdf.setTextColor(...hex('#1a1a1a'));
    pdf.text('Thank you for choosing Adequate Strategies (Pty) Ltd!', W / 2, fy, { align: 'center' });
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(7); pdf.setTextColor(...hex('#6b7280'));
    pdf.text('252 Cole Road, Shere, Pretoria · info@adqs.co.za · adqs.co.za · Confidential', W / 2, fy + 5, { align: 'center' });
    pdf.setFontSize(7); pdf.setTextColor(150, 150, 150);
    pdf.text(`Page ${pageNum}`, W / 2, H - 3, { align: 'center' });
  };

  const addPage = () => {
    drawPageFooter();
    pdf.addPage();
    pageNum++;
    y = 14;
    drawPageHeader();
  };

  // needs = mm of content about to be drawn; if it won't fit, add a new page
  const need = (mm: number) => { if (y + mm > SAFE_B) addPage(); };

  // ── Page 1 ──
  drawPageHeader();

  // ── Bill To / Invoice Details ──
  need(30);
  const col2 = W / 2 + 5;
  pdf.setFont('helvetica', 'bold'); pdf.setFontSize(9); pdf.setTextColor(...hex('#1a1a1a'));
  pdf.text(`${label} To:`, L, y);
  pdf.text(`${label} Details:`, col2, y);
  y += 5;

  pdf.setFont('helvetica', 'bold'); pdf.setFontSize(9); pdf.setTextColor(...hex('#1a1a1a'));
  pdf.text(invoice.customer_name || '', L, y);
  pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8); pdf.setTextColor(...hex('#6b7280'));
  let ly = y + 5;
  if (invoice.customer_email)   { pdf.text(invoice.customer_email, L, ly); ly += 5; }
  if (invoice.customer_phone)   { pdf.text(invoice.customer_phone, L, ly); ly += 5; }
  if (invoice.matter_reference) { pdf.text(`Matter Ref: ${invoice.matter_reference}`, L, ly); ly += 5; }

  pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8); pdf.setTextColor(...hex('#1a1a1a'));
  let ry = y;
  pdf.text(`Number: ${invoice.invoice_number}`, col2, ry); ry += 5;
  pdf.text(`Date: ${fmtDate(invoice.invoice_date)}`, col2, ry); ry += 5;
  if (invoice.due_date) { pdf.text(`Due: ${fmtDate(invoice.due_date)}`, col2, ry); ry += 5; }
  if (!isQuote)         { pdf.text(`Status: ${invoice.status?.toUpperCase() || ''}`, col2, ry); ry += 5; }

  y = Math.max(ly, ry) + 8;

  // ── Table header ──
  need(8);
  const descColW = (R - L) * 0.72;
  const amtColX  = L + descColW;
  const amtColW  = (R - L) * 0.28;
  pdf.setFillColor(...hex('#0B2854'));
  pdf.rect(L, y, R - L, 8, 'F');
  pdf.setFont('helvetica', 'bold'); pdf.setFontSize(9); pdf.setTextColor(255, 255, 255);
  pdf.text('Description', L + 3, y + 5.5);
  pdf.text('Amount', R - 3, y + 5.5, { align: 'right' });
  y += 8;

  // ── Line items ──
  const items = invoice.invoice_items?.length ? invoice.invoice_items : [{ description: 'No items', amount: 0 }];

  items.forEach((item: { description: string; amount: number }, i: number) => {
    const lines = pdf.splitTextToSize(String(item.description || ''), descColW - 6);
    const rowH  = Math.max(8, lines.length * 5 + 4);
    need(rowH);
    if (i % 2 === 0) { pdf.setFillColor(249, 250, 251); pdf.rect(L, y, R - L, rowH, 'F'); }
    pdf.setDrawColor(...hex('#e5e7eb')); pdf.setLineWidth(0.1);
    pdf.rect(L, y, descColW, rowH);
    pdf.rect(amtColX, y, amtColW, rowH);
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8); pdf.setTextColor(...hex('#1a1a1a'));
    // justify: first line at top, amount vertically centred
    pdf.text(lines, L + 3, y + 5);
    pdf.text(fmt(item.amount), R - 3, y + rowH / 2 + 2, { align: 'right' });
    y += rowH;
  });

  y += 4;

  // ── Total ──
  need(16);
  pdf.setDrawColor(...hex('#e5e7eb')); pdf.setLineWidth(0.4);
  pdf.line(W / 2, y, R, y); y += 5;
  pdf.setFont('helvetica', 'bold'); pdf.setFontSize(12); pdf.setTextColor(...hex('#1a1a1a'));
  pdf.text(`Total: ${fmt(invoice.total_amount)}`, R, y, { align: 'right' }); y += 5;
  pdf.setFont('helvetica', 'italic'); pdf.setFontSize(7); pdf.setTextColor(...hex('#aaaaaa'));
  const vatNote = pdf.splitTextToSize(
    `Adequate Strategies (Pty) Ltd is not registered for VAT. No VAT is applicable to this ${label.toLowerCase()}.`,
    R - W / 2
  );
  pdf.text(vatNote, R, y, { align: 'right' });
  y += vatNote.length * 4 + 8;

  // ── Notes ──
  if (invoice.notes) {
    pdf.setFontSize(8);
    const noteLines = pdf.splitTextToSize(String(invoice.notes), R - L - 10);
    const lineH     = pdf.getLineHeight() / pdf.internal.scaleFactor;
    const noteBoxH  = 5 + 7 + noteLines.length * lineH + 5;
    need(noteBoxH);
    pdf.setFillColor(255, 254, 245);
    pdf.setDrawColor(254, 243, 199); pdf.setLineWidth(0.3);
    pdf.roundedRect(L, y, R - L, noteBoxH, 2, 2, 'FD');
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(9); pdf.setTextColor(146, 64, 14);
    pdf.text('Notes', L + 4, y + 5.5);
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8); pdf.setTextColor(120, 53, 15);
    pdf.text(noteLines, L + 4, y + 5.5 + 7);
    y += noteBoxH + 6;
  }

  // ── Banking ──
  const bankingRows = [...BANKING, ['Reference', invoice.invoice_number]];
  const boxH = 8 + bankingRows.length * 6;
  need(boxH);
  pdf.setFillColor(249, 250, 251);
  pdf.roundedRect(L, y, R - L, boxH, 2, 2, 'F');
  pdf.setFont('helvetica', 'bold'); pdf.setFontSize(9); pdf.setTextColor(...hex('#1a1a1a'));
  pdf.text('Banking Details', L + 4, y + 6);
  y += 10;
  bankingRows.forEach(([k, v]) => {
    pdf.setFont('helvetica', 'bold'); pdf.setTextColor(...hex('#1a1a1a'));
    pdf.text(`${k}:`, L + 4, y);
    pdf.setFont('helvetica', 'normal'); pdf.setTextColor(...hex('#374151'));
    pdf.text(String(v), L + 45, y);
    y += 6;
  });

  // ── Footer on last page ──
  drawPageFooter();

  pdf.save(`${invoice.invoice_number}.pdf`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const InvoicePDF: React.FC<{ invoice: any; onClose: () => void; autoDownload?: boolean }> = ({ invoice, onClose, autoDownload = false }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleDownload = useCallback(async () => {
    await downloadPDF(invoice);
    if (autoDownload) onClose();
  }, [invoice, autoDownload, onClose]);

  useEffect(() => {
    if (autoDownload) { const t = setTimeout(handleDownload, 400); return () => clearTimeout(t); }
  }, [autoDownload, handleDownload]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument;
    if (!doc) return;
    doc.open(); doc.write(buildPreviewHTML(invoice, logoUrl)); doc.close();
  }, [invoice]);

  if (autoDownload) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl flex flex-col shadow-xl" style={{height:'calc(100dvh - 16px)'}}>

        <div className="flex justify-between items-center px-3 py-2 sm:px-4 sm:py-3 border-b border-gray-100 shrink-0">
          <h2 className="font-bold text-sm sm:text-base truncate mr-2" style={{color:'#0B2854'}}>{invoice.invoice_number}</h2>
          <div className="flex gap-1 sm:gap-2 shrink-0">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-white rounded-lg text-xs sm:text-sm"
              style={{background:'#0B2854'}}
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4" /><span>Download</span>
            </button>
            <button
              onClick={() => iframeRef.current?.contentWindow?.print()}
              className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
            >
              <Printer className="w-4 h-4" /><span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-200 text-gray-700 rounded-lg text-xs sm:text-sm hover:bg-gray-300 transition-colors"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4" /><span className="hidden sm:inline">Close</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <iframe ref={iframeRef} style={{width:'100%',height:'100%',border:'none'}} title="Invoice Preview" />
        </div>

      </div>
    </div>
  );
};

export default InvoicePDF;
