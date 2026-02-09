import { X, Eye, Edit3, Copy, Check, Send, Key, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useReducer } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { commitBlogArticle, getGitHubToken, setGitHubToken, clearGitHubToken } from '../utils/githubApi';

interface BlogEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

type PublishStatus = 'idle' | 'publishing' | 'success' | 'error';

interface EditorState {
  title: string;
  subtitle: string;
  tags: string;
  content: string;
  showPreview: boolean;
  copied: boolean;
  publishStatus: PublishStatus;
  statusMessage: string;
  showTokenInput: boolean;
  tokenInput: string;
  publishLang: 'es' | 'en' | 'both';
}

type EditorAction =
  | { type: 'SET_FIELD'; field: keyof EditorState; value: any }
  | { type: 'TOGGLE_PREVIEW' }
  | { type: 'TOGGLE_TOKEN_INPUT' }
  | { type: 'SET_COPIED'; value: boolean }
  | { type: 'SET_PUBLISH_STATUS'; status: PublishStatus; message: string }
  | { type: 'RESET_FORM' };

const initialState: EditorState = {
  title: '',
  subtitle: '',
  tags: '',
  content: '',
  showPreview: false,
  copied: false,
  publishStatus: 'idle',
  statusMessage: '',
  showTokenInput: false,
  tokenInput: '',
  publishLang: 'es',
};

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'TOGGLE_PREVIEW':
      return { ...state, showPreview: !state.showPreview };
    case 'TOGGLE_TOKEN_INPUT':
      return { ...state, showTokenInput: !state.showTokenInput };
    case 'SET_COPIED':
      return { ...state, copied: action.value };
    case 'SET_PUBLISH_STATUS':
      return { ...state, publishStatus: action.status, statusMessage: action.message };
    case 'RESET_FORM':
      return { ...initialState, showTokenInput: state.showTokenInput };
    default:
      return state;
  }
}

export function BlogEditor({ isOpen, onClose }: BlogEditorProps) {
  const { isDark } = useTheme();
  const { i18n } = useTranslation();
  const [state, dispatch] = useReducer(editorReducer, initialState);

  if (!isOpen) return null;

  const isEs = i18n.language === 'es';
  const hasToken = !!getGitHubToken();

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
---

${state.content}
`;
  };

  const handleSaveToken = () => {
    if (state.tokenInput.trim()) {
      setGitHubToken(state.tokenInput.trim());
      dispatch({ type: 'SET_FIELD', field: 'tokenInput', value: '' });
      dispatch({ type: 'TOGGLE_TOKEN_INPUT' });
    }
  };

  const handleRemoveToken = () => {
    clearGitHubToken();
    dispatch({ type: 'SET_FIELD', field: 'showTokenInput', value: false });
    dispatch({ type: 'SET_FIELD', field: 'tokenInput', value: '' });
  };

  const handlePublish = async () => {
    if (!hasToken) {
      dispatch({ type: 'SET_FIELD', field: 'showTokenInput', value: true });
      return;
    }

    dispatch({
      type: 'SET_PUBLISH_STATUS',
      status: 'publishing',
      message: isEs ? 'Publicando artículo...' : 'Publishing article...'
    });

    const md = generateMarkdown();
    const filename = `${slug}.md`;
    const langs = state.publishLang === 'both' ? ['es', 'en'] : [state.publishLang];

    let allSuccess = true;
    const results: string[] = [];

    for (const lang of langs) {
      const result = await commitBlogArticle(
        filename,
        md,
        lang,
        `blog: add ${slug} (${lang})`
      );

      if (result.success) {
        results.push(`${lang}: ${result.message}`);
      } else {
        allSuccess = false;
        results.push(`${lang}: ${result.message}`);
      }
    }

    if (allSuccess) {
      dispatch({
        type: 'SET_PUBLISH_STATUS',
        status: 'success',
        message: isEs
          ? `Artículo publicado. GitHub Actions desplegará automáticamente.\n${results.join('\n')}`
          : `Article published. GitHub Actions will deploy automatically.\n${results.join('\n')}`
      });
    } else {
      dispatch({
        type: 'SET_PUBLISH_STATUS',
        status: 'error',
        message: results.join('\n')
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
              onClick={() => dispatch({ type: 'TOGGLE_TOKEN_INPUT' })}
              className={`p-2 rounded-lg transition-colors ${
                hasToken
                  ? 'text-green-400 hover:bg-slate-800'
                  : isDark
                    ? 'text-yellow-400 hover:bg-slate-800'
                    : 'text-yellow-600 hover:bg-slate-100'
              }`}
              title={hasToken ? (isEs ? 'Token configurado' : 'Token configured') : (isEs ? 'Configurar token' : 'Configure token')}
            >
              <Key size={20} />
            </button>
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

        {/* Token Configuration */}
        {state.showTokenInput && (
          <div className={`mb-6 p-4 rounded-lg border ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
          }`}>
            <p className={`text-sm mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {isEs
                ? 'Necesitas un GitHub Personal Access Token con permiso "Contents: Read and write" para tu repo.'
                : 'You need a GitHub Personal Access Token with "Contents: Read and write" permission for your repo.'}
            </p>
            <a
              href="https://github.com/settings/tokens/new?scopes=repo&description=CVPortfolio+Blog+Editor"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm underline mb-3 inline-block"
            >
              {isEs ? 'Crear token en GitHub' : 'Create token on GitHub'}
            </a>
            {hasToken ? (
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-green-400 text-sm">
                  <CheckCircle2 size={16} />
                  {isEs ? 'Token configurado' : 'Token configured'}
                </span>
                <button
                  onClick={handleRemoveToken}
                  className="text-red-400 hover:text-red-300 text-sm underline"
                >
                  {isEs ? 'Eliminar token' : 'Remove token'}
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="password"
                  value={state.tokenInput}
                  onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'tokenInput', value: e.target.value })}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  className={`flex-1 px-3 py-2 rounded-lg border text-sm ${
                    isDark
                      ? 'bg-slate-900 border-slate-600 text-white placeholder-slate-500'
                      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveToken()}
                />
                <button
                  onClick={handleSaveToken}
                  disabled={!state.tokenInput.trim()}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isEs ? 'Guardar' : 'Save'}
                </button>
              </div>
            )}
            <p className={`text-xs mt-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {isEs
                ? 'El token se guarda en localStorage de tu navegador. Solo tú puedes usarlo.'
                : 'The token is stored in your browser\'s localStorage. Only you can use it.'}
            </p>
          </div>
        )}

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
              <span className="font-medium">{isEs ? 'Archivo' : 'File'}:</span>{' '}
              <code>src/blog/{state.publishLang === 'both' ? 'es & en' : state.publishLang}/{slug || 'slug'}.md</code>
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
              <article className={`prose prose-sm max-w-none ${
                isDark
                  ? 'prose-invert prose-headings:text-white prose-p:text-slate-300 prose-a:text-blue-400'
                  : 'prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-blue-600'
              }`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {state.content || (isEs ? '*Escribe contenido para ver la vista previa...*' : '*Write content to see the preview...*')}
                </ReactMarkdown>
              </article>
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
            {isEs ? 'Publicar en GitHub' : 'Publish to GitHub'}
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
