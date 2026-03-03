import { useState, useEffect } from 'react';
import { ShieldCheck, X, Lock, CheckCircle, XCircle, RotateCcw, Eye } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useTestimonials, type Testimonial, type TestimonialStatus } from '../hooks/useTestimonials';

const ADMIN_TOKEN_KEY = 'admin_token';

type TabKey = 'pending' | 'approved' | 'rejected';

function Avatar({ name, photoUrl, isDark }: { name: string; photoUrl: string; isDark: boolean }) {
  const [imgError, setImgError] = useState(false);
  const initial = name.trim().charAt(0).toUpperCase();

  if (photoUrl && !imgError) {
    return (
      <img
        src={photoUrl}
        alt={name}
        onError={() => setImgError(true)}
        className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500 flex-shrink-0"
      />
    );
  }

  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0 ring-2 ring-blue-500 ${
        isDark ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'
      }`}
    >
      {initial}
    </div>
  );
}

function TestimonialRow({
  testimonial,
  tab,
  onApprove,
  onReject,
  onRevoke,
  onRestore,
  isDark,
  t,
}: {
  testimonial: Testimonial;
  tab: TabKey;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onRevoke: (id: string) => void;
  onRestore: (id: string) => void;
  isDark: boolean;
  t: (key: string) => string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`rounded-xl border p-4 transition-colors ${
        isDark ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'
      }`}
    >
      <div className="flex items-start gap-3">
        <Avatar name={testimonial.name} photoUrl={testimonial.photoUrl} isDark={isDark} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {testimonial.name}
              </p>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {testimonial.role}
              </p>
            </div>
            <p className={`text-xs flex-shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {new Date(testimonial.createdAt).toLocaleDateString()}
            </p>
          </div>

          <p className={`text-sm mt-2 ${isDark ? 'text-slate-300' : 'text-slate-600'} ${!expanded ? 'line-clamp-2' : ''}`}>
            "{testimonial.description}"
          </p>
          {testimonial.description.length > 120 && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className={`text-xs mt-1 flex items-center gap-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}
            >
              <Eye size={12} />
              {expanded ? 'Less' : 'More'}
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-4 justify-end flex-wrap">
        {tab === 'pending' && (
          <>
            <button
              onClick={() => onApprove(testimonial.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition-colors"
            >
              <CheckCircle size={14} />
              {t('testimonials.admin.approve')}
            </button>
            <button
              onClick={() => onReject(testimonial.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium transition-colors"
            >
              <XCircle size={14} />
              {t('testimonials.admin.reject')}
            </button>
          </>
        )}
        {tab === 'approved' && (
          <button
            onClick={() => onRevoke(testimonial.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              isDark
                ? 'border-slate-600 text-slate-300 hover:bg-slate-600'
                : 'border-slate-300 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <RotateCcw size={14} />
            {t('testimonials.admin.revoke')}
          </button>
        )}
        {tab === 'rejected' && (
          <button
            onClick={() => onRestore(testimonial.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              isDark
                ? 'border-slate-600 text-slate-300 hover:bg-slate-600'
                : 'border-slate-300 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <RotateCcw size={14} />
            {t('testimonials.admin.restore')}
          </button>
        )}
      </div>
    </div>
  );
}

export function TestimonialsAdmin() {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const { allTestimonials, updateStatus } = useTestimonials();

  const [isOpen, setIsOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [wrongPassword, setWrongPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('pending');

  // Listen to hash changes
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setIsOpen(true);
        // Check if already authenticated
        const stored = localStorage.getItem(ADMIN_TOKEN_KEY);
        const adminPass = import.meta.env.VITE_ADMIN_PASSWORD;
        if (stored && adminPass && stored === adminPass) {
          setIsUnlocked(true);
        }
      } else {
        setIsOpen(false);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePanel();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  function closePanel() {
    setIsOpen(false);
    if (window.location.hash === '#admin') {
      history.pushState(null, '', window.location.pathname + window.location.search);
    }
  }

  function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    const adminPass = import.meta.env.VITE_ADMIN_PASSWORD;
    if (adminPass && password === adminPass) {
      localStorage.setItem(ADMIN_TOKEN_KEY, password);
      setIsUnlocked(true);
      setWrongPassword(false);
    } else {
      setWrongPassword(true);
    }
  }

  const tabs: { key: TabKey; status: TestimonialStatus }[] = [
    { key: 'pending', status: 'pending' },
    { key: 'approved', status: 'approved' },
    { key: 'rejected', status: 'rejected' },
  ];

  const filtered = allTestimonials.filter((t) => t.status === activeTab);

  const handleApprove = (id: string) => updateStatus(id, 'approved');
  const handleReject = (id: string) => updateStatus(id, 'rejected');
  const handleRevoke = (id: string) => updateStatus(id, 'pending');
  const handleRestore = (id: string) => updateStatus(id, 'pending');

  const pendingCount = allTestimonials.filter((t) => t.status === 'pending').length;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in-up"
      onClick={closePanel}
    >
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl ${
          isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-5 border-b flex-shrink-0 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <div className="flex items-center gap-2">
            <ShieldCheck size={22} className="text-blue-500" />
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('testimonials.admin.title')}
            </h3>
            {isUnlocked && pendingCount > 0 && (
              <span className="px-2 py-0.5 bg-amber-500 text-white text-xs font-bold rounded-full">
                {pendingCount}
              </span>
            )}
          </div>
          <button
            onClick={closePanel}
            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Password gate */}
        {!isUnlocked ? (
          <form onSubmit={handleUnlock} className="p-8 flex flex-col items-center gap-4">
            <Lock size={40} className={isDark ? 'text-slate-400' : 'text-slate-400'} />
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Admin access required
            </p>
            <div className="w-full max-w-xs space-y-3">
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setWrongPassword(false); }}
                placeholder={t('testimonials.admin.passwordPlaceholder')}
                className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                } ${wrongPassword ? 'border-red-500' : ''}`}
                autoFocus
              />
              {wrongPassword && (
                <p className="text-red-500 text-xs">{t('testimonials.admin.wrongPassword')}</p>
              )}
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {t('testimonials.admin.unlock')}
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* Tabs */}
            <div className={`flex border-b flex-shrink-0 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              {tabs.map(({ key }) => {
                const count = allTestimonials.filter((t) => t.status === key).length;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === key
                        ? 'border-blue-500 text-blue-500'
                        : isDark
                          ? 'border-transparent text-slate-400 hover:text-slate-200'
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {t(`testimonials.admin.tabs.${key}`)}
                    {count > 0 && (
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                          key === 'pending'
                            ? 'bg-amber-500 text-white'
                            : key === 'approved'
                              ? 'bg-green-600 text-white'
                              : isDark
                                ? 'bg-slate-600 text-slate-300'
                                : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {filtered.length === 0 ? (
                <p className={`text-sm text-center py-10 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {t('testimonials.admin.noItems')}
                </p>
              ) : (
                filtered.map((testimonial) => (
                  <TestimonialRow
                    key={testimonial.id}
                    testimonial={testimonial}
                    tab={activeTab}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onRevoke={handleRevoke}
                    onRestore={handleRestore}
                    isDark={isDark}
                    t={t}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
