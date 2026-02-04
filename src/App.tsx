import { Hero } from './components/Hero';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Education } from './components/Education';
import { Footer } from './components/Footer';
import { HeaderNav } from './components/HeaderNav';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { useTranslation } from 'react-i18next';

function AppContent() {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const personalInfo = {
    email: 'shenryvladimil@gmail.com',
    phone: '1-829-504-1112',
    github: 'https://github.com/waka-code',
    linkedin: 'https://www.linkedin.com/in/waddimi-saint-louis-b49424230/',
  };

  const jobKeys = ['higherbit', 'prodoctivity', 'imarket', 'freelancer'] as const;

  const jobs = jobKeys.map((key) => ({
    title: t(`experience.jobs.${key}.title`),
    company: t(`experience.jobs.${key}.company`),
    period: t(`experience.jobs.${key}.period`),
    description: t(`experience.jobs.${key}.description`),
    tasks: t(`experience.jobs.${key}.tasks`, { returnObjects: true }) as string[],
    technologies:
      key === 'higherbit'
        ? ['Python', 'Django', 'PostgreSQL', 'React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Docker', 'AWS', 'Terraform']
        : key === 'prodoctivity'
          ? ['React', 'TypeScript', 'Node.js', 'Docker', 'MongoDB']
          : key === 'imarket'
            ? ['Angular', 'TypeScript', '.NET 8', 'C#', 'Docker', 'PostgreSQL']
            : ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue.js', 'Node.js', '.NET', 'MongoDB', 'PostgreSQL'],
  }));

  const projectKeys = ['ownorbit', 'virtualwallet', 'stockhex'] as const;

  const projects = projectKeys.map((key) => ({
    name: t(`projects.items.${key}.name`),
    date: t(`projects.items.${key}.date`),
    description: t(`projects.items.${key}.description`),
    tasks: key !== 'stockhex' ? (t(`projects.items.${key}.tasks`, { returnObjects: true }) as string[]) : undefined,
    technologies:
      key === 'ownorbit'
        ? ['Node.js', 'TypeScript', 'Express.js', 'Docker', 'NGINX', 'React', 'React Native', 'Expo', 'Tailwind CSS', 'Jest']
        : key === 'virtualwallet'
          ? ['Node.js', 'TypeScript', 'Express.js', 'MongoDB', 'React', 'Docker', 'Microservices', 'REST APIs', 'JWT', 'Postman']
          : ['.NET 8', 'C#', 'SQL Server', 'JWT', 'Swagger', 'Docker'],
    link: key === 'ownorbit' 
      ? 'https://preview--renta-pulse.lovable.app/'
      : key === 'virtualwallet'
        ? 'https://github.com/waka-code/wallet'
        : 'https://github.com/waka-code/StockHex',
  }));

  const skillCategories = [
    { category: t('skills.categories.coreStack'), skills: ['React.js + TypeScript', 'Next.js', 'Node.js + Express.js', 'MongoDB', 'PostgreSQL', 'Docker', 'CI/CD'] },
    { category: t('skills.categories.frontend'), skills: ['Angular 18', 'Vue.js', 'React Native', 'HTML5/CSS3', 'Tailwind', 'Bootstrap', 'Material UI', 'Vite', 'Jest'] },
    { category: t('skills.categories.backend'), skills: ['.NET 8 (C#)', 'Python/Django', 'Ruby', 'GraphQL', 'gRPC', 'REST APIs'] },
    { category: t('skills.categories.databases'), skills: ['PostgreSQL', 'SQL Server', 'MongoDB', 'Firebase'] },
    { category: t('skills.categories.cloudDevops'), skills: ['AWS (ECS, RDS, S3, CloudFront, IAM)', 'Docker', 'NGINX', 'Terraform', 'GitHub Actions', 'GitLab CI'] },
    { category: t('skills.categories.architecture'), skills: ['Microservices', 'Monorepos', 'Hexagonal', 'SOLID', 'REST APIs', 'MVC'] },
    { category: t('skills.categories.toolsAi'), skills: ['GitHub', 'Git', 'Postman', 'Swagger', 'Figma', 'Copilot', 'Cursor', 'Windsurf'] },
    { category: t('skills.categories.softSkills'), skills: ['Problem Solving', 'Code Review', 'Leadership', 'Technical Documentation', 'Teamwork', 'Agile (Scrum)'] },
  ];

  const education = {
    degree: t('education.degree'),
    institution: t('education.institution'),
    period: t('education.period'),
    languages: [
      { language: t('education.languagesList.spanish'), level: t('education.languagesList.native') },
      { language: t('education.languagesList.english'), level: t('education.languagesList.intermediate') },
    ],
    certifications: ['Node.js', 'React', 'MongoDB', `${t('education.aws')}`],
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
      <HeaderNav />
      <Hero {...personalInfo} />
      <Experience jobs={jobs} />
      <Projects projects={projects} />
      <Skills skillCategories={skillCategories} />
      <Education {...education} />
      <Footer {...personalInfo} />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
