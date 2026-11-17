import { useState } from 'react';
import { Receipt, Plus, Eye, Edit2, ArrowLeftRight, Download, Trash2, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useInvoicesQuery } from '@/features/invoices/queries';
import { useUpdateInvoice, useDeleteInvoice, useConvertDocument } from '@/features/invoices/mutations';
import { invoicesApi } from '@/features/invoices/api';
import type { Invoice } from '@/types';
import InvoiceEditorModal from './InvoiceEditorModal';
import InvoicePDF from '@/components/admin/InvoicePDF';

const fmt     = (n: number) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(n);
const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-ZA');

const STATUS_COLOURS: Record<string, string> = {
  draft:    'bg-gray-100 text-gray-600',
  sent:     'bg-blue-100 text-blue-700',
  paid:     'bg-green-100 text-green-700',
  overdue:  'bg-red-100 text-red-700',
};

const TYPE_COLOURS: Record<string, string> = {
  invoice: 'bg-brand-primary/10 text-brand-primary',
  quote:   'bg-amber-100 text-amber-700',
};

export default function InvoicesPage() {
  const [page,       setPage]       = useState(1);
  const [search,     setSearch]     = useState('');
  const [liveSearch, setLiveSearch] = useState('');
  const [filterType,   setFilterType]   = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [editorOpen,    setEditorOpen]    = useState(false);
  const [editInvoice,   setEditInvoice]   = useState<Invoice | undefined>();
  const [pdfInvoice,    setPdfInvoice]    = useState<Invoice | null>(null);
  const [downloadInv,   setDownloadInv]   = useState<Invoice | null>(null);
  const [deleteId,      setDeleteId]      = useState<string | null>(null);
  const [convertTarget, setConvertTarget] = useState<Invoice | null>(null);

  const { data, isLoading } = useInvoicesQuery({ page, search, type: filterType, status: filterStatus });
  const updateMutation  = useUpdateInvoice();
  const deleteMutation  = useDeleteInvoice();
  const convertMutation = useConvertDocument();

  const invoices   = data?.data ?? [];
  const total      = data?.total ?? 0;
  const totalPages = Math.ceil(total / 20);

  function applySearch() { setSearch(liveSearch); setPage(1); }
  function clearFilters() { setSearch(''); setLiveSearch(''); setFilterType(''); setFilterStatus(''); setPage(1); }
  const hasFilters = search || filterType || filterStatus;

  function openEdit(inv: Invoice) { setEditInvoice(inv); setEditorOpen(true); }
  function openNew()              { setEditInvoice(undefined); setEditorOpen(true); }

  async function openPDF(inv: Invoice) {
    // fetch full invoice with items if not already loaded
    if (!inv.invoice_items) {
      const res = await invoicesApi.getById(inv.id);
      setPdfInvoice(res.data);
    } else {
      setPdfInvoice(inv);
    }
  }

  async function handleDownload(inv: Invoice) {
    if (!inv.invoice_items) {
      const res = await invoicesApi.getById(inv.id);
      setDownloadInv(res.data);
    } else {
      setDownloadInv(inv);
    }
  }

  function handleStatusChange(id: string, status: string) {
    updateMutation.mutate({ id, payload: { status } });
  }

  function handleDelete() {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
  }

  function handleConvert() {
    if (!convertTarget) return;
    const newType = convertTarget.document_type === 'invoice' ? 'quote' : 'invoice';
    convertMutation.mutate({ id: convertTarget.id, newType }, { onSuccess: () => setConvertTarget(null) });
  }

  return (
    <div className="space-y-4">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-brand-primary" />
          <h1 className="text-lg font-bold text-brand-primary">Invoices & Quotes</h1>
        </div>
        <button onClick={openNew} className="flex items-center gap-1.5 bg-brand-gradient text-white text-xs font-semibold px-3 py-2 rounded-lg hover:opacity-90 transition-opacity">
          <Plus className="w-3.5 h-3.5" /> New Document
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-1.5 flex-1 min-w-[160px] border border-gray-200 rounded-lg px-3 py-1.5">
          <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <input
            value={liveSearch}
            onChange={e => setLiveSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && applySearch()}
            placeholder="Search name or doc #..."
            className="text-sm flex-1 outline-none bg-transparent"
          />
        </div>
        <select value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none">
          <option value="">All Types</option>
          <option value="invoice">Invoice</option>
          <option value="quote">Quote</option>
        </select>
        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none">
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
        <button onClick={applySearch} className="bg-brand-primary text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-brand-primary/90">
          Search
        </button>
        {hasFilters && (
          <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
            <X className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      {/* ── Desktop table ── */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {['Doc #', 'Type', 'Client', 'Matter Ref', 'Date', 'Total', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr><td colSpan={8} className="py-12 text-center text-sm text-gray-400">Loading...</td></tr>
            ) : invoices.length === 0 ? (
              <tr><td colSpan={8} className="py-12 text-center text-sm text-gray-400">No documents found.</td></tr>
            ) : invoices.map(inv => (
              <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs font-semibold text-brand-primary">{inv.invoice_number}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${TYPE_COLOURS[inv.document_type]}`}>
                    {inv.document_type}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-800">{inv.customer_name}</div>
                  {inv.customer_email && <div className="text-xs text-gray-400">{inv.customer_email}</div>}
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">{inv.matter_reference || '—'}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{fmtDate(inv.invoice_date)}</td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-800">{fmt(inv.total_amount)}</td>
                <td className="px-4 py-3">
                  {inv.document_type === 'invoice' ? (
                    <select
                      value={inv.status}
                      onChange={e => handleStatusChange(inv.id, e.target.value)}
                      className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer outline-none ${STATUS_COLOURS[inv.status]}`}
                    >
                      {['draft','sent','paid','overdue'].map(s => <option key={s} value={s} className="bg-white text-gray-800 capitalize">{s}</option>)}
                    </select>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => openPDF(inv)} title="View PDF" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-brand-primary transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => openEdit(inv)} title="Edit" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-brand-primary transition-colors">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setConvertTarget(inv)} title={`Convert to ${inv.document_type === 'invoice' ? 'quote' : 'invoice'}`} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-amber-600 transition-colors">
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDownload(inv)} title="Download PDF" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-brand-primary transition-colors">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setDeleteId(inv.id)} title="Delete" className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
            <span>{total} result{total !== 1 ? 's' : ''} · Page {page} of {totalPages}</span>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}
                className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page >= totalPages}
                className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Mobile cards ── */}
      <div className="md:hidden space-y-3">
        {isLoading ? (
          <div className="text-center py-12 text-sm text-gray-400">Loading...</div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-12 text-sm text-gray-400">No documents found.</div>
        ) : invoices.map(inv => (
          <div key={inv.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 relative">
            {/* Type badge */}
            <span className={`absolute top-3 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${TYPE_COLOURS[inv.document_type]}`}>
              {inv.document_type}
            </span>

            <div className="pr-20">
              <div className="font-mono text-xs font-bold text-brand-primary">{inv.invoice_number}</div>
              <div className="font-semibold text-gray-800 mt-0.5">{inv.customer_name}</div>
              {inv.matter_reference && <div className="text-xs text-gray-400 mt-0.5">{inv.matter_reference}</div>}
            </div>

            <div className="flex items-center justify-between mt-3">
              <div>
                <div className="text-sm font-bold text-gray-800">{fmt(inv.total_amount)}</div>
                <div className="text-xs text-gray-400">{fmtDate(inv.invoice_date)}</div>
              </div>
              {inv.document_type === 'invoice' ? (
                <select
                  value={inv.status}
                  onChange={e => handleStatusChange(inv.id, e.target.value)}
                  className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer outline-none ${STATUS_COLOURS[inv.status]}`}
                >
                  {['draft','sent','paid','overdue'].map(s => <option key={s} value={s} className="bg-white text-gray-800 capitalize">{s}</option>)}
                </select>
              ) : (
                <span className="text-xs text-gray-400">—</span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100">
              <button onClick={() => openPDF(inv)} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-xs font-semibold text-gray-600 transition-colors">
                <Eye className="w-3.5 h-3.5" /> View
              </button>
              <button onClick={() => openEdit(inv)} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-xs font-semibold text-gray-600 transition-colors">
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
              <button onClick={() => setConvertTarget(inv)} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-gray-50 hover:bg-amber-50 text-xs font-semibold text-gray-600 hover:text-amber-700 transition-colors">
                <ArrowLeftRight className="w-3.5 h-3.5" /> Convert
              </button>
              <button onClick={() => handleDownload(inv)} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-xs font-semibold text-gray-600 transition-colors">
                <Download className="w-3.5 h-3.5" /> PDF
              </button>
              <button onClick={() => setDeleteId(inv.id)} className="p-1.5 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {/* Mobile pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between text-xs text-gray-500 px-1">
            <span>Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white disabled:opacity-40">Prev</button>
              <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page >= totalPages}
                className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* ── Modals ── */}

      {editorOpen && (
        <InvoiceEditorModal
          editInvoice={editInvoice}
          onClose={() => { setEditorOpen(false); setEditInvoice(undefined); }}
          onSaved={(inv) => { setEditorOpen(false); setEditInvoice(undefined); setPdfInvoice(inv); }}
        />
      )}

      {pdfInvoice && <InvoicePDF invoice={pdfInvoice} onClose={() => setPdfInvoice(null)} />}
      {downloadInv && <InvoicePDF invoice={downloadInv} autoDownload onClose={() => setDownloadInv(null)} />}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-gray-800 mb-2">Delete Document?</h3>
            <p className="text-sm text-gray-500 mb-5">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleDelete} disabled={deleteMutation.isPending}
                className="flex-1 py-2.5 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-50">
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Convert confirmation */}
      {convertTarget && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-gray-800 mb-2">Convert Document?</h3>
            <p className="text-sm text-gray-500 mb-1">
              Convert <strong>{convertTarget.invoice_number}</strong> from{' '}
              <strong>{convertTarget.document_type}</strong> to{' '}
              <strong>{convertTarget.document_type === 'invoice' ? 'quote' : 'invoice'}</strong>?
            </p>
            <p className="text-xs text-gray-400 mb-5">A new document number will be assigned.</p>
            <div className="flex gap-3">
              <button onClick={() => setConvertTarget(null)} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleConvert} disabled={convertMutation.isPending}
                className="flex-1 py-2.5 rounded-lg bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 disabled:opacity-50">
                {convertMutation.isPending ? 'Converting...' : 'Convert'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
