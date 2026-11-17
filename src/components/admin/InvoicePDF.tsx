'use client';
import React, { useRef } from 'react';
import { Download, Printer, X } from 'lucide-react';
import type { } from '@/types';
import logo from '@/assets/logo.jpg';

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
const PDFBody = ({ invoice, fmt, fmtDate }: { invoice: any; fmt: (n: number) => string; fmtDate: (d: string) => string }) => {
  const isQuote = invoice.document_type === 'quote';
  const label   = isQuote ? 'Quote' : 'Invoice';
  return (
    <div style={{maxWidth:'720px',background:'#fff',padding:'28px 32px',fontFamily:'Arial,sans-serif',color:'#1a1a1a',margin:'0 auto'}}>

      {/* Header */}
      <div style={{borderBottom:'2px solid #C79527',paddingBottom:'16px',marginBottom:'24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          <img src={logo} alt="ADQS" style={{height:'44px',width:'auto',borderRadius:'4px'}} crossOrigin="anonymous" />
          <div>
            <div style={{fontWeight:700,fontSize:'15px',color:'#0B2854'}}>Adequate Strategies (Pty) Ltd</div>
            <div style={{fontSize:'11px',color:'#888'}}>Legal Consulting · Reg: 2024/021247/07</div>
            <div style={{fontSize:'11px',color:'#888'}}>252 Cole Road, Shere, Pretoria, 0084</div>
          </div>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:'22px',fontWeight:900,color:'#0B2854',textTransform:'uppercase',letterSpacing:'0.05em'}}>{label}</div>
          <div style={{fontSize:'12px',color:'#C79527',fontWeight:700}}>{invoice.invoice_number}</div>
        </div>
      </div>

      {/* Bill To + Details */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'20px'}}>
        <div>
          <h3 style={{fontWeight:700,marginBottom:'8px',fontSize:'14px'}}>{label} To:</h3>
          <p style={{fontWeight:600,margin:'2px 0'}}>{invoice.customer_name}</p>
          {invoice.customer_email && <p style={{fontSize:'13px',color:'#6b7280',margin:'2px 0'}}>{invoice.customer_email}</p>}
          {invoice.customer_phone && <p style={{fontSize:'13px',color:'#6b7280',margin:'2px 0'}}>{invoice.customer_phone}</p>}
          {invoice.matter_reference && <p style={{fontSize:'13px',color:'#6b7280',margin:'2px 0'}}>Matter Ref: {invoice.matter_reference}</p>}
        </div>
        <div style={{textAlign:'right'}}>
          <h3 style={{fontWeight:700,marginBottom:'8px',fontSize:'14px'}}>{label} Details:</h3>
          <p style={{fontSize:'13px',margin:'2px 0'}}><strong>Number:</strong> {invoice.invoice_number}</p>
          <p style={{fontSize:'13px',margin:'2px 0'}}><strong>Date:</strong> {fmtDate(invoice.invoice_date)}</p>
          {invoice.due_date && <p style={{fontSize:'13px',margin:'2px 0'}}><strong>Due:</strong> {fmtDate(invoice.due_date)}</p>}
          {!isQuote && <p style={{fontSize:'13px',margin:'2px 0'}}><strong>Status:</strong> {invoice.status?.toUpperCase()}</p>}
        </div>
      </div>

      {/* Line items */}
      <table style={{width:'100%',borderCollapse:'collapse',marginBottom:'20px',fontSize:'13px',pageBreakInside:'auto'}}>
        <thead>
          <tr style={{background:'#0B2854'}}>
            <th style={{border:'1px solid #e5e7eb',padding:'10px 12px',textAlign:'left',color:'#fff'}}>Description</th>
            <th style={{border:'1px solid #e5e7eb',padding:'10px 12px',textAlign:'right',color:'#fff'}}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.invoice_items?.length ? invoice.invoice_items.map((item: {description:string;amount:number}, i: number) => (
            <tr key={i} style={{pageBreakInside:'avoid'}}>
              <td style={{border:'1px solid #e5e7eb',padding:'10px 12px'}}>{item.description}</td>
              <td style={{border:'1px solid #e5e7eb',padding:'10px 12px',textAlign:'right'}}>{fmt(item.amount)}</td>
            </tr>
          )) : (
            <tr>
              <td style={{border:'1px solid #e5e7eb',padding:'10px 12px',color:'#888'}}>No items</td>
              <td style={{border:'1px solid #e5e7eb',padding:'10px 12px',textAlign:'right'}}>—</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Total */}
      <div style={{textAlign:'right',marginBottom:'8px'}}>
        <p style={{fontSize:'18px',fontWeight:700,borderTop:'2px solid #e5e7eb',paddingTop:'8px',display:'inline-block'}}>
          Total: {fmt(invoice.total_amount)}
        </p>
      </div>

      {/* VAT note */}
      <p style={{fontSize:'10px',color:'#aaa',textAlign:'right',marginBottom:'20px',fontStyle:'italic'}}>
        Adequate Strategies (Pty) Ltd is not registered for VAT. No VAT is applicable to this {label.toLowerCase()}.
      </p>

      {/* Banking */}
      <div style={{background:'#f9fafb',borderRadius:'7px',padding:'16px',marginBottom:'20px'}}>
        <h3 style={{fontWeight:700,marginBottom:'8px',fontSize:'14px'}}>Banking Details</h3>
        <table style={{width:'100%',fontSize:'13px',borderCollapse:'collapse'}}>
          <tbody>
            {[...BANKING, ['Reference', invoice.invoice_number]].map(([k,v]) => (
              <tr key={k}>
                <td style={{padding:'2px 8px 2px 0',fontWeight:600,width:'40%'}}>{k}:</td>
                <td style={{padding:'2px 0',color:'#374151'}}>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{textAlign:'center',borderTop:'2px solid #e5e7eb',paddingTop:'12px',marginTop:'16px'}}>
        <p style={{fontWeight:600,margin:'0 0 3px',fontSize:'13px'}}>Thank you for choosing Adequate Strategies (Pty) Ltd!</p>
        <p style={{fontSize:'11px',color:'#6b7280',margin:0}}>252 Cole Road, Shere, Pretoria · info@adqs.co.za · adqs.co.za · Confidential</p>
      </div>

    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const InvoicePDF: React.FC<{ invoice: any; onClose: () => void; autoDownload?: boolean }> = ({ invoice, onClose, autoDownload = false }) => {
  // Off-screen ref — always in DOM, outside Tailwind/oklch styles, same as DocumentEditorPage
  const pdfRef = useRef<HTMLDivElement>(null);

  const fmt     = (n: number) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(n);
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleDownload = React.useCallback(async () => {
    if (!pdfRef.current) return;
    const html2pdf = (await import('html2pdf.js')).default;
    html2pdf()
      .set({
        margin: [15, 15, 15, 15],
        filename: `${invoice.invoice_number}.pdf`,
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(pdfRef.current)
      .save();
    if (autoDownload) onClose();
  }, [invoice.invoice_number, autoDownload, onClose]);

  React.useEffect(() => {
    if (autoDownload) { const t = setTimeout(handleDownload, 400); return () => clearTimeout(t); }
  }, [autoDownload, handleDownload]);

  return (
    <>
      {/* Off-screen print target — always in DOM, no Tailwind classes, no oklch */}
      <div ref={pdfRef} style={{position:'fixed',left:'-9999px',top:0,width:'720px',pointerEvents:'none',zIndex:-1,background:'#fff'}}>
        <PDFBody invoice={invoice} fmt={fmt} fmtDate={fmtDate} />
      </div>

      {/* Modal — only shown when not autoDownload */}
      {!autoDownload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col shadow-xl">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 shrink-0">
              <h2 className="font-bold text-brand-primary">{invoice.invoice_number}</h2>
              <div className="flex gap-2 flex-wrap justify-end">
                <button onClick={handleDownload} className="flex items-center gap-2 px-3 py-2 bg-brand-gradient text-white rounded-lg text-sm hover:opacity-90 transition-opacity">
                  <Download className="w-4 h-4" /><span>Download</span>
                </button>
                <button onClick={() => window.print()} className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors">
                  <Printer className="w-4 h-4" /><span>Print</span>
                </button>
                <button onClick={onClose} className="flex items-center gap-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors">
                  <X className="w-4 h-4" /><span>Close</span>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-6" style={{background:'#f9fafb'}}>
              {/* Display-only copy — no ref, just for viewing */}
              <PDFBody invoice={invoice} fmt={fmt} fmtDate={fmtDate} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InvoicePDF;
