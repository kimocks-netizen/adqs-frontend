import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderOpen, Folder, PlusCircle, FilePlus, Trash2,
  FileText, Search, X, Check, Eye,
} from 'lucide-react';
import { useFoldersQuery, useDocumentsQuery } from '@/features/documents/queries';
import { useCreateFolder, useDeleteFolder, useDeleteDocument } from '@/features/documents/mutations';
import type { DocFolder, Document } from '@/features/documents/api';
import logo from '@/assets/logo.jpg';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
}

const STATUS_STYLE = {
  Draft: 'bg-yellow-100 text-yellow-700',
  Final: 'bg-green-100 text-green-700',
};

// FolderItem outside main component to avoid nested component TS errors
function FolderItem({
  folder, activeFolderId, allDocsForCount, subFolders, isDefaultFolder, onSelect, onDelete,
}: {
  folder: DocFolder;
  activeFolderId: string;
  allDocsForCount: Document[];
  subFolders: (id: string) => DocFolder[];
  isDefaultFolder: (id: string) => boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const isActive = folder.id === activeFolderId;
  const subs = subFolders(folder.id);
  const count = allDocsForCount.filter((d) => d.folder_id === folder.id).length;

  return (
    <div>
      <div
        className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm ${
          isActive ? 'bg-brand-primary/15 text-brand-primary font-semibold border-l-2 border-brand-primary' : 'text-gray-600 hover:bg-gray-100'
        }`}
        onClick={() => onSelect(folder.id)}
      >
        {isActive ? <FolderOpen className="w-4 h-4 shrink-0" /> : <Folder className="w-4 h-4 shrink-0" />}
        <span className="flex-1 truncate">{folder.name}</span>
        <span className="text-xs text-gray-400">{count}</span>
        {!isDefaultFolder(folder.id) && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(folder.id); }}
            className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      {subs.length > 0 && (
        <div className="ml-4 mt-0.5 space-y-0.5">
          {subs.map((s) => (
            <FolderItem
              key={s.id} folder={s} activeFolderId={activeFolderId}
              allDocsForCount={allDocsForCount} subFolders={subFolders}
              isDefaultFolder={isDefaultFolder} onSelect={onSelect} onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DocumentsPage() {
  const { data: foldersData } = useFoldersQuery();
  const folders = foldersData?.data ?? [];

  const [activeFolderId, setActiveFolderId] = useState('');
  const activeFolderIdResolved = activeFolderId || folders[0]?.id || '';

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const handleSetFolder = (id: string) => { setActiveFolderId(id); setPage(1); };

  const { data: docsData } = useDocumentsQuery(activeFolderIdResolved || undefined, page, limit);
  const allDocs = docsData?.data ?? [];
  const totalCount = (docsData as { count?: number })?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  // All docs without folder filter — for folder counts only
  const { data: allDocsData } = useDocumentsQuery();
  const allDocsForCount = allDocsData?.data ?? [];

  const createFolder = useCreateFolder();
  const deleteFolder = useDeleteFolder();
  const deleteDocument = useDeleteDocument();

  const [search, setSearch] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [deleteDocId, setDeleteDocId] = useState<string | null>(null);
  const [deleteFolderId, setDeleteFolderId] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);

  const activeFolder = folders.find((f) => f.id === activeFolderIdResolved);
  const rootFolders = folders.filter((f) => f.parent_id === null);
  const subFolders = (parentId: string) => folders.filter((f) => f.parent_id === parentId);
  const isDefaultFolder = (id: string) => folders.findIndex((f) => f.id === id) < 6;

  const folderDocs = allDocs.filter((d) =>
    !search || d.title.toLowerCase().includes(search.toLowerCase())
  );

  function handleAddFolder() {
    if (!newFolderName.trim()) return;
    createFolder.mutate({ name: newFolderName.trim() }, {
      onSuccess: () => { setNewFolderName(''); setShowNewFolder(false); },
    });
  }

  const newFolderInput = (
    <div className="flex items-center gap-1.5">
      <input autoFocus value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAddFolder()}
        placeholder="Folder name…"
        className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-primary/30" />
      <button onClick={handleAddFolder} className="text-green-500 hover:text-green-600"><Check className="w-4 h-4" /></button>
      <button onClick={() => setShowNewFolder(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 md:h-[calc(100vh-112px)]">

      {/* Mobile: horizontal folder pills */}
      <div className="md:hidden w-full">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-primary">Folders</span>
          <button onClick={() => setShowNewFolder((v) => !v)} className="text-gray-400 hover:text-brand-primary transition-colors">
            <PlusCircle className="w-4 h-4" />
          </button>
        </div>
        <AnimatePresence>
          {showNewFolder && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-2">
              {newFolderInput}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide w-full">
          {rootFolders.map((f) => {
            const isActive = f.id === activeFolderIdResolved;
            const count = allDocsForCount.filter((d) => d.folder_id === f.id).length;
            return (
              <button key={f.id} onClick={() => handleSetFolder(f.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                  isActive ? 'bg-brand-gradient text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {isActive ? <FolderOpen className="w-3.5 h-3.5" /> : <Folder className="w-3.5 h-3.5" />}
                {f.name}
                <span className={`text-[10px] ${isActive ? 'text-white/70' : 'text-gray-400'}`}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop: sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-primary">Folders</span>
          <button onClick={() => setShowNewFolder((v) => !v)} className="text-gray-400 hover:text-brand-primary transition-colors">
            <PlusCircle className="w-4 h-4" />
          </button>
        </div>
        <AnimatePresence>
          {showNewFolder && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-b border-gray-100">
              <div className="px-3 py-2">{newFolderInput}</div>
            </motion.div>
          )}
        </AnimatePresence>
        <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
          {rootFolders.map((f) => (
            <FolderItem key={f.id} folder={f} activeFolderId={activeFolderIdResolved}
              allDocsForCount={allDocsForCount} subFolders={subFolders}
              isDefaultFolder={isDefaultFolder} onSelect={handleSetFolder}
              onDelete={(id) => setDeleteFolderId(id)}
            />
          ))}
        </nav>
      </aside>

      {/* Document list */}
      <div className="flex-1 flex flex-col min-w-0 space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-bold text-brand-primary truncate text-sm">{activeFolder?.name ?? '…'}</span>
            <span className="text-gray-300 shrink-0 text-xs">/</span>
            <span className="shrink-0 text-xs text-gray-500">{totalCount}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <select
              value={limit}
              onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
              className="text-xs font-semibold border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none bg-white"
              title="Documents per page"
            >
              {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <Link
              to={`/admin/documents/new?folder=${activeFolderIdResolved}`}
              className="flex items-center gap-1.5 bg-brand-gradient text-white text-xs font-semibold px-3 py-2 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              <FilePlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Document</span>
              <span className="sm:hidden">New</span>
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search documents…"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/50" />
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {folderDocs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <FileText className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm">No documents in this folder.</p>
              <Link to={`/admin/documents/new?folder=${activeFolderIdResolved}`} className="mt-3 text-sm text-brand-secondary font-semibold hover:underline">
                Create one
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {folderDocs.map((doc) => (
                <motion.div key={doc.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl border border-gray-100 shadow-card px-4 py-3 hover:border-brand-primary/20 transition-colors"
                >
                  {/* Top row: icon + title + status */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-brand-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate text-sm">{doc.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {doc.type} · {doc.document_date ? formatDate(doc.document_date) : formatDate(doc.updated_at)}
                      </p>
                    </div>
                  </div>
                  {/* Action row */}
                  <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-gray-100">
                    <button onClick={() => setPreviewDoc(doc)}
                      className="flex items-center gap-1 text-xs font-semibold text-gray-500 border border-gray-200 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> Preview
                    </button>
                    <span className={`text-xs font-bold px-2.5 py-1.5 rounded-lg ${STATUS_STYLE[doc.status]}`}>
                      {doc.status}
                    </span>
                    <Link to={`/admin/documents/${doc.id}/edit`}
                      className="flex items-center gap-1 text-xs font-semibold text-brand-primary border border-brand-primary/20 px-2.5 py-1.5 rounded-lg hover:bg-brand-primary/5 transition-colors"
                    >
                      Edit
                    </Link>
                    <button onClick={() => setDeleteDocId(doc.id)}
                      className="ml-auto p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              {((page - 1) * limit) + 1}–{Math.min(page * limit, totalCount)} of {totalCount}
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40">
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-7 h-7 text-xs font-semibold rounded-lg transition-colors ${
                    p === page ? 'bg-brand-primary text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete document modal */}
      <AnimatePresence>
        {deleteDocId && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Document?</h3>
                <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteDocId(null)} className="flex-1 py-2.5 text-sm font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</button>
                  <button onClick={() => { deleteDocument.mutate(deleteDocId); setDeleteDocId(null); }} className="flex-1 py-2.5 text-sm font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600">Delete</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete folder modal */}
      <AnimatePresence>
        {deleteFolderId && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Folder?</h3>
                <p className="text-sm text-gray-500 mb-6">All documents inside will also be deleted.</p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteFolderId(null)} className="flex-1 py-2.5 text-sm font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</button>
                  <button
                    onClick={() => {
                      deleteFolder.mutate(deleteFolderId);
                      setDeleteFolderId(null);
                      if (activeFolderIdResolved === deleteFolderId) handleSetFolder('');
                    }}
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

      {/* Preview modal */}
      <AnimatePresence>
        {previewDoc && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50" onClick={() => setPreviewDoc(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} className="fixed inset-4 sm:inset-8 z-50 bg-gray-100 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-brand-primary" />
                  <span className="text-sm font-semibold text-brand-primary truncate max-w-xs">{previewDoc.title}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLE[previewDoc.status]}`}>{previewDoc.status}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Link to={`/admin/documents/${previewDoc.id}/edit`}
                    className="flex items-center gap-1.5 text-xs font-semibold text-brand-primary border border-brand-primary/20 px-3 py-1.5 rounded-lg hover:bg-brand-primary/5">
                    Edit
                  </Link>
                  <button onClick={() => setPreviewDoc(null)} className="text-gray-400 hover:text-gray-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto py-4 px-3 md:py-8 md:px-4">
                {/* Mobile: fluid card layout */}
                <div className="md:hidden bg-white rounded-xl shadow-lg mx-auto p-5 max-w-full" style={{ fontFamily: 'Georgia, serif' }}>
                  {previewDoc.watermark && (
                    <div style={{ position: 'relative', overflow: 'hidden' }}>
                      <span style={{ position: 'absolute', fontSize: '64px', fontWeight: 900, color: 'rgba(11,40,84,0.06)', transform: 'rotate(-35deg)', whiteSpace: 'nowrap', userSelect: 'none', top: '10px', left: '-10px' }}>DRAFT</span>
                    </div>
                  )}
                  {/* Mobile header */}
                  <div style={{ borderBottom: '2px solid #C79527', paddingBottom: '10px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <img src={logo} alt="ADQS" style={{ height: '28px', width: 'auto', borderRadius: '3px' }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '11px', color: '#0B2854' }}>Adequate Strategies (Pty) Ltd</div>
                        <div style={{ fontSize: '10px', color: '#888' }}>Legal Consulting · Pretoria</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '10px', fontWeight: 700, color: '#C79527', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{previewDoc.type}</div>
                      <div style={{ fontSize: '10px', color: '#888' }}>Ref: ADQS-{previewDoc.id.slice(-6)}</div>
                    </div>
                  </div>
                  <h1 style={{ fontSize: '15px', fontWeight: 700, color: '#0B2854', margin: '0 0 14px 0' }}>{previewDoc.title}</h1>
                  <div style={{ fontSize: '12px', lineHeight: '1.8', color: '#333' }} className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: previewDoc.body }} />
                  <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '24px', paddingTop: '8px', fontSize: '9px', color: '#aaa' }}>
                    <div>Adequate Strategies (Pty) Ltd · 252 Cole Road, Shere, Pretoria</div>
                    <div>info@adqs.co.za · Confidential</div>
                  </div>
                </div>
                {/* Desktop: fixed A4 width */}
                <div className="hidden md:block bg-white shadow-2xl mx-auto p-12" style={{ width: '794px', minWidth: '794px', fontFamily: 'Georgia, serif' }}>
                  {previewDoc.watermark && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
                      <span style={{ fontSize: '96px', fontWeight: 900, color: 'rgba(11,40,84,0.06)', transform: 'rotate(-35deg)', whiteSpace: 'nowrap', userSelect: 'none', letterSpacing: '0.1em' }}>DRAFT</span>
                    </div>
                  )}
                  <div style={{ borderBottom: '2px solid #C79527', paddingBottom: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={logo} alt="ADQS" style={{ height: '40px', width: 'auto', borderRadius: '4px' }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '13px', color: '#0B2854' }}>Adequate Strategies (Pty) Ltd</div>
                        <div style={{ fontSize: '11px', color: '#888' }}>Legal Consulting · Shere, Pretoria, Gauteng</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#C79527', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{previewDoc.type}</div>
                      <div style={{ fontSize: '11px', color: '#888' }}>Ref: ADQS-{previewDoc.id.slice(-6)}</div>
                    </div>
                  </div>
                  <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#0B2854', margin: '0 0 20px 0' }}>{previewDoc.title}</h1>
                  <div style={{ fontSize: '13px', lineHeight: '1.8', color: '#333' }} className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: previewDoc.body }} />
                  <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '40px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#aaa' }}>
                    <span>Adequate Strategies (Pty) Ltd · 252 Cole Road, Shere, Pretoria · info@adqs.co.za</span>
                    <span>Confidential</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
