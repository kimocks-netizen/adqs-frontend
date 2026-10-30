import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Save, Eye, Upload, X, Check, ZoomIn, ZoomOut } from 'lucide-react';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';
import { useArticleStore } from '@/stores/useArticleStore';
import { CATEGORIES } from '@/data/articles';
import { ROUTES } from '@/routes/routes';
import type { Article } from '@/types';
import RichEditor from '@/components/admin/RichEditor';

const EMPTY: Omit<Article, 'id'> = {
  title: '',
  slug: '',
  introduction: '',
  body: '',
  featured_image_url: '',
  category: '',
  author: 'Bright Ngwenyama Gunde',
  status: 'draft',
  published_at: new Date().toISOString(),
  seo_title: '',
  seo_description: '',
};

function toSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Crop helper — draws cropped area onto canvas and returns blob URL */
async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<string> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', reject);
    img.src = imageSrc;
  });
  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
  return new Promise((resolve) => canvas.toBlob((blob) => resolve(URL.createObjectURL(blob!)), 'image/jpeg', 0.92));
}

export default function ArticleEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { articles, add, update } = useArticleStore();

  const existing = id ? articles.find((a) => a.id === id) : null;
  const isEdit = !!existing;

  const [form, setForm] = useState<Omit<Article, 'id'>>(existing ?? EMPTY);
  const [slugManual, setSlugManual] = useState(isEdit);
  const [saved, setSaved] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Image crop state
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!slugManual) setForm((prev) => ({ ...prev, slug: toSlug(prev.title) }));
  }, [form.title, slugManual]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    if (name === 'slug') setSlugManual(true);
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(status: 'draft' | 'published') {
    const article: Article = {
      id: existing?.id ?? String(Date.now()),
      ...form,
      status,
      published_at: status === 'published' ? new Date().toISOString() : form.published_at,
    };
    isEdit ? update(article) : add(article);
    setSaved(true);
    setTimeout(() => navigate(ROUTES.ADMIN_ARTICLES), 800);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  const onCropComplete = useCallback((_: Area, pixels: Area) => setCroppedAreaPixels(pixels), []);

  async function handleCropConfirm() {
    if (!cropSrc || !croppedAreaPixels) return;
    const url = await getCroppedImg(cropSrc, croppedAreaPixels);
    setForm((prev) => ({ ...prev, featured_image_url: url }));
    setCropSrc(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  }

  const inputClass = 'w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/50';

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(ROUTES.ADMIN_ARTICLES)} className="text-gray-400 hover:text-brand-primary transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-brand-primary">{isEdit ? 'Edit Article' : 'New Article'}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{isEdit ? `Editing: ${existing?.title}` : 'Create a new insight or article'}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-6 items-start">
        {/* Main fields */}
        <div className="space-y-5">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-card border border-gray-100 p-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Title *</label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="Article title…" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Slug {!slugManual && <span className="ml-2 text-gray-400 font-normal">(auto-generated)</span>}
              </label>
              <input name="slug" value={form.slug} onChange={handleChange} placeholder="article-slug" className={inputClass + ' font-mono text-xs'} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Introduction / Excerpt *</label>
              <textarea name="introduction" value={form.introduction} onChange={handleChange} rows={3} placeholder="Brief summary shown on the articles list…" className={inputClass + ' resize-none'} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">Body *</label>
              <RichEditor
                value={form.body}
                onChange={(html) => setForm((prev) => ({ ...prev, body: html }))}
                placeholder="Write the full article body here…"
                minHeight="400px"
              />
            </div>
          </motion.div>

          {/* SEO */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl shadow-card border border-gray-100 p-6 space-y-5">
            <h2 className="text-sm font-bold text-brand-primary uppercase tracking-widest">SEO</h2>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">SEO Title</label>
              <input name="seo_title" value={form.seo_title ?? ''} onChange={handleChange} placeholder="SEO page title…" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">SEO Description</label>
              <textarea name="seo_description" value={form.seo_description ?? ''} onChange={handleChange} rows={2} placeholder="Meta description (150–160 chars)…" className={inputClass + ' resize-none'} />
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="space-y-4 lg:sticky lg:top-6">
          {/* Publish */}
          <div className="bg-white rounded-xl shadow-card border border-gray-100 p-5 space-y-3">
            <h2 className="text-sm font-bold text-brand-primary uppercase tracking-widest">Publish</h2>
            <button
              onClick={() => setShowPreview(true)}
              className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Eye className="w-4 h-4" /> Preview
            </button>
            <button
              onClick={() => handleSubmit('published')}
              disabled={saved}
              className="w-full flex items-center justify-center gap-2 bg-brand-gradient text-white text-sm font-bold py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              <Save className="w-4 h-4" /> {saved ? 'Saved!' : 'Publish'}
            </button>
            <button
              onClick={() => handleSubmit('draft')}
              disabled={saved}
              className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              Save as Draft
            </button>
            {/* Status indicator */}
            <div className="flex items-center justify-between pt-1 border-t border-gray-100">
              <span className="text-xs text-gray-400">Status</span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${form.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {form.status}
              </span>
            </div>
          </div>

          {/* Category */}
          <div className="bg-white rounded-xl shadow-card border border-gray-100 p-5 space-y-3">
            <h2 className="text-sm font-bold text-brand-primary uppercase tracking-widest">Category</h2>
            <select name="category" value={form.category} onChange={handleChange} className={inputClass + ' bg-white'}>
              <option value="">Select category…</option>
              {CATEGORIES.filter((c) => c !== 'All').map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Featured image */}
          <div className="bg-white rounded-xl shadow-card border border-gray-100 p-5 space-y-3">
            <h2 className="text-sm font-bold text-brand-primary uppercase tracking-widest">Featured Image</h2>

            {/* Upload button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 text-gray-500 text-sm font-medium py-3 rounded-lg hover:border-brand-primary/40 hover:text-brand-primary transition-colors"
            >
              <Upload className="w-4 h-4" /> Upload & Crop Image
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

            {/* Or URL */}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="flex-1 h-px bg-gray-100" /> or use URL <div className="flex-1 h-px bg-gray-100" />
            </div>
            <input name="featured_image_url" value={form.featured_image_url} onChange={handleChange} placeholder="https://…" className={inputClass} />

            {/* Preview */}
            {form.featured_image_url && (
              <div className="relative group">
                <img
                  src={form.featured_image_url}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg border border-gray-100"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, featured_image_url: '' }))}
                  className="absolute top-2 right-2 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Author */}
          <div className="bg-white rounded-xl shadow-card border border-gray-100 p-5 space-y-3">
            <h2 className="text-sm font-bold text-brand-primary uppercase tracking-widest">Author</h2>
            <input name="author" value={form.author} onChange={handleChange} className={inputClass} />
          </div>
        </motion.div>
      </div>

      {/* ── Crop Modal ── */}
      <AnimatePresence>
        {cropSrc && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 z-50" />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <h3 className="font-bold text-brand-primary">Crop Image</h3>
                  <button onClick={() => setCropSrc(null)} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
                </div>

                {/* Crop area */}
                <div className="relative w-full h-72 bg-gray-900">
                  <Cropper
                    image={cropSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={16 / 9}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>

                {/* Zoom slider */}
                <div className="px-5 py-4 flex items-center gap-3 border-b border-gray-100">
                  <ZoomOut className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.05}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="flex-1 accent-brand-primary"
                  />
                  <ZoomIn className="w-4 h-4 text-gray-400 shrink-0" />
                </div>

                <div className="flex gap-3 px-5 py-4">
                  <button onClick={() => setCropSrc(null)} className="flex-1 py-2.5 text-sm font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleCropConfirm} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg bg-brand-gradient text-white hover:opacity-90 transition-opacity">
                    <Check className="w-4 h-4" /> Apply Crop
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Preview Modal ── */}
      <AnimatePresence>
        {showPreview && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50" onClick={() => setShowPreview(false)} />
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="fixed inset-4 sm:inset-8 z-50 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Preview topbar */}
              <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-brand-primary" />
                  <span className="text-sm font-semibold text-brand-primary">Article Preview</span>
                  <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-full ${form.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {form.status}
                  </span>
                </div>
                <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
              </div>

              {/* Preview content */}
              <div className="flex-1 overflow-y-auto">
                {/* Hero */}
                <div className="bg-brand-gradient pt-12 pb-8 px-8 text-white">
                  {form.category && (
                    <span className="inline-block text-xs font-bold uppercase tracking-widest text-yellow-300 mb-3">{form.category}</span>
                  )}
                  <h1 className="text-2xl sm:text-3xl font-bold leading-snug max-w-3xl mb-3">
                    {form.title || <span className="opacity-40">Article title…</span>}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-white/70">
                    <span>{form.author}</span>
                    <span>{formatDate(form.published_at)}</span>
                  </div>
                </div>

                {/* Featured image */}
                {form.featured_image_url && (
                  <div className="max-w-4xl mx-auto px-6">
                    <div className="h-56 sm:h-72 rounded-b-2xl overflow-hidden shadow-card">
                      <img src={form.featured_image_url} alt="" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                    </div>
                  </div>
                )}

                {/* Body */}
                <div className="max-w-4xl mx-auto px-6 py-10 grid lg:grid-cols-[1fr_240px] gap-10">
                  <div>
                    {form.introduction && (
                      <p className="text-lg text-gray-700 font-medium leading-relaxed border-l-4 border-brand-secondary pl-5 mb-8">{form.introduction}</p>
                    )}
                    {form.body
                    ? <div className="prose prose-sm max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: form.body }} />
                    : <p className="text-gray-400 italic">Body content will appear here…</p>}
                  </div>
                  {/* Mini sidebar */}
                  <aside className="hidden lg:block space-y-6">
                    <div className="bg-brand-gradient rounded-xl p-5 text-white text-center">
                      <p className="text-sm font-semibold mb-1">Need legal guidance?</p>
                      <p className="text-xs text-white/70 mb-3">Our team is ready to assist.</p>
                      <span className="inline-block bg-brand-secondary text-white text-xs font-bold px-4 py-1.5 rounded-full">Make an Enquiry</span>
                    </div>
                  </aside>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
