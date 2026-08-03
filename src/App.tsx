import { Hero } from './components/Hero';
import { About } from './components/About';
import { Experience } from './components/Experience';
import { AllExperience } from './components/AllExperience';
import { ExperienceDetail } from './components/ExperienceDetail';
import { Projects } from './components/Projects';
import { AllProjects } from './components/AllProjects';
import { ProjectDetail } from './components/ProjectDetail';
import { Blog } from './components/Blog';
import { AllBlog } from './components/AllBlog';
import { BlogPost } from './components/BlogPost';
import { Skills } from './components/Skills';
import { Education } from './components/Education';
// import { Services } from './components/Services';
import { Testimonials } from './components/Testimonials';
import { TestimonialsAdmin } from './components/TestimonialsAdmin';
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

  type JobKey = (typeof jobKeys)[number];

  const projectKeys = ['marfil', 'hemisferio', 'calquen', 'iocupacional', 'ownorbit', 'virtualwallet', 'stockhex'] as const;

  type ProjectKey = (typeof projectKeys)[number];

  const jobTechnologies: Record<JobKey, string[]> = {
    higherbit: ['Python', 'Django', 'PostgreSQL', 'React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Docker', 'AWS', 'Terraform'],
    prodoctivity: ['React', 'TypeScript', 'Node.js', 'Docker', 'MongoDB'],
    imarket: ['Angular', 'TypeScript', '.NET 8', 'C#', 'Docker', 'PostgreSQL'],
    freelancer: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue.js', 'Node.js', '.NET', 'MongoDB', 'PostgreSQL'],
  };

  // Projects built during each job, shown on the job's detail screen
  const jobProjects: Partial<Record<JobKey, ProjectKey[]>> = {
    higherbit: ['marfil', 'hemisferio', 'calquen', 'iocupacional'],
  };

  // Taken from each period below; kept numeric so the About timeline can sort
  const jobStartYears: Record<JobKey, number> = {
    freelancer: 2020,
    prodoctivity: 2023,
    imarket: 2024,
    higherbit: 2025,
  };

  // Screenshot folders under public/. Higher Bit's work is shown through its projects.
  const jobImageFolders: Partial<Record<JobKey, string>> = {
    prodoctivity: 'prodoctivity',
    imarket: 'imarket',
    freelancer: 'freelance',
  };

  const jobs = jobKeys.map((key) => ({
    id: key,
    title: t(`experience.jobs.${key}.title`),
    company: t(`experience.jobs.${key}.company`),
    period: t(`experience.jobs.${key}.period`),
    description: t(`experience.jobs.${key}.description`),
    tasks: t(`experience.jobs.${key}.tasks`, { returnObjects: true }) as string[],
    technologies: jobTechnologies[key],
    relatedProjectIds: jobProjects[key] ?? [],
    startYear: jobStartYears[key],
    images: jobImageFolders[key]
      ? `${import.meta.env.BASE_URL}${jobImageFolders[key]}/`
      : undefined,
  }));

  const projectTechnologies: Record<ProjectKey, string[]> = {
    marfil: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'REST APIs', 'Responsive Design'],
    hemisferio: ['Python', 'Django', 'PostgreSQL', 'REST APIs', 'AWS', 'Docker', 'CI/CD'],
    calquen: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Radix UI', 'NestJS', 'Prisma', 'PostgreSQL', 'JWT', 'Python', 'Selenium', 'Flask', 'AWS S3', 'AWS Secrets Manager', 'Docker', 'REST APIs'],
    iocupacional: ['React', 'Next.js', 'TypeScript', 'TanStack Query', 'React Hook Form', 'Zod', 'Tailwind CSS', 'Python', 'Django', 'Django REST Framework', 'PostgreSQL', 'AWS Cognito', 'Docker', 'REST APIs', 'GitHub Actions', 'Railway'],
    ownorbit: ['Node.js', 'TypeScript', 'Express.js', 'Docker', 'NGINX', 'React', 'React Native', 'Expo', 'Tailwind CSS', 'Jest'],
    virtualwallet: ['Node.js', 'TypeScript', 'Express.js', 'MongoDB', 'React', 'Docker', 'Microservices', 'REST APIs', 'JWT', 'Postman'],
    stockhex: ['.NET 8', 'C#', 'SQL Server', 'JWT', 'Swagger', 'Docker'],
  };

  const projectLinks: Partial<Record<ProjectKey, string>> = {
    ownorbit: 'https://preview--renta-pulse.lovable.app/',
    virtualwallet: 'https://github.com/waka-code/wallet',
    stockhex: 'https://github.com/waka-code/StockHex',
  };

  const projectsWithImages: ProjectKey[] = ['marfil', 'hemisferio', 'calquen', 'iocupacional'];

  // Projects with no entry here are personal projects, not company assignments
  const projectCompanies: Partial<Record<ProjectKey, string>> = {
    marfil: 'Higher Bit Solutions',
    hemisferio: 'Higher Bit Solutions',
    calquen: 'Higher Bit Solutions',
    iocupacional: 'Higher Bit Solutions',
  };

  const projects = projectKeys.map((key) => ({
    id: key,
    company: projectCompanies[key],
    name: t(`projects.items.${key}.name`),
    date: t(`projects.items.${key}.date`),
    description: t(`projects.items.${key}.description`),
    tasks: key !== 'stockhex' ? (t(`projects.items.${key}.tasks`, { returnObjects: true }) as string[]) : undefined,
    technologies: projectTechnologies[key],
    link: projectLinks[key],
    images: projectsWithImages.includes(key) ? `${import.meta.env.BASE_URL}${key}/` : undefined,
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
    certificateImages: [
      { name: 'Node.js', image: `${import.meta.env.BASE_URL}certificado/node.jpg` },
      { name: 'MongoDB', image: `${import.meta.env.BASE_URL}certificado/mongo.jpg` },
      { name: 'React', image: `${import.meta.env.BASE_URL}certificado/react.png` },
    ],
    aiCertifications: [
      'Claude Code in Action',
      'Introduction to Model Context Protocol',
      'Claude with the Anthropic API',
      'Introduction to Agent Skills',
    ],
    aiCertificateImages: [
      { name: 'Claude Code in Action', image: `${import.meta.env.BASE_URL}certificado/claude-code-in-action.png` },
      { name: 'Introduction to Model Context Protocol', image: `${import.meta.env.BASE_URL}certificado/introduction-to-model-context-protocol.png` },
      { name: 'Claude with the Anthropic API', image: `${import.meta.env.BASE_URL}certificado/claude-with-the-anthropic-api.png` },
      { name: 'Introduction to Agent Skills', image: `${import.meta.env.BASE_URL}certificado/introduction-to-agent-skills.png` },
    ],
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
      <HeaderNav />
      <Hero {...personalInfo} />
      {/* <Services /> */}
      <Projects projects={projects} />
      <Experience jobs={jobs} />
      <Skills skillCategories={skillCategories} />
      <Education {...education} />
      <Blog />
      <Testimonials />
      <Footer {...personalInfo} />
      <BlogPost />
      <AllProjects projects={projects} />
      <ProjectDetail projects={projects} />
      <AllExperience jobs={jobs} />
      <ExperienceDetail jobs={jobs} projects={projects} />
      <AllBlog />
      <About jobs={jobs} />
      <TestimonialsAdmin />
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
