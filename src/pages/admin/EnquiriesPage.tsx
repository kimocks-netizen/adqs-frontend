import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Trash2, X, CheckCheck, Eye, Search } from 'lucide-react';

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  organisation: string;
  area: string;
  message: string;
  date: string;
  status: 'New' | 'Read' | 'Replied';
}

const DUMMY: Enquiry[] = [
  {
    id: '1',
    name: 'Thabo Mokoena',
    email: 'thabo@example.com',
    phone: '+27 82 111 2233',
    organisation: 'Mokoena Holdings',
    area: 'Labour Relations',
    message: 'We are facing a dispute with a former employee regarding unfair dismissal. We need urgent legal advice on how to proceed with the CCMA process and what our obligations are as an employer.',
    date: '2025-01-14',
    status: 'New',
  },
  {
    id: '2',
    name: 'Nomsa Dlamini',
    email: 'nomsa@example.com',
    phone: '+27 73 444 5566',
    organisation: 'Dlamini & Associates',
    area: 'Regulatory Compliance',
    message: 'Our company needs a compliance audit and guidance on POPIA implementation. We have about 50 employees and handle customer data regularly.',
    date: '2025-01-13',
    status: 'New',
  },
  {
    id: '3',
    name: 'Sipho Khumalo',
    email: 'sipho@example.com',
    phone: '+27 61 777 8899',
    organisation: '',
    area: 'Contracts & Commercial',
    message: 'I need a commercial lease agreement reviewed before signing. The landlord has included some clauses I am not comfortable with and would like a legal opinion.',
    date: '2025-01-12',
    status: 'Read',
  },
  {
    id: '4',
    name: 'Lerato Sithole',
    email: 'lerato@example.com',
    phone: '+27 84 222 3344',
    organisation: 'Sithole Consulting',
    area: 'Human Rights',
    message: 'We believe our client has been discriminated against in the workplace based on their disability. We would like to understand the legal remedies available under the Employment Equity Act.',
    date: '2025-01-11',
    status: 'Read',
  },
  {
    id: '5',
    name: 'Andile Nkosi',
    email: 'andile@example.com',
    phone: '+27 79 555 6677',
    organisation: 'Nkosi Enterprises',
    area: 'General Enquiry',
    message: 'I would like to know more about your retainer services for small businesses. We are a startup and need ongoing legal support but are not sure what package would suit us.',
    date: '2025-01-10',
    status: 'Replied',
  },
  {
    id: '6',
    name: 'Zanele Mahlangu',
    email: 'zanele@example.com',
    phone: '+27 66 888 9900',
    organisation: 'Mahlangu Group',
    area: 'Administrative Law',
    message: 'We received an adverse decision from a government department and want to challenge it. Please advise on the review process and timelines.',
    date: '2025-01-09',
    status: 'Replied',
  },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
}

const STATUS_STYLES: Record<Enquiry['status'], string> = {
  New: 'bg-yellow-100 text-yellow-700',
  Read: 'bg-gray-100 text-gray-600',
  Replied: 'bg-green-100 text-green-700',
};

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(DUMMY);
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | Enquiry['status']>('All');

  const filtered = enquiries.filter((e) => {
    const matchSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.area.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || e.status === filterStatus;
    return matchSearch && matchStatus;
  });

  function updateStatus(id: string, status: Enquiry['status']) {
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    setSelected((prev) => (prev?.id === id ? { ...prev, status } : prev));
  }

  function confirmDelete(id: string) {
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
    setDeleteId(null);
    if (selected?.id === id) setSelected(null);
  }

  const newCount = enquiries.filter((e) => e.status === 'New').length;

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-primary">Enquiries</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {enquiries.length} total · {newCount} new
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or area…"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/50"
          />
        </div>
        <div className="flex gap-2">
          {(['All', 'New', 'Read', 'Replied'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                filterStatus === s
                  ? 'bg-brand-primary text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Mail className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm">No enquiries found.</p>
          </div>
        ) : (
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
              {filtered.map((enq) => (
                <tr
                  key={enq.id}
                  onClick={() => setSelected(enq)}
                  className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                    selected?.id === enq.id ? 'bg-blue-50/40' : ''
                  }`}
                >
                  <td className="px-5 py-3.5 font-semibold text-gray-800">{enq.name}</td>
                  <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{enq.email}</td>
                  <td className="px-5 py-3.5 text-gray-500 hidden lg:table-cell">{enq.area}</td>
                  <td className="px-5 py-3.5 text-gray-400 hidden sm:table-cell">{formatDate(enq.date)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_STYLES[enq.status]}`}>
                      {enq.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteId(enq.id); }}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail side panel */}
      <AnimatePresence>
        {selected && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 bg-black/20 z-40"
            />
            {/* Panel */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed top-0 right-0 h-screen w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Panel header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
                <div>
                  <p className="font-bold text-brand-primary">{selected.name}</p>
                  <p className="text-xs text-gray-400">{formatDate(selected.date)}</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Panel body */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                {/* Status badge */}
                <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${STATUS_STYLES[selected.status]}`}>
                  {selected.status}
                </span>

                {/* Contact details */}
                <div className="space-y-2 text-sm">
                  <Row label="Email" value={selected.email} />
                  <Row label="Phone" value={selected.phone || '—'} />
                  <Row label="Organisation" value={selected.organisation || '—'} />
                  <Row label="Area of Enquiry" value={selected.area} />
                </div>

                {/* Message */}
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Message</p>
                  <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-4 border border-gray-100">
                    {selected.message}
                  </p>
                </div>
              </div>

              {/* Panel actions */}
              <div className="px-6 py-4 border-t border-gray-100 space-y-2">
                <div className="flex gap-2">
                  {selected.status !== 'Read' && (
                    <button
                      onClick={() => updateStatus(selected.id, 'Read')}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Eye className="w-4 h-4" /> Mark as Read
                    </button>
                  )}
                  {selected.status !== 'Replied' && (
                    <button
                      onClick={() => updateStatus(selected.id, 'Replied')}
                      className="flex-1 flex items-center justify-center gap-2 bg-brand-gradient text-white text-sm font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <CheckCheck className="w-4 h-4" /> Mark as Replied
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setDeleteId(selected.id)}
                  className="w-full flex items-center justify-center gap-2 text-red-500 text-sm font-semibold py-2.5 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Delete Enquiry
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Enquiry?</h3>
                <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteId(null)}
                    className="flex-1 py-2.5 text-sm font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => confirmDelete(deleteId)}
                    className="flex-1 py-2.5 text-sm font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    Delete
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
