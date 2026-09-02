import { ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ViewAllButtonProps {
  href: string;
  label: string;
  count: number;
  /** Las secciones alternan de fondo, así que el botón ajusta el suyo */
  surface?: 'light' | 'dark';
}

/** Botón de "ver todos" con efecto tren: el texto se despliega a la izquierda de la flecha */
export function ViewAllButton({ href, label, count, surface = 'dark' }: ViewAllButtonProps) {
  const { isDark } = useTheme();
  const fullLabel = `${label} (${count})`;

  const themeClass = isDark
    ? `${surface === 'dark' ? 'bg-slate-900' : 'bg-slate-800'} border-slate-700 text-blue-400 hover:border-blue-500 hover:text-blue-300`
    : 'bg-white border-slate-200 text-blue-600 hover:border-blue-300 hover:text-blue-700';

  return (
    <div className="flex justify-center mt-12">
      <a
        href={href}
        aria-label={fullLabel}
        className={`icon-pill btn-animate px-3 py-2.5 rounded-full border transition-colors ${themeClass}`}
      >
        <span className="icon-pill-label icon-pill-label--leading font-medium">{fullLabel}</span>
        <ArrowRight size={20} className="shrink-0" />
      </a>
    </div>
  );
}
