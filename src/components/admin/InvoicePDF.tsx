import React, { useRef } from 'react';
import { X, Download, Printer } from 'lucide-react';
import type { Invoice } from '@/types';
import logo from '@/assets/logo.jpg';

const fmt     = (n: number) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(n);
const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });

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

function PDFBody({ invoice }: { invoice: Invoice }) {
  const isQuote = invoice.document_type === 'quote';
  const label   = isQuote ? 'Quote' : 'Invoice';

  return (
    <div style={{ maxWidth: '720px', background: '#fff', padding: '36px 40px', fontFamily: 'Georgia, serif', color: '#1a1a1a', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ borderBottom: '2px solid #C79527', paddingBottom: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={logo} alt="ADQS" style={{ height: '44px', width: 'auto', borderRadius: '4px' }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '15px', color: '#0B2854' }}>Adequate Strategies (Pty) Ltd</div>
            <div style={{ fontSize: '11px', color: '#888' }}>Legal Consulting · Reg: 2024/021247/07</div>
            <div style={{ fontSize: '11px', color: '#888' }}>252 Cole Road, Shere, Pretoria, 0084</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '22px', fontWeight: 900, color: '#0B2854', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
          <div style={{ fontSize: '12px', color: '#C79527', fontWeight: 700 }}>{invoice.invoice_number}</div>
        </div>
      </div>

      {/* Bill To + Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '24px' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#C79527', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>{label} To</div>
          <div style={{ fontWeight: 700, fontSize: '13px' }}>{invoice.customer_name}</div>
          {invoice.customer_email && <div style={{ fontSize: '12px', color: '#555', marginTop: '2px' }}>{invoice.customer_email}</div>}
          {invoice.customer_phone && <div style={{ fontSize: '12px', color: '#555', marginTop: '2px' }}>{invoice.customer_phone}</div>}
          {invoice.matter_reference && <div style={{ fontSize: '12px', color: '#555', marginTop: '6px' }}>Matter Ref: <strong>{invoice.matter_reference}</strong></div>}
        </div>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#C79527', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Details</div>
          {[
            [isQuote ? 'Quote Number' : 'Invoice Number', invoice.invoice_number],
            [isQuote ? 'Quote Date' : 'Invoice Date', fmtDate(invoice.invoice_date)],
            ...(invoice.due_date ? [['Due Date', fmtDate(invoice.due_date)]] : []),
            ...(!isQuote ? [['Status', invoice.status.toUpperCase()]] : []),
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', gap: '8px', fontSize: '12px', marginBottom: '3px' }}>
              <span style={{ color: '#888', minWidth: '110px' }}>{k}:</span>
              <span style={{ fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Line items */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px', fontSize: '13px' }}>
        <thead>
          <tr style={{ background: '#0B2854' }}>
            <th style={{ padding: '10px 14px', textAlign: 'left', color: '#fff', fontWeight: 600 }}>Description</th>
            <th style={{ padding: '10px 14px', textAlign: 'right', color: '#fff', fontWeight: 600, width: '140px' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.invoice_items?.length ? invoice.invoice_items.map((item, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #e5e7eb', background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
              <td style={{ padding: '10px 14px' }}>{item.description}</td>
              <td style={{ padding: '10px 14px', textAlign: 'right' }}>{fmt(item.amount)}</td>
            </tr>
          )) : (
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '10px 14px', color: '#888' }}>No items</td>
              <td style={{ padding: '10px 14px', textAlign: 'right' }}>—</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Total */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
        <div style={{ borderTop: '2px solid #0B2854', paddingTop: '10px', minWidth: '220px', textAlign: 'right' }}>
          <span style={{ fontSize: '16px', fontWeight: 900, color: '#0B2854' }}>Total: {fmt(invoice.total_amount)}</span>
        </div>
      </div>

      {/* VAT note */}
      <div style={{ fontSize: '10px', color: '#aaa', textAlign: 'right', marginBottom: '24px', fontStyle: 'italic' }}>
        Adequate Strategies (Pty) Ltd is not registered for VAT. No VAT is applicable to this {label.toLowerCase()}.
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div style={{ background: '#f9fafb', borderRadius: '6px', padding: '12px 16px', marginBottom: '20px', fontSize: '12px', color: '#555' }}>
          <div style={{ fontWeight: 700, marginBottom: '4px', color: '#0B2854' }}>Notes</div>
          {invoice.notes}
        </div>
      )}

      {/* Banking details */}
      <div style={{ background: '#f0f4fa', borderRadius: '6px', padding: '16px', marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#C79527', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Banking Details</div>
        <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
          <tbody>
            {[...BANKING, ['Reference', invoice.invoice_number]].map(([k, v]) => (
              <tr key={k}>
                <td style={{ padding: '2px 8px 2px 0', fontWeight: 600, width: '38%', color: '#0B2854' }}>{k}:</td>
                <td style={{ padding: '2px 0', color: '#374151' }}>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px', textAlign: 'center', fontSize: '10px', color: '#aaa' }}>
        <div>Adequate Strategies (Pty) Ltd · 252 Cole Road, Shere, Pretoria, 0084</div>
        <div>info@adqs.co.za · adqs.co.za · This document is confidential.</div>
      </div>

    </div>
  );
}

interface Props {
  invoice: Invoice;
  onClose: () => void;
  autoDownload?: boolean;
}

export default function InvoicePDF({ invoice, onClose, autoDownload = false }: Props) {
  const pdfRef = useRef<HTMLDivElement>(null);

  const handleDownload = React.useCallback(async () => {
    if (!pdfRef.current) return;
    const html2pdf = (await import('html2pdf.js')).default;

    const opt = {
      margin: [0.5, 0.5, 0.6, 0.5] as [number, number, number, number],
      filename: `${invoice.invoice_number}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in' as const, format: 'a4' as const, orientation: 'portrait' as const },
      pagebreak: { mode: ['css', 'legacy'] },
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (html2pdf().from(pdfRef.current).set(opt).toPdf().get('pdf').then((pdf: any) => {
      const totalPages = pdf.internal.getNumberOfPages();
      const pageWidth  = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      for (let p = 1; p <= totalPages; p++) {
        pdf.setPage(p);
        pdf.setFontSize(9);
        pdf.setTextColor(150);
        pdf.text(`Page ${p} of ${totalPages}`, pageWidth / 2, pageHeight - 0.25, { align: 'center' });
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any).save();

    if (autoDownload) onClose();
  }, [invoice.invoice_number, autoDownload, onClose]);

  React.useEffect(() => {
    if (autoDownload) { const t = setTimeout(handleDownload, 400); return () => clearTimeout(t); }
  }, [autoDownload, handleDownload]);

  if (autoDownload) return (
    <div style={{ position: 'fixed', left: '-9999px', top: 0, width: '720px', pointerEvents: 'none' }}>
      <div ref={pdfRef}><PDFBody invoice={invoice} /></div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 shrink-0">
          <span className="text-sm font-bold text-brand-primary">{invoice.invoice_number}</span>
          <div className="flex items-center gap-2">
            <button onClick={handleDownload} className="flex items-center gap-1.5 text-xs font-semibold bg-brand-primary text-white px-3 py-1.5 rounded-lg hover:bg-brand-primary/90">
              <Download className="w-3.5 h-3.5" /> Download
            </button>
            <button onClick={() => window.print()} className="flex items-center gap-1.5 text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200">
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 ml-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4 bg-gray-50">
          <div ref={pdfRef}><PDFBody invoice={invoice} /></div>
        </div>
      </div>
    </div>
  );
}
