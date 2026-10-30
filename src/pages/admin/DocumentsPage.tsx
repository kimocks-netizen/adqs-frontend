import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderOpen, Folder, PlusCircle, FilePlus, Trash2,
  FileText, ChevronRight, Search, X, Check,
} from 'lucide-react';
import { useDocumentStore } from '@/stores/useDocumentStore';
import type { DocFolder } from '@/stores/useDocumentStore';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
}

const STATUS_STYLE = {
  Draft: 'bg-yellow-100 text-yellow-700',
  Final: 'bg-green-100 text-green-700',
};

export default function DocumentsPage() {
  const { folders, documents, addFolder, removeFolder, removeDocument } = useDocumentStore();
  const [activeFolderId, setActiveFolderId] = useState<string>(folders[0]?.id ?? '');
  const [search, setSearch] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [deleteDocId, setDeleteDocId] = useState<string | null>(null);
  const [deleteFolderId, setDeleteFolderId] = useState<string | null>(null);

  const activeFolder = folders.find((f) => f.id === activeFolderId);
  const rootFolders = folders.filter((f) => f.parentId === null);
  const subFolders = (parentId: string) => folders.filter((f) => f.parentId === parentId);

  const folderDocs = documents.filter((d) => {
    const inFolder = d.folderId === activeFolderId;
    const matchSearch = !search || d.title.toLowerCase().includes(search.toLowerCase());
    return inFolder && matchSearch;
  });

  function handleAddFolder() {
    if (!newFolderName.trim()) return;
    addFolder(newFolderName.trim(), null);
    setNewFolderName('');
    setShowNewFolder(false);
  }

  function FolderItem({ folder }: { folder: DocFolder }) {
    const isActive = folder.id === activeFolderId;
    const subs = subFolders(folder.id);
    const count = documents.filter((d) => d.folderId === folder.id).length;

    return (
      <div>
        <div
          className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm ${
            isActive ? 'bg-brand-primary/10 text-brand-primary font-semibold' : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => setActiveFolderId(folder.id)}
        >
          {isActive ? <FolderOpen className="w-4 h-4 shrink-0" /> : <Folder className="w-4 h-4 shrink-0" />}
          <span className="flex-1 truncate">{folder.name}</span>
          <span className="text-xs text-gray-400">{count}</span>
          {!['f1','f2','f3','f4','f5','f6'].includes(folder.id) && (
            <button
              onClick={(e) => { e.stopPropagation(); setDeleteFolderId(folder.id); }}
              className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        {subs.length > 0 && (
          <div className="ml-4 mt-0.5 space-y-0.5">
            {subs.map((s) => <FolderItem key={s.id} folder={s} />)}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 md:h-[calc(100vh-112px)]">
      {/* ── Mobile: horizontal scrollable folder pills ── */}
      <div className="md:hidden w-full">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-primary">Folders</span>
          <button onClick={() => setShowNewFolder((v) => !v)} className="text-gray-400 hover:text-brand-primary transition-colors" title="New folder">
            <PlusCircle className="w-4 h-4" />
          </button>
        </div>
        <AnimatePresence>
          {showNewFolder && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-2">
              <div className="flex items-center gap-1.5">
                <input autoFocus value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddFolder()} placeholder="Folder name…" className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-primary/30" />
                <button onClick={handleAddFolder} className="text-green-500 hover:text-green-600"><Check className="w-4 h-4" /></button>
                <button onClick={() => setShowNewFolder(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide w-full">
          {rootFolders.map((f) => {
            const isActive = f.id === activeFolderId;
            const count = documents.filter((d) => d.folderId === f.id).length;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFolderId(f.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                  isActive
                    ? 'bg-brand-primary text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
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

      {/* ── Desktop: sidebar ── */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-primary">Folders</span>
          <button onClick={() => setShowNewFolder((v) => !v)} className="text-gray-400 hover:text-brand-primary transition-colors" title="New folder">
            <PlusCircle className="w-4 h-4" />
          </button>
        </div>
        <AnimatePresence>
          {showNewFolder && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-b border-gray-100">
              <div className="flex items-center gap-1.5 px-3 py-2">
                <input autoFocus value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddFolder()} placeholder="Folder name…" className="flex-1 text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-primary/30" />
                <button onClick={handleAddFolder} className="text-green-500 hover:text-green-600"><Check className="w-4 h-4" /></button>
                <button onClick={() => setShowNewFolder(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
          {rootFolders.map((f) => <FolderItem key={f.id} folder={f} />)}
        </nav>
      </aside>

      {/* Document list */}
      <div className="flex-1 flex flex-col min-w-0 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-bold text-brand-primary text-lg">{activeFolder?.name}</span>
            <ChevronRight className="w-4 h-4" />
            <span>{folderDocs.length} document{folderDocs.length !== 1 ? 's' : ''}</span>
          </div>
          <Link
            to={`/admin/documents/new?folder=${activeFolderId}`}
            className="flex items-center gap-2 bg-brand-gradient text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            <FilePlus className="w-4 h-4" /> <span className="hidden sm:inline">New </span>Document
          </Link>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents…"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/50"
          />
        </div>

        {/* Documents */}
        <div className="flex-1 overflow-y-auto">
          {folderDocs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <FileText className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm">No documents in this folder.</p>
              <Link
                to={`/admin/documents/new?folder=${activeFolderId}`}
                className="mt-3 text-sm text-brand-secondary font-semibold hover:underline"
              >
                Create one
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {folderDocs.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group bg-white rounded-xl border border-gray-100 shadow-card px-5 py-4 flex items-center gap-4 hover:border-brand-primary/20 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-brand-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{doc.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{doc.type} · {formatDate(doc.updatedAt)}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${STATUS_STYLE[doc.status]}`}>
                    {doc.status}
                  </span>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      to={`/admin/documents/${doc.id}/edit`}
                      className="text-xs font-semibold text-brand-primary hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => setDeleteDocId(doc.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
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
                  <button onClick={() => { removeDocument(deleteDocId); setDeleteDocId(null); }} className="flex-1 py-2.5 text-sm font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600">Delete</button>
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
                  <button onClick={() => { removeFolder(deleteFolderId); setDeleteFolderId(null); if (activeFolderId === deleteFolderId) setActiveFolderId(folders[0]?.id ?? ''); }} className="flex-1 py-2.5 text-sm font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600">Delete</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
