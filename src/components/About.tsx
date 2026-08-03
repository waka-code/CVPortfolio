import { ArrowLeft, CalendarClock, Camera, GraduationCap, Mic, Sparkles, Terminal, Users } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { ScreenshotSlider } from './ScreenshotSlider';
import { TableOfContents } from './TableOfContents';
import { ABOUT_HASH, HOME_SECTION_HASH } from '../constants/routes';
import type { TocNode } from '../utils/markdownToc';
import type { Job } from './ExperienceCard';

interface Person {
  name: string;
  role: string;
}

interface Milestone {
  year: number;
  title: string;
  description: string;
}

interface TimelineEntry {
  year: number;
  period: string;
  title: string;
  description: string;
}

interface AboutProps {
  jobs: Job[];
}

const SECTION_ICONS = {
  start: Terminal,
  academy: GraduationCap,
  utesa: Mic,
  today: Sparkles,
} as const;

type SectionKey = keyof typeof SECTION_ICONS;

const SECTION_ORDER: SectionKey[] = ['start', 'academy', 'utesa', 'today'];

const PORTRAIT_IMAGE = 7;

/** The portrait already heads this screen, so it is not repeated in the carousel */
const MOMENTS_EXCLUDED_IMAGES = [PORTRAIT_IMAGE];

export function About({ jobs }: AboutProps) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isTocOpen, setIsTocOpen] = useState(true);

  // Numbered so the collapsed sidebar still shows something meaningful
  const tocNodes = useMemo<TocNode[]>(() => {
    const entries = [
      ...SECTION_ORDER.map((key) => ({
        id: `about-${key}`,
        text: t(`about.sections.${key}.title`),
      })),
      { id: 'about-people', text: t('about.peopleTitle') },
      { id: 'about-timeline', text: t('about.timelineTitle') },
      { id: 'about-moments', text: t('about.momentsTitle') },
    ];

    return entries.map((entry, index) => ({
      id: entry.id,
      text: `${index + 1}. ${entry.text}`,
      level: 1,
      children: [],
    }));
  }, [t]);

  // Study milestones come from the copy; roles come from the same data the
  // Experience section renders, so the two can never contradict each other.
  const timeline = useMemo<TimelineEntry[]>(() => {
    const milestones = t('about.milestones', { returnObjects: true }) as Milestone[];

    const fromMilestones: TimelineEntry[] = milestones.map((milestone) => ({
      year: milestone.year,
      period: String(milestone.year),
      title: milestone.title,
      description: milestone.description,
    }));

    const fromJobs: TimelineEntry[] = jobs.map((job) => ({
      year: job.startYear ?? 0,
      period: job.period,
      title: `${job.title} · ${job.company}`,
      description: job.description,
    }));

    // Stable sort keeps a milestone ahead of a role that started the same year
    return [...fromMilestones, ...fromJobs].sort((a, b) => a.year - b.year);
    // `t` gets a new identity on language change, which is what re-runs this
  }, [t, jobs]);

  const handleBack = useCallback(() => {
    window.location.hash = HOME_SECTION_HASH;
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const open = window.location.hash === ABOUT_HASH;
      setIsOpen(open);
      if (open) window.scrollTo(0, 0);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleBack();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, handleBack]);

  if (!isOpen) return null;

  const people = t('about.people', { returnObjects: true }) as Person[];

  return (
    <div
      data-scroll-root
      className={`fixed inset-0 z-[55] overflow-y-auto overscroll-contain animate-fade-in-up ${
        isDark ? 'bg-slate-900' : 'bg-slate-50'
      }`}
    >
      <div
        data-sticky-bar
        className={`sticky top-0 z-20 border-b backdrop-blur ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50/90 border-slate-200'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-3">
          <button
            onClick={handleBack}
            className={`btn-animate flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-blue-400 hover:border-blue-500 hover:text-blue-300'
                : 'bg-white border-slate-200 text-blue-600 hover:border-blue-300 hover:text-blue-700'
            }`}
          >
            <ArrowLeft size={20} />
            <span className="font-medium">{t('about.back')}</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-8 pb-16">
        <header className="mb-12 flex items-center gap-5 flex-wrap">
          <img
            src={`${import.meta.env.BASE_URL}waddy/${PORTRAIT_IMAGE}.jpeg`}
            alt={t('hero.title')}
            className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-500 shadow-xl"
          />
          <div>
            <h1 className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('about.title')}
            </h1>
            <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {t('about.subtitle')}
            </p>
          </div>
        </header>

        <div
          className={`grid gap-10 items-start transition-[grid-template-columns] duration-300 ease-out ${
            isTocOpen ? 'lg:grid-cols-[18rem_minmax(0,1fr)]' : 'lg:grid-cols-[4.5rem_minmax(0,1fr)]'
          }`}
        >
          {/* Sticky lives on the grid item: the nav alone is too short to stick against */}
          <aside className="lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
            <TableOfContents
              nodes={tocNodes}
              title={t('about.tableOfContents')}
              isOpen={isTocOpen}
              onToggle={() => setIsTocOpen((prev) => !prev)}
            />
          </aside>

          <div className="space-y-12">
          {SECTION_ORDER.map((key) => {
            const Icon = SECTION_ICONS[key];
            const paragraphs = t(`about.sections.${key}.paragraphs`, {
              returnObjects: true,
            }) as string[];

            return (
              <section key={key} id={`about-${key}`} className="scroll-mt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Icon size={22} className="text-blue-500 shrink-0" />
                  <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {t(`about.sections.${key}.title`)}
                  </h2>
                </div>
                <div className="space-y-4">
                  {paragraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className={`text-lg leading-relaxed ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            );
          })}

          <section id="about-people" className="scroll-mt-6">
            <div className="flex items-center gap-3 mb-5">
              <Users size={22} className="text-blue-500 shrink-0" />
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t('about.peopleTitle')}
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {people.map((person) => (
                <div
                  key={person.name}
                  className={`rounded-xl border p-5 transition-colors ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 hover:border-blue-500'
                      : 'bg-white border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {person.name}
                  </p>
                  <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {person.role}
                  </p>
                </div>
              ))}
            </div>

          </section>

          <section id="about-timeline" className="scroll-mt-6">
            <div className="flex items-center gap-3 mb-6">
              <CalendarClock size={22} className="text-blue-500 shrink-0" />
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t('about.timelineTitle')}
              </h2>
            </div>

            <ol className={`relative border-l ml-2 ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
              {timeline.map((entry) => (
                <li key={`${entry.period}-${entry.title}`} className="ml-6 pb-8 last:pb-0">
                  <span
                    className={`absolute -left-[7px] mt-1.5 w-3 h-3 rounded-full ring-4 ${
                      isDark ? 'bg-blue-500 ring-slate-900' : 'bg-blue-600 ring-slate-50'
                    }`}
                  />
                  <p className={`text-sm font-medium mb-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                    {entry.period}
                  </p>
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {entry.title}
                  </p>
                  <p className={`text-sm mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {entry.description}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <section id="about-moments" className="scroll-mt-6">
            <div className="flex items-center gap-3 mb-5">
              <Camera size={22} className="text-blue-500 shrink-0" />
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t('about.momentsTitle')}
              </h2>
            </div>

            <ScreenshotSlider
              folder={`${import.meta.env.BASE_URL}waddy/`}
              title={t('about.title')}
              exclude={MOMENTS_EXCLUDED_IMAGES}
            />
          </section>
          </div>
        </div>
      </div>
    </div>
  );
}
