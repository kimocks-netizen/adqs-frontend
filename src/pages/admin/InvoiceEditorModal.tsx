import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import type { Invoice, InvoiceItem } from '@/types';
import { useCreateInvoice, useUpdateInvoice } from '@/features/invoices/mutations';

interface Props {
  onClose: () => void;
  onSaved: (invoice: Invoice) => void;
  editInvoice?: Invoice;
}

const EMPTY_ITEM = (): InvoiceItem => ({ description: '', amount: 0 });

export default function InvoiceEditorModal({ onClose, onSaved, editInvoice }: Props) {
  const isEditing = !!editInvoice;
  const createMutation = useCreateInvoice();
  const updateMutation = useUpdateInvoice();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const [docType,  setDocType]  = useState<'invoice' | 'quote'>(editInvoice?.document_type ?? 'invoice');
  const [name,     setName]     = useState(editInvoice?.customer_name    ?? '');
  const [email,    setEmail]    = useState(editInvoice?.customer_email   ?? '');
  const [phone,    setPhone]    = useState(editInvoice?.customer_phone   ?? '');
  const [matter,   setMatter]   = useState(editInvoice?.matter_reference ?? '');
  const [date,     setDate]     = useState(editInvoice?.invoice_date     ?? new Date().toISOString().split('T')[0]);
  const [dueDate,  setDueDate]  = useState(editInvoice?.due_date         ?? '');
  const [notes,    setNotes]    = useState(editInvoice?.notes            ?? '');
  const [items,    setItems]    = useState<InvoiceItem[]>(
    editInvoice?.invoice_items?.length ? editInvoice.invoice_items : [EMPTY_ITEM()]
  );

  useEffect(() => {
    if (editInvoice) {
      setDocType(editInvoice.document_type);
      setName(editInvoice.customer_name);
      setEmail(editInvoice.customer_email ?? '');
      setPhone(editInvoice.customer_phone ?? '');
      setMatter(editInvoice.matter_reference ?? '');
      setDate(editInvoice.invoice_date);
      setDueDate(editInvoice.due_date ?? '');
      setNotes(editInvoice.notes ?? '');
      setItems(editInvoice.invoice_items?.length ? editInvoice.invoice_items : [EMPTY_ITEM()]);
    }
  }, [editInvoice]);

  const total = items.reduce((s, i) => s + (parseFloat(String(i.amount)) || 0), 0);

  const updateItem = (idx: number, field: keyof InvoiceItem, value: string) =>
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, [field]: field === 'amount' ? value : value } : it));

  const removeItem = (idx: number) => setItems(prev => prev.filter((_, i) => i !== idx));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Normalize notes: trim, collapse excess whitespace, clean up line breaks
    const cleanNotes = notes.trim().replace(/[^\S\n]+/g, ' ').replace(/\n{3,}/g, '\n\n');
    const payload = {
      document_type: docType,
      customer_name: name.trim(),
      customer_email: email.trim() || undefined,
      customer_phone: phone.trim() || undefined,
      matter_reference: matter.trim() || undefined,
      invoice_date: date,
      due_date: dueDate || undefined,
      notes: cleanNotes || undefined,
      items: items.map(i => ({ description: i.description.trim(), amount: parseFloat(String(i.amount)) || 0 })),
    };

    if (isEditing && editInvoice) {
      updateMutation.mutate({ id: editInvoice.id, payload }, {
        onSuccess: (res) => onSaved(res.data),
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: (res) => onSaved(res.data),
      });
    }
  }

  const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20';
  const labelCls = 'block text-xs font-semibold text-gray-600 mb-1';

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white w-full sm:rounded-2xl sm:max-w-2xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl rounded-t-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-sm font-bold text-brand-primary">
            {isEditing ? 'Edit' : 'New'} {docType === 'quote' ? 'Quote' : 'Invoice'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-4">

            {/* Document type */}
            <div>
              <label className={labelCls}>Document Type</label>
              <div className="flex gap-2">
                {(['invoice', 'quote'] as const).map(t => (
                  <button key={t} type="button"
                    onClick={() => setDocType(t)}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-colors capitalize ${
                      docType === t ? 'bg-brand-gradient text-white border-transparent' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-primary/40'
                    }`}
                  >{t}</button>
                ))}
              </div>
            </div>

            {/* Customer details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className={labelCls}>Client Name *</label>
                <input value={name} onChange={e => setName(e.target.value)} required minLength={3} maxLength={100} className={inputCls} placeholder="Full name or company" />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} maxLength={100} className={inputCls} placeholder="client@example.com" />
              </div>
              <div>
                <label className={labelCls}>Phone</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} minLength={7} maxLength={20} className={inputCls} placeholder="0XX XXX XXXX" />
              </div>
              <div>
                <label className={labelCls}>Matter Reference</label>
                <input value={matter} onChange={e => setMatter(e.target.value)} minLength={3} maxLength={50} className={inputCls} placeholder="ADQS/2025/001" />
              </div>
              <div>
                <label className={labelCls}>{docType === 'quote' ? 'Quote' : 'Invoice'} Date *</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Due Date</label>
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className={inputCls} />
              </div>
            </div>

            {/* Line items */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelCls + ' mb-0'}>Line Items *</label>
                <button type="button" onClick={() => setItems(p => [...p, EMPTY_ITEM()])}
                  className="flex items-center gap-1 text-xs font-semibold text-brand-primary hover:text-brand-primary/80">
                  <Plus className="w-3.5 h-3.5" /> Add item
                </button>
              </div>
              <div className="space-y-2">
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <input
                        value={item.description}
                        onChange={e => updateItem(idx, 'description', e.target.value)}
                        required
                        minLength={3}
                        maxLength={300}
                        placeholder="e.g. Legal consultation — contract review"
                        className={inputCls + ' w-full'}
                      />
                      {item.description.length >= 290 && (
                        <div className="text-right text-[10px] mt-0.5 text-red-400">
                          {300 - item.description.length} of 300 left
                        </div>
                      )}
                    </div>
                    <div className="relative w-32 shrink-0">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">R</span>
                      <input
                        type="number" min="0" step="0.01"
                        value={item.amount || ''}
                        onChange={e => updateItem(idx, 'amount', e.target.value)}
                        required
                        placeholder="0.00"
                        className={inputCls + ' pl-6'}
                      />
                    </div>
                    {items.length > 1 && (
                      <button type="button" onClick={() => removeItem(idx)} className="mt-2 text-gray-300 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="text-right mt-2 text-sm font-bold text-brand-primary">
                Total: R {total.toFixed(2)}
              </div>
            </div>

            {/* Notes */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={labelCls + ' mb-0'}>Notes</label>
                <span className="text-[10px] text-red-400">{notes.length > 990 ? `${1000 - notes.length} of 1000 left` : ''}</span>
              </div>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                maxLength={1000}
                className={inputCls + ' resize-none'} placeholder="Payment terms, special instructions..." />
            </div>

          </div>

          {/* Footer */}
          <div className="flex gap-3 px-5 py-4 border-t border-gray-100 shrink-0 bg-white">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={isLoading}
              className="flex-1 py-2.5 rounded-lg bg-brand-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
              {isLoading ? 'Saving...' : isEditing ? 'Save Changes' : `Create ${docType === 'quote' ? 'Quote' : 'Invoice'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
