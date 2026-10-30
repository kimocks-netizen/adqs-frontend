import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import { useRef, useState } from 'react';
import {
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Undo, Redo, Heading1, Heading2, Heading3,
  Baseline, Highlighter, X,
} from 'lucide-react';

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const FONT_COLORS = [
  '#0B2854', '#C79527', '#1e40af', '#15803d', '#b91c1c',
  '#7c3aed', '#0e7490', '#92400e', '#374151', '#000000',
  '#6b7280', '#ffffff',
];

const HIGHLIGHT_COLORS = [
  '#fef08a', '#bbf7d0', '#bfdbfe', '#fecaca', '#e9d5ff',
  '#fed7aa', '#cffafe', '#f0fdf4', '#fdf4ff', '#fff7ed',
];

function ToolbarBtn({ onClick, active, title, children }: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={`p-1.5 rounded transition-colors ${
        active ? 'bg-brand-primary text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-gray-200 mx-1 shrink-0" />;
}

function ColorPicker({ colors, onSelect, onClear, currentColor, title, icon }: {
  colors: string[];
  onSelect: (color: string) => void;
  onClear: () => void;
  currentColor?: string;
  title: string;
  icon: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onMouseDown={(e) => { e.preventDefault(); setOpen((v) => !v); }}
        title={title}
        className="p-1.5 rounded transition-colors text-gray-500 hover:bg-gray-100 hover:text-gray-800 flex flex-col items-center gap-0.5"
      >
        {icon}
        {/* Color indicator bar */}
        <span
          className="w-4 h-1 rounded-full"
          style={{ backgroundColor: currentColor ?? 'transparent', border: currentColor ? 'none' : '1px solid #d1d5db' }}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-3 w-44">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500">{title}</span>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); setOpen(false); }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-6 gap-1.5 mb-2">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); onSelect(c); setOpen(false); }}
                className="w-6 h-6 rounded-md border border-gray-200 hover:scale-110 transition-transform"
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
          {/* Custom color input */}
          <div className="flex items-center gap-2 border-t border-gray-100 pt-2">
            <input
              type="color"
              defaultValue={currentColor ?? '#000000'}
              onInput={(e) => { onSelect((e.target as HTMLInputElement).value); }}
              className="w-6 h-6 rounded cursor-pointer border-0 p-0"
              title="Custom colour"
            />
            <span className="text-xs text-gray-400">Custom</span>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); onClear(); setOpen(false); }}
              className="ml-auto text-xs text-gray-400 hover:text-red-500"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RichEditor({ value, onChange, placeholder = 'Start writing…', minHeight = '320px' }: RichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  const currentColor = editor.getAttributes('textStyle').color as string | undefined;
  const currentHighlight = editor.getAttributes('highlight').color as string | undefined;

  return (
    <div className="border border-gray-200 rounded-lg overflow-visible focus-within:ring-2 focus-within:ring-brand-primary/20 focus-within:border-brand-primary/50 transition-colors">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 bg-gray-50 border-b border-gray-200 rounded-t-lg">
        <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} title="Undo"><Undo className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} title="Redo"><Redo className="w-4 h-4" /></ToolbarBtn>
        <Divider />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Heading 1"><Heading1 className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2"><Heading2 className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3"><Heading3 className="w-4 h-4" /></ToolbarBtn>
        <Divider />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold"><Bold className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic"><Italic className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline"><UnderlineIcon className="w-4 h-4" /></ToolbarBtn>
        <Divider />

        {/* Font colour */}
        <ColorPicker
          colors={FONT_COLORS}
          onSelect={(c) => editor.chain().focus().setColor(c).run()}
          onClear={() => editor.chain().focus().unsetColor().run()}
          currentColor={currentColor}
          title="Font Colour"
          icon={<Baseline className="w-4 h-4" />}
        />

        {/* Highlight colour */}
        <ColorPicker
          colors={HIGHLIGHT_COLORS}
          onSelect={(c) => editor.chain().focus().toggleHighlight({ color: c }).run()}
          onClear={() => editor.chain().focus().unsetHighlight().run()}
          currentColor={currentHighlight}
          title="Highlight"
          icon={<Highlighter className="w-4 h-4" />}
        />

        <Divider />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List"><List className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered List"><ListOrdered className="w-4 h-4" /></ToolbarBtn>
        <Divider />
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align Left"><AlignLeft className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align Center"><AlignCenter className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align Right"><AlignRight className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('justify').run()} active={editor.isActive({ textAlign: 'justify' })} title="Justify"><AlignJustify className="w-4 h-4" /></ToolbarBtn>
      </div>

      {/* Editor area */}
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none px-4 py-3 text-gray-700"
        style={{ minHeight }}
      />
    </div>
  );
}
