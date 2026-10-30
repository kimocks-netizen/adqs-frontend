import { create } from 'zustand';

export type DocStatus = 'Draft' | 'Final';
export type DocType = 'Letter' | 'Contract' | 'Opinion' | 'Notice' | 'Report' | 'Memo';

export interface DocFolder {
  id: string;
  name: string;
  parentId: string | null;
}

export interface Document {
  id: string;
  folderId: string;
  title: string;
  type: DocType;
  body: string; // HTML from TipTap
  status: DocStatus;
  createdAt: string;
  updatedAt: string;
  watermark: boolean;
}

interface DocumentStore {
  folders: DocFolder[];
  documents: Document[];
  addFolder: (name: string, parentId: string | null) => void;
  removeFolder: (id: string) => void;
  addDocument: (doc: Document) => void;
  updateDocument: (doc: Document) => void;
  removeDocument: (id: string) => void;
}

const DEFAULT_FOLDERS: DocFolder[] = [
  { id: 'f1', name: 'Letters',   parentId: null },
  { id: 'f2', name: 'Reports',   parentId: null },
  { id: 'f3', name: 'Contracts', parentId: null },
  { id: 'f4', name: 'Opinions',  parentId: null },
  { id: 'f5', name: 'Notices',   parentId: null },
  { id: 'f6', name: 'Memos',     parentId: null },
];

const DUMMY_DOCS: Document[] = [
  {
    id: 'd1', folderId: 'f3', title: 'Service Level Agreement — Mokoena Holdings',
    type: 'Contract', status: 'Draft', watermark: true,
    body: '<h2>Service Level Agreement</h2><p>This agreement is entered into between <strong>Adequate Strategies (Pty) Ltd</strong> and <strong>Mokoena Holdings</strong>.</p>',
    createdAt: '2025-01-10T08:00:00Z', updatedAt: '2025-01-10T08:00:00Z',
  },
  {
    id: 'd2', folderId: 'f1', title: 'Demand Letter — Sipho Khumalo',
    type: 'Letter', status: 'Final', watermark: false,
    body: '<p>Dear Mr Khumalo,</p><p>We write on behalf of our client regarding the outstanding amount of <strong>R 45,000.00</strong>.</p>',
    createdAt: '2025-01-12T09:00:00Z', updatedAt: '2025-01-13T10:00:00Z',
  },
  {
    id: 'd3', folderId: 'f4', title: 'Legal Opinion — POPIA Compliance',
    type: 'Opinion', status: 'Final', watermark: false,
    body: '<h2>Legal Opinion</h2><h3>Issue</h3><p>Whether the client is required to appoint an Information Officer under POPIA.</p><h3>Conclusion</h3><p>Yes. Section 55 of POPIA requires every responsible party to appoint an Information Officer.</p>',
    createdAt: '2025-01-08T07:00:00Z', updatedAt: '2025-01-08T07:00:00Z',
  },
];

export const useDocumentStore = create<DocumentStore>((set) => ({
  folders: DEFAULT_FOLDERS,
  documents: DUMMY_DOCS,

  addFolder: (name, parentId) =>
    set((s) => ({ folders: [...s.folders, { id: String(Date.now()), name, parentId }] })),

  removeFolder: (id) =>
    set((s) => ({
      folders: s.folders.filter((f) => f.id !== id && f.parentId !== id),
      documents: s.documents.filter((d) => d.folderId !== id),
    })),

  addDocument: (doc) => set((s) => ({ documents: [doc, ...s.documents] })),

  updateDocument: (doc) =>
    set((s) => ({ documents: s.documents.map((d) => (d.id === doc.id ? doc : d)) })),

  removeDocument: (id) =>
    set((s) => ({ documents: s.documents.filter((d) => d.id !== id) })),
}));
