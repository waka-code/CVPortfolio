import { isValidElement, type ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTheme } from '../context/ThemeContext';
import { headingId } from '../utils/markdownToc';

/** Flattens a heading's children (which may include inline code or emphasis) to plain text. */
function toPlainText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(toPlainText).join('');
  if (isValidElement(node)) {
    const { children } = node.props as { children?: ReactNode };
    return toPlainText(children);
  }
  return '';
}

type HeadingProps = { children?: ReactNode };

function anchoredHeading(Tag: 'h1' | 'h2' | 'h3' | 'h4') {
  return function Heading({ children }: HeadingProps) {
    return (
      <Tag id={headingId(toPlainText(children))} className="scroll-mt-6">
        {children}
      </Tag>
    );
  };
}

const HEADING_COMPONENTS = {
  h1: anchoredHeading('h1'),
  h2: anchoredHeading('h2'),
  h3: anchoredHeading('h3'),
  h4: anchoredHeading('h4'),
};

interface MarkdownContentProps {
  content: string;
  size?: 'sm' | 'lg';
}

export function MarkdownContent({ content, size = 'lg' }: MarkdownContentProps) {
  const { isDark } = useTheme();

  return (
    <article
      className={`prose ${size === 'sm' ? 'prose-sm' : 'prose-lg'} max-w-none ${
        isDark
          ? 'prose-invert prose-headings:text-white prose-p:text-slate-300 prose-a:text-blue-400 prose-strong:text-white prose-code:text-blue-400 prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700'
          : 'prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-blue-600 prose-strong:text-slate-900 prose-code:text-blue-600 prose-pre:bg-slate-50 prose-pre:border prose-pre:border-slate-200'
      }`}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={HEADING_COMPONENTS}>
        {content}
      </ReactMarkdown>
    </article>
  );
}
