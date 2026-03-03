import { useState, useEffect } from 'react';
import { database } from '../config/firebase';
import { ref, onValue, push, update } from 'firebase/database';

export type TestimonialStatus = 'pending' | 'approved' | 'rejected';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  photoUrl: string;
  description: string;
  createdAt: string;
  status: TestimonialStatus;
}

export interface TestimonialInput {
  name: string;
  role: string;
  photoUrl: string;
  description: string;
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
      createdAt: new Date().toISOString(),
      status: 'pending',
    });
  };

  const updateStatus = async (id: string, status: TestimonialStatus): Promise<void> => {
    const testimonialRef = ref(database, `testimonials/${id}`);
    await update(testimonialRef, { status });
  };

  return { approvedTestimonials, allTestimonials, submitTestimonial, updateStatus };
}
