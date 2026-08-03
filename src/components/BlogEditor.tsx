import { X, Eye, Edit3, Copy, Check, Send, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useMemo, useReducer } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { MarkdownContent } from './MarkdownContent';
import { BLOG_BRANCHES } from '../constants/blog';
import { publishArticle, type ArticleLang } from '../hooks/useBlogArticles';
import { buildToc, buildTocTree } from '../utils/markdownToc';
import { TableOfContents } from './TableOfContents';

interface BlogEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

type PublishStatus = 'idle' | 'publishing' | 'success' | 'error';

interface EditorState {
  title: string;
  subtitle: string;
  tags: string;
  branch: string;
  content: string;
  showToc: boolean;
  showPreview: boolean;
  copied: boolean;
  publishStatus: PublishStatus;
  statusMessage: string;
  publishLang: 'es' | 'en' | 'both';
}

type EditorAction =
  | { type: 'SET_FIELD'; field: keyof EditorState; value: any }
  | { type: 'TOGGLE_PREVIEW' }
  | { type: 'SET_COPIED'; value: boolean }
  | { type: 'SET_PUBLISH_STATUS'; status: PublishStatus; message: string }
  | { type: 'RESET_FORM' };

const initialState: EditorState = {
  title: '',
  subtitle: '',
  tags: '',
  branch: 'frontend',
  content: '',
  showToc: true,
  showPreview: false,
  copied: false,
  publishStatus: 'idle',
  statusMessage: '',
  publishLang: 'es',
};

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'TOGGLE_PREVIEW':
      return { ...state, showPreview: !state.showPreview };
    case 'SET_COPIED':
      return { ...state, copied: action.value };
    case 'SET_PUBLISH_STATUS':
      return { ...state, publishStatus: action.status, statusMessage: action.message };
    case 'RESET_FORM':
      return initialState;
    default:
      return state;
  }
}

export function BlogEditor({ isOpen, onClose }: BlogEditorProps) {
  const { isDark } = useTheme();
  const { i18n } = useTranslation();
  const [state, dispatch] = useReducer(editorReducer, initialState);
  const previewToc = useMemo(() => buildTocTree(buildToc(state.content)), [state.content]);

  if (!isOpen) return null;

  const isEs = i18n.language === 'es';

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const today = new Date().toISOString().split('T')[0];
  const slug = generateSlug(state.title);
  const tagsArray = state.tags
    .split(',')
    .map((t: string) => t.trim().toLowerCase())
    .filter(Boolean);

  const generateMarkdown = () => {
    const tagsJson = tagsArray.length > 0 ? JSON.stringify(tagsArray) : '[]';
    return `---
title: "${state.title}"
subtitle: "${state.subtitle}"
date: "${today}"
slug: "${slug}"
tags: ${tagsJson}
branch: "${state.branch}"
---

${state.content}
`;
  };

  const handlePublish = async () => {
    dispatch({
      type: 'SET_PUBLISH_STATUS',
      status: 'publishing',
      message: isEs ? 'Guardando artículo...' : 'Saving article...'
    });

    const langs: ArticleLang[] =
      state.publishLang === 'both' ? ['es', 'en'] : [state.publishLang];

    try {
      await publishArticle(
        {
          slug,
          title: state.title.trim(),
          subtitle: state.subtitle.trim(),
          date: today,
          content: state.content,
          tags: tagsArray,
          branch: state.branch,
        },
        langs
      );

      dispatch({
        type: 'SET_PUBLISH_STATUS',
        status: 'success',
        message: isEs
          ? `Artículo guardado (${langs.join(', ')}). Ya está publicado, sin necesidad de desplegar.`
          : `Article saved (${langs.join(', ')}). It is live already, no deploy needed.`
      });
    } catch (error) {
      dispatch({
        type: 'SET_PUBLISH_STATUS',
        status: 'error',
        message: error instanceof Error ? error.message : String(error)
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdown());
    dispatch({ type: 'SET_COPIED', value: true });
    setTimeout(() => dispatch({ type: 'SET_COPIED', value: false }), 2000);
  };

  const handleReset = () => {
    dispatch({ type: 'RESET_FORM' });
  };

  const isValid = state.title.trim() !== '' && state.content.trim() !== '';

  const inputClass = `w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
    isDark
      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500'
      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-400'
  }`;

  const labelClass = `block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in-up"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-xl p-6 md:p-8 ${
          isDark ? 'bg-slate-900' : 'bg-white'
        } animate-scale-in`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {isEs ? 'Nuevo Artículo' : 'New Article'}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch({ type: 'TOGGLE_PREVIEW' })}
              className={`p-2 rounded-lg transition-colors ${
                state.showPreview
                  ? 'bg-blue-600 text-white'
                  : isDark
                    ? 'hover:bg-slate-800 text-slate-300'
                    : 'hover:bg-slate-100 text-slate-700'
              }`}
              title={state.showPreview ? 'Edit' : 'Preview'}
            >
              {state.showPreview ? <Edit3 size={20} /> : <Eye size={20} />}
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Status Message */}
        {state.publishStatus !== 'idle' && (
          <div className={`mb-4 p-4 rounded-lg flex items-start gap-3 ${
            state.publishStatus === 'publishing'
              ? isDark ? 'bg-blue-900/30 border border-blue-800' : 'bg-blue-50 border border-blue-200'
              : state.publishStatus === 'success'
                ? isDark ? 'bg-green-900/30 border border-green-800' : 'bg-green-50 border border-green-200'
                : isDark ? 'bg-red-900/30 border border-red-800' : 'bg-red-50 border border-red-200'
          }`}>
            {state.publishStatus === 'publishing' && <Loader2 size={18} className="animate-spin text-blue-400 mt-0.5 shrink-0" />}
            {state.publishStatus === 'success' && <CheckCircle2 size={18} className="text-green-400 mt-0.5 shrink-0" />}
            {state.publishStatus === 'error' && <AlertCircle size={18} className="text-red-400 mt-0.5 shrink-0" />}
            <p className={`text-sm whitespace-pre-line ${
              state.publishStatus === 'publishing'
                ? isDark ? 'text-blue-300' : 'text-blue-700'
                : state.publishStatus === 'success'
                  ? isDark ? 'text-green-300' : 'text-green-700'
                  : isDark ? 'text-red-300' : 'text-red-700'
            }`}>
              {state.statusMessage}
            </p>
          </div>
        )}

        {/* Preview Mode */}
        {state.showPreview ? (
          <div>
            <div className={`mb-4 p-4 rounded-lg text-sm ${
              isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-50 text-slate-600'
            }`}>
              <span className="font-medium">{isEs ? 'Se guarda en' : 'Saved to'}:</span>{' '}
              <code>
                articles/ · {state.publishLang === 'both' ? 'es + en' : state.publishLang} ·{' '}
                {slug || 'slug'}
              </code>
            </div>

            <div className={`rounded-lg p-6 border ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {state.title || (isEs ? 'Sin título' : 'Untitled')}
              </h1>
              {state.subtitle && (
                <p className={`text-lg mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {state.subtitle}
                </p>
              )}
              <div className={`flex items-center gap-3 mb-4 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <span>{today}</span>
                {tagsArray.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {tagsArray.map((tag: string) => (
                      <span key={tag} className={`px-2 py-0.5 rounded-full text-xs ${
                        isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <TableOfContents
                nodes={previewToc}
                title={isEs ? 'Índice' : 'Contents'}
                variant="inline"
                isOpen={state.showToc}
                onToggle={() => dispatch({ type: 'SET_FIELD', field: 'showToc', value: !state.showToc })}
              />

              <MarkdownContent
                size="sm"
                content={
                  state.content ||
                  (isEs ? '*Escribe contenido para ver la vista previa...*' : '*Write content to see the preview...*')
                }
              />
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <div className="space-y-4">
            <div>
              <label className={labelClass}>
                {isEs ? 'Título *' : 'Title *'}
              </label>
              <input
                type="text"
                value={state.title}
                onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'title', value: e.target.value })}
                placeholder={isEs ? 'Mi artículo increíble' : 'My awesome article'}
                className={inputClass}
              />
              {state.title && (
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Slug: {slug}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>
                {isEs ? 'Subtítulo' : 'Subtitle'}
              </label>
              <input
                type="text"
                value={state.subtitle}
                onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'subtitle', value: e.target.value })}
                placeholder={isEs ? 'Breve descripción del artículo' : 'Brief article description'}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Tags ({isEs ? 'separados por coma' : 'comma separated'})
              </label>
              <input
                type="text"
                value={state.tags}
                onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'tags', value: e.target.value })}
                placeholder="react, typescript, tutorial"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                {isEs ? 'Rama' : 'Branch'}
              </label>
              <select
                value={state.branch}
                onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'branch', value: e.target.value })}
                className={inputClass}
              >
                {BLOG_BRANCHES.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>

            {/* Language selector */}
            <div>
              <label className={labelClass}>
                {isEs ? 'Publicar en idioma' : 'Publish in language'}
              </label>
              <div className="flex gap-2">
                {(['es', 'en', 'both'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => dispatch({ type: 'SET_FIELD', field: 'publishLang', value: lang })}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      state.publishLang === lang
                        ? 'bg-blue-600 text-white'
                        : isDark
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {lang === 'es' ? 'Español' : lang === 'en' ? 'English' : (isEs ? 'Ambos' : 'Both')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>
                {isEs ? 'Contenido (Markdown) *' : 'Content (Markdown) *'}
              </label>
              <textarea
                value={state.content}
                onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'content', value: e.target.value })}
                placeholder={isEs
                  ? '# Mi Artículo\n\nEscribe tu contenido en markdown aquí...\n\n## Sección\n\n- Punto 1\n- Punto 2'
                  : '# My Article\n\nWrite your markdown content here...\n\n## Section\n\n- Point 1\n- Point 2'
                }
                rows={12}
                className={`${inputClass} resize-y font-mono text-sm`}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className={`flex flex-wrap items-center gap-3 mt-6 pt-4 border-t ${
          isDark ? 'border-slate-700' : 'border-slate-200'
        }`}>
          <button
            onClick={handlePublish}
            disabled={!isValid || state.publishStatus === 'publishing'}
            className={`btn-animate flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors ${
              isValid && state.publishStatus !== 'publishing'
                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                : isDark
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {state.publishStatus === 'publishing'
              ? <Loader2 size={18} className="animate-spin" />
              : <Send size={18} />
            }
            {isEs ? 'Publicar' : 'Publish'}
          </button>

          <button
            onClick={handleCopy}
            disabled={!isValid}
            className={`btn-animate flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium border transition-colors ${
              isValid
                ? isDark
                  ? 'border-slate-700 text-slate-300 hover:border-blue-500 hover:text-blue-300'
                  : 'border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-600'
                : isDark
                  ? 'border-slate-800 text-slate-600 cursor-not-allowed'
                  : 'border-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {state.copied ? <Check size={18} /> : <Copy size={18} />}
            {state.copied
              ? (isEs ? 'Copiado' : 'Copied')
              : (isEs ? 'Copiar MD' : 'Copy MD')
            }
          </button>

          <button
            onClick={handleReset}
            className={`ml-auto px-4 py-2.5 rounded-lg text-sm transition-colors ${
              isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            {isEs ? 'Limpiar' : 'Clear'}
          </button>
        </div>

        <p className={`text-xs mt-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          {isEs
            ? 'Al publicar, el artículo se crea en tu repo de GitHub y GitHub Actions lo despliega automáticamente.'
            : 'When published, the article is created in your GitHub repo and GitHub Actions deploys it automatically.'}
        </p>
      </div>
    </div>
  );
}
