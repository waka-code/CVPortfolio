import { ChevronLeft, ChevronRight, List } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { splitHeadingNumber, type TocNode } from '../utils/markdownToc';

interface TableOfContentsProps {
  nodes: TocNode[];
  /** Heading shown above the list */
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  /** `sidebar` sticks to the side of the article; `inline` stacks above it */
  variant?: 'sidebar' | 'inline';
}

/**
 * Jumps without touching the hash: the app routes on `window.location.hash`,
 * so an anchor href would navigate away from the article.
 *
 * The article lives in a fixed overlay with its own scrollbar, and the sticky
 * table of contents next to it scrolls too. Rather than let scrollIntoView pick
 * a container out of that chain, scroll the marked one explicitly.
 */
function scrollToHeading(id: string) {
  const target = document.getElementById(id);
  if (!target) return;

  const container = target.closest<HTMLElement>('[data-scroll-root]');
  if (!container) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  // Clears the sticky back bar so the heading is not hidden underneath it
  const stickyBar = container.querySelector<HTMLElement>('[data-sticky-bar]');
  const offset = (stickyBar?.offsetHeight ?? 0) + 24;

  const top =
    target.getBoundingClientRect().top -
    container.getBoundingClientRect().top +
    container.scrollTop -
    offset;

  container.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
}

interface TocListProps {
  nodes: TocNode[];
  depth: number;
  isOpen: boolean;
}

function TocList({ nodes, depth, isOpen }: TocListProps) {
  const { isDark } = useTheme();

  return (
    <ol
      className={
        depth === 0
          ? 'space-y-0.5'
          : `mt-0.5 space-y-0.5 border-l transition-[padding] duration-300 ${
              isOpen ? 'pl-2' : 'pl-1'
            } ${isDark ? 'border-slate-700' : 'border-slate-200'}`
      }
    >
      {nodes.map((node) => {
        const { number, label } = splitHeadingNumber(node.text);
        return (
          <li key={node.id}>
            <button
              onClick={() => scrollToHeading(node.id)}
              title={node.text}
              className={`flex items-baseline gap-1.5 w-full rounded px-1.5 py-1 leading-snug transition-colors ${
                isOpen ? 'text-left' : 'justify-center'
              } ${depth === 0 ? 'text-sm font-medium' : 'text-xs'} ${
                isDark
                  ? 'text-slate-300 hover:bg-slate-800 hover:text-blue-400'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600'
              }`}
            >
              <span className="shrink-0 tabular-nums text-blue-500">{number || '•'}</span>
              {/* Collapsed keeps numbers only — a truncated word reads as noise */}
              {isOpen && <span className="min-w-0">{label}</span>}
            </button>
            {node.children.length > 0 && (
              <TocList nodes={node.children} depth={depth + 1} isOpen={isOpen} />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export function TableOfContents({
  nodes,
  title,
  isOpen,
  onToggle,
  variant = 'sidebar',
}: TableOfContentsProps) {
  const { isDark } = useTheme();

  if (nodes.length === 0) return null;

  return (
    <nav
      aria-label={title}
      // Positioning is the caller's job; this only draws the panel
      className={`rounded-xl border p-3 ${variant === 'inline' ? 'mb-8' : ''} ${
        isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200'
      }`}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        title={title}
        className={`flex items-center gap-2 text-sm font-semibold w-full ${
          isOpen ? '' : 'justify-center'
        } ${isDark ? 'text-white' : 'text-slate-900'}`}
      >
        <List size={16} className="text-blue-500 shrink-0" />
        {isOpen && <span className="truncate">{title}</span>}
        {isOpen ? (
          <ChevronLeft size={15} className="ml-auto shrink-0" />
        ) : (
          <ChevronRight size={15} className="shrink-0" />
        )}
      </button>

      <div className="mt-3">
        <TocList nodes={nodes} depth={0} isOpen={isOpen} />
      </div>
    </nav>
  );
}
