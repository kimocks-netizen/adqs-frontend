import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Pencil, Trash2, Check, X, ToggleLeft, ToggleRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useServicesQuery } from '@/features/services/queries';
import { useCreateService, useUpdateService, useDeleteService } from '@/features/services/mutations';
import type { Service } from '@/features/services/api';

const EMPTY: Omit<Service, 'id'> = {
  title: '', slug: '', summary: '', intro: '', areas: [], icon: '', display_order: 0, is_active: true,
};

function toSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
}

function ServiceForm({
  initial,
  onSave,
  onCancel,
  isPending,
}: {
  initial: Omit<Service, 'id'>;
  onSave: (data: Omit<Service, 'id'>) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [form, setForm] = useState(initial);
  const [slugManual, setSlugManual] = useState(!!initial.slug);
  const [areasText, setAreasText] = useState(initial.areas.join('\n'));

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    if (name === 'slug') setSlugManual(true);
    if (name === 'title' && !slugManual) {
      setForm((p) => ({ ...p, title: value, slug: toSlug(value) }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  }

  function handleSubmit() {
    const areas = areasText.split('\n').map((a) => a.trim()).filter(Boolean);
    onSave({ ...form, areas });
  }

  const inputClass = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/50';

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Title *</label>
          <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Labour Relations" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Slug</label>
          <input name="slug" value={form.slug} onChange={handleChange} placeholder="labour-relations" className={inputClass + ' font-mono text-xs'} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Summary (card subtitle)</label>
        <input name="summary" value={form.summary} onChange={handleChange} placeholder="One-line summary shown on cards…" className={inputClass} />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Intro (detail page)</label>
        <textarea name="intro" value={form.intro} onChange={handleChange} rows={3} placeholder="Introductory paragraph for the service detail page…" className={inputClass + ' resize-none'} />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Areas (one per line)</label>
        <textarea value={areasText} onChange={(e) => setAreasText(e.target.value)} rows={5} placeholder={"Disciplinary Hearings\nUnfair Dismissal\nCCMA Representation"} className={inputClass + ' resize-none font-mono text-xs'} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Icon (lucide name)</label>
          <input name="icon" value={form.icon} onChange={handleChange} placeholder="e.g. Scale" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Display Order</label>
          <input name="display_order" type="number" value={form.display_order} onChange={handleChange} className={inputClass} />
        </div>
      </div>
      <div className="flex items-center gap-3 pt-1">
        <button onClick={handleSubmit} disabled={isPending || !form.title.trim()}
          className="flex items-center gap-2 bg-brand-gradient text-white text-sm font-bold px-5 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity">
          <Check className="w-4 h-4" /> {isPending ? 'Saving…' : 'Save Service'}
        </button>
        <button onClick={onCancel} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">
          <X className="w-4 h-4" /> Cancel
        </button>
      </div>
    </div>
  );
}

export default function AdminServicesPage() {
  const { data, isLoading } = useServicesQuery();
  const services = (data?.data ?? []).slice().sort((a, b) => a.display_order - b.display_order);

  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function handleCreate(data: Omit<Service, 'id'>) {
    createService.mutate(data, { onSuccess: () => setShowAdd(false) });
  }

  function handleUpdate(id: string, data: Omit<Service, 'id'>) {
    updateService.mutate({ id, ...data }, { onSuccess: () => setEditId(null) });
  }

  function handleToggleActive(service: Service) {
    updateService.mutate({ id: service.id, is_active: !service.is_active });
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-primary">Services</h1>
          <p className="text-sm text-gray-500 mt-0.5">{services.length} service{services.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => { setShowAdd((v) => !v); setEditId(null); }}
          className="flex items-center gap-2 bg-brand-gradient text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          <PlusCircle className="w-4 h-4" /> Add Service
        </button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <ServiceForm
              initial={EMPTY}
              onSave={handleCreate}
              onCancel={() => setShowAdd(false)}
              isPending={createService.isPending}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Services list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-gray-400 text-sm">Loading services…</div>
      ) : (
        <div className="space-y-3">
          {services.map((service) => (
            <motion.div key={service.id} layout className="bg-white rounded-xl border border-gray-100 shadow-card overflow-hidden">
              {editId === service.id ? (
                <div className="p-4">
                  <ServiceForm
                    initial={service}
                    onSave={(data) => handleUpdate(service.id, data)}
                    onCancel={() => setEditId(null)}
                    isPending={updateService.isPending}
                  />
                </div>
              ) : (
                <>
                  {/* Row */}
                  <div className="flex items-center gap-4 px-5 py-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-800 truncate">{service.title}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${service.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                          {service.is_active ? 'Active' : 'Hidden'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{service.summary}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setExpandedId(expandedId === service.id ? null : service.id)}
                        className="p-1.5 text-gray-400 hover:text-brand-primary rounded-lg hover:bg-gray-50 transition-colors"
                        title="View areas"
                      >
                        {expandedId === service.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleToggleActive(service)}
                        className="p-1.5 text-gray-400 hover:text-brand-primary rounded-lg hover:bg-gray-50 transition-colors"
                        title={service.is_active ? 'Hide service' : 'Show service'}
                      >
                        {service.is_active ? <ToggleRight className="w-4 h-4 text-green-500" /> : <ToggleLeft className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => { setEditId(service.id); setShowAdd(false); }}
                        className="p-1.5 text-gray-400 hover:text-brand-primary rounded-lg hover:bg-gray-50 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(service.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded areas */}
                  <AnimatePresence>
                    {expandedId === service.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-gray-100"
                      >
                        <div className="px-5 py-3 flex flex-wrap gap-2">
                          {service.areas.map((area) => (
                            <span key={area} className="text-xs bg-brand-primary/8 text-brand-primary px-2.5 py-1 rounded-full font-medium">
                              {area}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete modal */}
      <AnimatePresence>
        {deleteId && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Service?</h3>
                <p className="text-sm text-gray-500 mb-6">This will remove it from the public site. This cannot be undone.</p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 text-sm font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</button>
                  <button
                    onClick={() => { deleteService.mutate(deleteId); setDeleteId(null); }}
                    className="flex-1 py-2.5 text-sm font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600"
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
