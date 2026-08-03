import { useState, useEffect } from 'react';
import { database } from '../config/firebase';
import { ref, onValue, push, update } from 'firebase/database';

export type TestimonialStatus = 'pending' | 'approved' | 'rejected';

export type TestimonialLang = 'es' | 'en';

export type TestimonialTranslations = Partial<Record<TestimonialLang, string>>;

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  photoUrl: string;
  /** Text as it was submitted, in `lang`. Also the fallback for older rows. */
  description: string;
  /** Language the author wrote in. Absent on rows created before translations existed. */
  lang?: TestimonialLang;
  /** One entry per language, filled in when the testimonial is approved. */
  translations?: TestimonialTranslations;
  createdAt: string;
  status: TestimonialStatus;
}

export interface TestimonialInput {
  name: string;
  role: string;
  photoUrl: string;
  description: string;
  lang: TestimonialLang;
}

export function normalizeLang(language: string): TestimonialLang {
  return language.startsWith('en') ? 'en' : 'es';
}

/** Picks the requested language, falling back to the other one and then to the original. */
export function testimonialText(testimonial: Testimonial, language: string): string {
  const lang = normalizeLang(language);
  const other: TestimonialLang = lang === 'es' ? 'en' : 'es';
  return (
    testimonial.translations?.[lang] ||
    testimonial.translations?.[other] ||
    testimonial.description
  );
}

export function useTestimonials() {
  const [allTestimonials, setAllTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const testimonialsRef = ref(database, 'testimonials');
    const unsubscribe = onValue(testimonialsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list: Testimonial[] = Object.entries(data).map(([id, value]) => ({
          id,
          ...(value as Omit<Testimonial, 'id'>),
        }));
        // Newest first
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setAllTestimonials(list);
      } else {
        setAllTestimonials([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const approvedTestimonials = allTestimonials.filter((t) => t.status === 'approved');

  const submitTestimonial = async (input: TestimonialInput): Promise<void> => {
    const testimonialsRef = ref(database, 'testimonials');
    await push(testimonialsRef, {
      ...input,
      // The submitted language is filled in already; the other one is added on approval
      translations: { [input.lang]: input.description },
      createdAt: new Date().toISOString(),
      status: 'pending',
    });
  };

  const updateStatus = async (id: string, status: TestimonialStatus): Promise<void> => {
    const testimonialRef = ref(database, `testimonials/${id}`);
    await update(testimonialRef, { status });
  };

  /**
   * Approving requires both languages, so the site never shows an untranslated quote.
   * `lang` is corrected here too: the submission form only knows which language the
   * site was in, which is not always the one the person wrote in.
   */
  const approveTestimonial = async (
    id: string,
    translations: TestimonialTranslations,
    lang: TestimonialLang
  ): Promise<void> => {
    const testimonialRef = ref(database, `testimonials/${id}`);
    await update(testimonialRef, { status: 'approved', translations, lang });
  };

  return {
    approvedTestimonials,
    allTestimonials,
    submitTestimonial,
    updateStatus,
    approveTestimonial,
  };
}
