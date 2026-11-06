import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Trash2, X, CheckCheck, Eye, Search, ShieldCheck, ShieldOff, RefreshCw, Reply, ChevronLeft, ChevronRight } from 'lucide-react';
import { contactApi, type Enquiry } from '@/features/contact/api';

const PAGE_SIZE = 20;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
}

const STATUS_STYLES: Record<Enquiry['status'], string> = {
  New:     'bg-yellow-100 text-yellow-700',
  Read:    'bg-gray-100 text-gray-600',
  Replied: 'bg-green-100 text-green-700',
};

export default function EnquiriesPage() {
  const qc = useQueryClient();
  const [selected, setSelected]           = useState<Enquiry | null>(null);
  const [deleteId, setDeleteId]           = useState<string | null>(null);
  const [search, setSearch]               = useState('');
  const [filterStatus, setFilterStatus]   = useState<'All' | Enquiry['status']>('All');
  const [page, setPage]                   = useState(1);

  // Reset to page 1 when filters change
  function applyFilter(s: 'All' | Enquiry['status']) { setFilterStatus(s); setPage(1); }
  function applySearch(v: string)                     { setSearch(v);       setPage(1); }

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['enquiries', filterStatus, search, page],
    queryFn: () => contactApi.getAll({ status: filterStatus, search, page }),
    staleTime: 0,
  });

  const enquiries  = data?.data  ?? [];
  const total      = data?.count ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const newCount   = enquiries.filter((e) => e.status === 'New').length;

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => contactApi.updateStatus(id, status),
    onSuccess: (_, { id, status }) => {
      qc.invalidateQueries({ queryKey: ['enquiries'] });
      setSelected((prev) => prev?.id === id ? { ...prev, status: status as Enquiry['status'] } : prev);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => contactApi.remove(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ['enquiries'] });
      setDeleteId(null);
      if (selected?.id === id) setSelected(null);
    },
  });

  function openEnquiry(enq: Enquiry) {
    setSelected(enq);
    if (enq.status === 'New') statusMutation.mutate({ id: enq.id, status: 'Read' });
  }

  return (
    <div className="space-y-6 max-w-6xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-primary">Enquiries</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isLoading ? 'Loading…' : `${total} total · ${newCount} unread`}
          </p>
        </div>
        <button onClick={() => refetch()} className="text-gray-400 hover:text-brand-primary transition-colors" title="Refresh">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => applySearch(e.target.value)}
            placeholder="Search by name, email or area…"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/50" />
        </div>
        <div className="flex gap-2">
          {(['All', 'New', 'Read', 'Replied'] as const).map((s) => (
            <button key={s} onClick={() => applyFilter(s)}
              className={`relative px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                filterStatus === s ? 'bg-brand-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}>
              {s}
              {/* New counter badge on the All and New pills */}
              {s === 'New' && newCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {newCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-gray-400 gap-3">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading enquiries…</span>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <p className="text-sm text-red-500">Failed to load enquiries.</p>
            <button onClick={() => refetch()} className="text-xs text-brand-primary underline">Try again</button>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Mail className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm">No enquiries found.</p>
          </div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <th className="text-left px-5 py-3">Name</th>
                  <th className="text-left px-5 py-3 hidden md:table-cell">Email</th>
                  <th className="text-left px-5 py-3 hidden lg:table-cell">Area</th>
                  <th className="text-left px-5 py-3 hidden sm:table-cell">Date</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {enquiries.map((enq) => (
                  <tr key={enq.id} onClick={() => openEnquiry(enq)}
                    className={`cursor-pointer transition-colors ${
                      selected?.id === enq.id
                        ? 'bg-blue-50/40'
                        : enq.status === 'New'
                          ? 'bg-gray-50/80 hover:bg-gray-100/80'
                          : 'bg-white hover:bg-gray-50'
                    }`}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        {/* Unread dot */}
                        {enq.status === 'New' && (
                          <span className="w-2 h-2 rounded-full bg-brand-primary shrink-0" />
                        )}
                        <span className={`${enq.status === 'New' ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>
                          {enq.name}
                        </span>
                        {enq.email_verified
                          ? <ShieldCheck className="w-3.5 h-3.5 text-green-500 shrink-0" />
                          : <ShieldOff className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                      </div>
                    </td>
                    <td className={`px-5 py-3.5 hidden md:table-cell ${enq.status === 'New' ? 'text-gray-700' : 'text-gray-500'}`}>
                      {enq.email}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 hidden lg:table-cell">{enq.area_of_enquiry}</td>
                    <td className="px-5 py-3.5 text-gray-400 hidden sm:table-cell">{formatDate(enq.created_at)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_STYLES[enq.status]}`}>
                        {enq.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button onClick={(e) => { e.stopPropagation(); setDeleteId(enq.id); }}
                        className="text-gray-300 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50">
                <p className="text-xs text-gray-400">
                  Page {page} of {totalPages} · {total} total
                </p>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-brand-primary hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .reduce<(number | '...')[]>((acc, p, i, arr) => {
                      if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('...');
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === '...' ? (
                        <span key={`ellipsis-${i}`} className="px-1 text-xs text-gray-400">…</span>
                      ) : (
                        <button key={p} onClick={() => setPage(p as number)}
                          className={`w-7 h-7 text-xs font-semibold rounded-lg transition-colors ${
                            page === p ? 'bg-brand-primary text-white' : 'text-gray-500 hover:bg-white hover:text-brand-primary'
                          }`}>
                          {p}
                        </button>
                      )
                    )}
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-brand-primary hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail side panel */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)} className="fixed inset-0 bg-black/20 z-40" />
            <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed top-0 right-0 h-screen w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">

              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-brand-primary">{selected.name}</p>
                    {selected.email_verified
                      ? <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full"><ShieldCheck className="w-3 h-3" />Verified</span>
                      : <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full"><ShieldOff className="w-3 h-3" />Unverified</span>}
                  </div>
                  <p className="text-xs text-gray-400">{formatDate(selected.created_at)}</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${STATUS_STYLES[selected.status]}`}>
                  {selected.status}
                </span>
                <div className="space-y-2 text-sm">
                  <Row label="Email" value={selected.email} />
                  <Row label="Phone" value={selected.phone || '—'} />
                  <Row label="Organisation" value={selected.organisation || '—'} />
                  <Row label="Area of Enquiry" value={selected.area_of_enquiry} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Message</p>
                  <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-4 border border-gray-100">
                    {selected.message}
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 space-y-2">
                <a
                  href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: Your ADQS Enquiry — ${selected.area_of_enquiry}`)}&body=${encodeURIComponent(`Dear ${selected.name},\n\nThank you for your enquiry regarding ${selected.area_of_enquiry}.\n\n`)}`}
                  onClick={() => { if (selected.status !== 'Replied') statusMutation.mutate({ id: selected.id, status: 'Replied' }); }}
                  className="w-full flex items-center justify-center gap-2 bg-brand-gradient text-white text-sm font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity">
                  <Reply className="w-4 h-4" /> Reply via Email
                </a>
                <div className="flex gap-2">
                  {selected.status !== 'Read' && (
                    <button onClick={() => statusMutation.mutate({ id: selected.id, status: 'Read' })}
                      disabled={statusMutation.isPending}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-60">
                      <Eye className="w-4 h-4" /> Mark as Read
                    </button>
                  )}
                  {selected.status !== 'Replied' && (
                    <button onClick={() => statusMutation.mutate({ id: selected.id, status: 'Replied' })}
                      disabled={statusMutation.isPending}
                      className="flex-1 flex items-center justify-center gap-2 bg-brand-gradient text-white text-sm font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60">
                      <CheckCheck className="w-4 h-4" /> Mark as Replied
                    </button>
                  )}
                </div>
                <button onClick={() => setDeleteId(selected.id)}
                  className="w-full flex items-center justify-center gap-2 text-red-500 text-sm font-semibold py-2.5 rounded-lg border border-red-200 hover:bg-red-50 transition-colors">
                  <Trash2 className="w-4 h-4" /> Delete Enquiry
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <AnimatePresence>
        {deleteId && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Enquiry?</h3>
                <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteId(null)}
                    className="flex-1 py-2.5 text-sm font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button onClick={() => deleteMutation.mutate(deleteId!)}
                    disabled={deleteMutation.isPending}
                    className="flex-1 py-2.5 text-sm font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-60">
                    {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-gray-400 w-32 shrink-0">{label}</span>
      <span className="text-gray-700 font-medium">{value}</span>
    </div>
  );
}
