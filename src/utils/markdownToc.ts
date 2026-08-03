import { slugify } from './slugify';

export interface TocEntry {
  id: string;
  text: string;
  level: number;
}

export interface TocNode extends TocEntry {
  children: TocNode[];
}

/**
 * Anchor id for a heading. Derived only from the heading text so that the table
 * of contents and the rendered heading always agree without sharing state —
 * React StrictMode renders twice in development, which would desync a counter.
 * Two headings with identical text therefore share one anchor.
 */
export function headingId(text: string) {
  return slugify(text) || 'section';
}

const FENCE = /^\s*(```|~~~)/;
const HEADING = /^(#{1,4})\s+(.+?)\s*#*\s*$/;
const NUMBER_PREFIX = /^(\d+(?:\.\d+)*)[.)]?\s+/;

/** Splits "4.2.1 React.memo" into its outline number and the rest of the title. */
export function splitHeadingNumber(text: string) {
  const match = text.match(NUMBER_PREFIX);
  if (!match) return { number: '', label: text };
  return { number: match[1], label: text.slice(match[0].length) };
}

/** Builds a table of contents from the markdown headings, ignoring fenced code blocks. */
export function buildToc(markdown: string): TocEntry[] {
  const entries: TocEntry[] = [];
  let insideFence = false;

  for (const line of markdown.split('\n')) {
    if (FENCE.test(line)) {
      insideFence = !insideFence;
      continue;
    }
    if (insideFence) continue;

    const match = line.match(HEADING);
    if (!match) continue;

    const text = match[2].replace(/[*`_]/g, '').trim();
    if (!text) continue;

    entries.push({ id: headingId(text), text, level: match[1].length });
  }

  return entries;
}

/** Nests the flat heading list so deeper headings become sub-entries of the previous one. */
export function buildTocTree(entries: TocEntry[]): TocNode[] {
  const roots: TocNode[] = [];
  const ancestors: TocNode[] = [];

  entries.forEach((entry) => {
    const node: TocNode = { ...entry, children: [] };

    while (ancestors.length > 0 && ancestors[ancestors.length - 1].level >= node.level) {
      ancestors.pop();
    }

    if (ancestors.length > 0) {
      ancestors[ancestors.length - 1].children.push(node);
    } else {
      roots.push(node);
    }

    ancestors.push(node);
  });

  return roots;
}
