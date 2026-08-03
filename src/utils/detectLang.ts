import type { TestimonialLang } from '../hooks/useTestimonials';

const SPANISH_MARKS = /[áéíóúüñ¿¡]/gi;
const SPANISH_WORDS =
  /\b(que|de|la|el|los|las|una|para|con|por|más|pero|como|sus|su|en|es|del|al|lo|cuando|siempre|muy)\b/gi;
const ENGLISH_WORDS =
  /\b(the|and|with|is|of|to|for|that|his|her|are|was|would|there|when|from|about|always|very|kind)\b/gi;

function countMatches(text: string, pattern: RegExp) {
  return text.match(pattern)?.length ?? 0;
}

/**
 * Best guess at which language a testimonial was written in.
 *
 * The submission form records the language the *site* was in, which is not
 * necessarily the language the person typed, so the text itself is the better
 * signal. Accented characters weigh double but cannot outvote the word counts
 * on their own — an English text mentioning "José" should still read as English.
 * A guess, not a certainty: the reviewer can override it before approving.
 */
export function detectTestimonialLang(
  text: string,
  fallback: TestimonialLang = 'es'
): TestimonialLang {
  const spanish = countMatches(text, SPANISH_WORDS) + countMatches(text, SPANISH_MARKS) * 2;
  const english = countMatches(text, ENGLISH_WORDS);

  if (spanish === 0 && english === 0) return fallback;
  return english > spanish ? 'en' : 'es';
}
