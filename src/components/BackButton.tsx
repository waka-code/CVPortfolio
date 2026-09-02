import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface BackButtonProps {
  onClick: () => void;
  label: string;
  /** Wrapper spacing, so cada pantalla decide su separación */
  className?: string;
}

/** Botón de volver con efecto tren: solo el icono, el texto se despliega al hover */
export function BackButton({ onClick, label, className = 'mb-8' }: BackButtonProps) {
  const { isDark } = useTheme();

  return (
    <div className={className}>
      <button
        onClick={onClick}
        aria-label={label}
        className={`icon-pill btn-animate px-3 py-2.5 rounded-full border transition-colors ${
          isDark
            ? 'bg-slate-800 border-slate-700 text-blue-400 hover:border-blue-500 hover:text-blue-300'
            : 'bg-white border-slate-200 text-blue-600 hover:border-blue-300 hover:text-blue-700'
        }`}
      >
        <ArrowLeft size={20} className="shrink-0" />
        <span className="icon-pill-label font-medium">{label}</span>
      </button>
    </div>
  );
}
