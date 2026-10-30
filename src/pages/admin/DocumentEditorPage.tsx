import { useState, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Download, Eye, X, Droplets } from 'lucide-react';
import { useDocumentStore } from '@/stores/useDocumentStore';
import type { DocType, DocStatus, Document } from '@/stores/useDocumentStore';
import RichEditor from '@/components/admin/RichEditor';
import logo from '@/assets/logo.jpg';

const DOC_TYPES: DocType[] = ['Letter', 'Contract', 'Opinion', 'Notice', 'Report', 'Memo'];

const TEMPLATES: Record<DocType, string> = {
  Letter: `<p><strong>Date:</strong> ${new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
<p><strong>To:</strong> [Recipient Name]</p>
<p><strong>From:</strong> Adequate Strategies (Pty) Ltd</p>
<p><strong>Re:</strong> [Subject]</p>
<br/>
<p>Dear [Recipient],</p>
<br/>
<p>[Body of letter]</p>
<br/>
<p>Yours faithfully,</p>
<br/>
<p><strong>Bright Ngwenyama Gunde</strong><br/>Adequate Strategies (Pty) Ltd</p>`,

  Contract: `<h2>Agreement</h2>
<p>This Agreement is entered into on <strong>${new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</strong> between:</p>
<p><strong>Party A:</strong> Adequate Strategies (Pty) Ltd ("the Service Provider")</p>
<p><strong>Party B:</strong> [Client Name] ("the Client")</p>
<h3>1. Recitals</h3>
<p>[Background and context]</p>
<h3>2. Terms and Conditions</h3>
<p>[Terms]</p>
<h3>3. Payment</h3>
<p>[Payment terms]</p>
<h3>4. Duration</h3>
<p>[Duration and termination]</p>
<h3>5. Signatures</h3>
<p>Signed at _____________ on _____________</p>
<br/>
<p>_________________________ &nbsp;&nbsp;&nbsp; _________________________</p>
<p>Service Provider &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Client</p>`,

  Opinion: `<h2>Legal Opinion</h2>
<p><strong>Date:</strong> ${new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
<p><strong>Matter:</strong> [Matter reference]</p>
<p><strong>Prepared by:</strong> Adequate Strategies (Pty) Ltd</p>
<h3>Issue</h3>
<p>[State the legal question]</p>
<h3>Applicable Law</h3>
<p>[Relevant legislation and case law]</p>
<h3>Analysis</h3>
<p>[Legal analysis]</p>
<h3>Conclusion</h3>
<p>[Opinion and recommendation]</p>`,

  Notice: `<h2>Notice</h2>
<p><strong>Date:</strong> ${new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
<p><strong>To:</strong> [Recipient]</p>
<p><strong>Subject:</strong> [Subject of Notice]</p>
<br/>
<p>[Body of notice]</p>
<br/>
<p>Issued by: <strong>Adequate Strategies (Pty) Ltd</strong></p>`,

  Report: `<h2>Report</h2>
<p><strong>Date:</strong> ${new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
<p><strong>Prepared by:</strong> Adequate Strategies (Pty) Ltd</p>
<p><strong>Subject:</strong> [Report subject]</p>
<h3>Executive Summary</h3>
<p>[Brief summary of findings]</p>
<h3>Background</h3>
<p>[Context and background]</p>
<h3>Findings</h3>
<p>[Detailed findings]</p>
<h3>Recommendations</h3>
<p>[Recommendations]</p>`,

  Memo: `<h2>Memorandum</h2>
<p><strong>To:</strong> [Recipient]</p>
<p><strong>From:</strong> Adequate Strategies (Pty) Ltd</p>
<p><strong>Date:</strong> ${new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
<p><strong>Subject:</strong> [Subject]</p>
<br/>
<p>[Body of memo]</p>`,
};

export default function DocumentEditorPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { documents, folders, addDocument, updateDocument } = useDocumentStore();
  const printRef = useRef<HTMLDivElement>(null);

  const existing = id ? documents.find((d) => d.id === id) : null;
  const isEdit = !!existing;
  const defaultFolderId = searchParams.get('folder') ?? folders[0]?.id ?? '';

  const [title, setTitle] = useState(existing?.title ?? '');
  const [type, setType] = useState<DocType>(existing?.type ?? 'Letter');
  const [folderId, setFolderId] = useState(existing?.folderId ?? defaultFolderId);
  const [status, setStatus] = useState<DocStatus>(existing?.status ?? 'Draft');
  const [body, setBody] = useState(existing?.body ?? TEMPLATES['Letter']);
  const [watermark, setWatermark] = useState(existing?.watermark ?? false);
  const [showPreview, setShowPreview] = useState(false);
  const [saved, setSaved] = useState(false);

  function applyTemplate(t: DocType) {
    setType(t);
    if (!isEdit) setBody(TEMPLATES[t]);
  }

  function handleSave() {
    const now = new Date().toISOString();
    const doc: Document = {
      id: existing?.id ?? String(Date.now()),
      folderId, title, type, body, status, watermark,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    isEdit ? updateDocument(doc) : addDocument(doc);
    setSaved(true);
    setTimeout(() => navigate('/admin/documents'), 800);
  }

  async function handleExportPDF() {
    const el = printRef.current;
    if (!el) return;
    const html2pdf = (await import('html2pdf.js')).default;
    html2pdf().set({
      margin: [15, 15, 15, 15],
      filename: `${title || 'document'}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    }).from(el).save();
  }

  async function handleExportDOCX() {
    const { Document: DocxDoc, Packer, Paragraph, TextRun, HeadingLevel } = await import('docx');
    const parser = new DOMParser();
    const parsed = parser.parseFromString(body, 'text/html');
    const paragraphs: InstanceType<typeof Paragraph>[] = [];

    parsed.body.childNodes.forEach((node) => {
      if (node.nodeName === 'H2') {
        paragraphs.push(new Paragraph({ text: node.textContent ?? '', heading: HeadingLevel.HEADING_2 }));
      } else if (node.nodeName === 'H3') {
        paragraphs.push(new Paragraph({ text: node.textContent ?? '', heading: HeadingLevel.HEADING_3 }));
      } else {
        paragraphs.push(new Paragraph({ children: [new TextRun(node.textContent ?? '')] }));
      }
    });

    const doc = new DocxDoc({ sections: [{ children: paragraphs }] });
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${title || 'document'}.docx`; a.click();
    URL.revokeObjectURL(url);
  }

  const inputClass = 'w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/50';

  // The printable document layout
  function DocumentLayout({ forPrint = false }: { forPrint?: boolean }) {
    return (
      <div ref={forPrint ? printRef : undefined} className="relative bg-white" style={{ fontFamily: 'Georgia, serif' }}>
        {/* Watermark */}
        {watermark && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
            <span style={{
              fontSize: '96px', fontWeight: 900, color: 'rgba(11,40,84,0.06)',
              transform: 'rotate(-35deg)', whiteSpace: 'nowrap', userSelect: 'none',
              letterSpacing: '0.1em',
            }}>
              DRAFT
            </span>
          </div>
        )}

        {/* Header */}
        <div style={{ position: 'relative', zIndex: 1, borderBottom: '2px solid #C79527', paddingBottom: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={logo} alt="ADQS" style={{ height: '40px', width: 'auto', borderRadius: '4px' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '13px', color: '#0B2854' }}>Adequate Strategies (Pty) Ltd</div>
              <div style={{ fontSize: '11px', color: '#888' }}>Legal Consulting · Ermelo, Mpumalanga</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#C79527', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{type}</div>
            <div style={{ fontSize: '11px', color: '#888' }}>Ref: ADQS-{Date.now().toString().slice(-6)}</div>
          </div>
        </div>

        {/* Title */}
        {title && (
          <div style={{ position: 'relative', zIndex: 1, marginBottom: '20px' }}>
            <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#0B2854', margin: 0 }}>{title}</h1>
          </div>
        )}

        {/* Body */}
        <div
          style={{ position: 'relative', zIndex: 1, fontSize: '13px', lineHeight: '1.8', color: '#333' }}
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: body }}
        />

        {/* Footer */}
        <div style={{ position: 'relative', zIndex: 1, borderTop: '1px solid #e5e7eb', marginTop: '40px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#aaa' }}>
          <span>Adequate Strategies (Pty) Ltd · 23 Joubert Street, Ermelo · info@adqs.co.za</span>
          <span>Confidential</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/documents')} className="text-gray-400 hover:text-brand-primary transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-brand-primary">{isEdit ? 'Edit Document' : 'New Document'}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{isEdit ? existing?.title : 'Create a new legal document'}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_260px] gap-6 items-start">
        {/* Editor */}
        <div className="space-y-5">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-card border border-gray-100 p-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Document Title *</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Service Agreement — Client Name" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">Body</label>
              <RichEditor value={body} onChange={setBody} placeholder="Start writing your document…" minHeight="480px" />
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-4 lg:sticky lg:top-6">

          {/* Actions */}
          <div className="bg-white rounded-xl shadow-card border border-gray-100 p-5 space-y-3">
            <h2 className="text-sm font-bold text-brand-primary uppercase tracking-widest">Actions</h2>
            <button onClick={() => setShowPreview(true)} className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-200 transition-colors">
              <Eye className="w-4 h-4" /> Preview
            </button>
            <button onClick={handleSave} disabled={saved} className="w-full flex items-center justify-center gap-2 bg-brand-gradient text-white text-sm font-bold py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60">
              <Save className="w-4 h-4" /> {saved ? 'Saved!' : 'Save Document'}
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={handleExportPDF} className="flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 text-xs font-semibold py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-3.5 h-3.5" /> PDF
              </button>
              <button onClick={handleExportDOCX} className="flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 text-xs font-semibold py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-3.5 h-3.5" /> DOCX
              </button>
            </div>
            {/* Status */}
            <div className="flex items-center justify-between pt-1 border-t border-gray-100">
              <span className="text-xs text-gray-400">Status</span>
              <select value={status} onChange={(e) => setStatus(e.target.value as DocStatus)} className="text-xs font-semibold border border-gray-200 rounded-lg px-2 py-1 focus:outline-none">
                <option value="Draft">Draft</option>
                <option value="Final">Final</option>
              </select>
            </div>
          </div>

          {/* Document type + template */}
          <div className="bg-white rounded-xl shadow-card border border-gray-100 p-5 space-y-3">
            <h2 className="text-sm font-bold text-brand-primary uppercase tracking-widest">Document Type</h2>
            <div className="grid grid-cols-2 gap-2">
              {DOC_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => applyTemplate(t)}
                  className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
                    type === t ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            {!isEdit && <p className="text-xs text-gray-400">Selecting a type loads its template.</p>}
          </div>

          {/* Folder */}
          <div className="bg-white rounded-xl shadow-card border border-gray-100 p-5 space-y-3">
            <h2 className="text-sm font-bold text-brand-primary uppercase tracking-widest">Folder</h2>
            <select value={folderId} onChange={(e) => setFolderId(e.target.value)} className={inputClass + ' bg-white'}>
              {folders.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>

          {/* Watermark */}
          <div className="bg-white rounded-xl shadow-card border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-semibold text-gray-700">DRAFT Watermark</span>
              </div>
              <button
                onClick={() => setWatermark((v) => !v)}
                className={`w-10 h-5 rounded-full transition-colors relative ${watermark ? 'bg-brand-primary' : 'bg-gray-200'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${watermark ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Hidden print target */}
      <div className="hidden">
        <div ref={printRef} className="p-8 bg-white" style={{ width: '794px' }}>
          <DocumentLayout forPrint />
        </div>
      </div>

      {/* Preview modal */}
      {showPreview && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50" onClick={() => setShowPreview(false)} />
          <div className="fixed inset-4 sm:inset-8 z-50 bg-gray-100 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-brand-primary" />
                <span className="text-sm font-semibold text-brand-primary">Document Preview</span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleExportPDF} className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
                <button onClick={handleExportDOCX} className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">
                  <Download className="w-3.5 h-3.5" /> DOCX
                </button>
                <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto flex justify-center py-8 px-4">
              <div className="bg-white shadow-2xl rounded-lg p-10 w-full max-w-2xl">
                <DocumentLayout />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
