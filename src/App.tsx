import { Hero } from './components/Hero';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Education } from './components/Education';
import { Footer } from './components/Footer';

function App() {
  const personalInfo = {
    name: 'Waddimi Saint-Louis',
    title: 'System Engineer | Full Stack Developer',
    email: 'shenryvladimil@gmail.com',
    phone: '1-829-504-1112',
    github: 'https://github.com/waddimi',
    linkedin: 'https://linkedin.com/in/waddimi',
    summary:
      'Systems Engineer with 4+ years of experience in fullstack development. Currently at ProDoctivity, delivering scalable solutions across frontend and backend while mentoring junior developers. Skilled in building robust APIs, responsive interfaces, and driving team growth through technical leadership and innovation.',
  };

  const jobs = [
    {
      title: 'Fullstack Developer & Technical Lead',
      company: 'Higher Bit Solutions',
      period: 'Sept 2025 - Current',
      description:
        'Higher Bit Solutions is a startup delivering custom tech, AI, and automation solutions. As a Full-Stack Engineer and Technical Lead, I build end-to-end systems, lead technical decisions, mentor developers, and ensure scalable, secure, high-performance solutions.',
      tasks: [
        'Led technical roadmap, PR reviews, and mentoring for junior devs',
        'Designed end-to-end architectures using Django, Node.js, React, Postgres, and AWS',
        'Built scalable APIs with pagination, transactions, validations, and test coverage',
        'Developed complex dashboards and admin interfaces (React/Next.js)',
        'Managed AWS infrastructure: ECS/ECR, RDS, S3, CloudFront, Cognito, VPC, IAM',
        'Implemented CI/CD pipelines, monitoring, and automated deployments',
        'Collaborated with stakeholders to define requirements and ensure business alignment',
      ],
      technologies: [
        'Python',
        'Django',
        'PostgreSQL',
        'React',
        'Next.js',
        'TypeScript',
        'Tailwind CSS',
        'Docker',
        'AWS',
        'Terraform',
      ],
    },
    {
      title: 'Fullstack Developer',
      company: 'ProDoctivity SRL',
      period: 'April 2023 - Current',
      description:
        'ProDoctivity Cloud is a comprehensive business management solution that transforms traditional operations through process digitization and automation. The platform optimizes document workflows, significantly improving organizational efficiency.',
      tasks: [
        'Develop full stack applications using React, TypeScript, Node, Docker and MongoDB',
        'Design and build Micro-services to support business processes and integration with ERP',
        'Provide assistance to colleagues in case of doubts or queries',
        'Supervise and guide interns joining the programming team, offering constant follow-up and technical advice',
      ],
      technologies: ['React', 'TypeScript', 'Node.js', 'Docker', 'MongoDB'],
    },
    {
      title: 'Fullstack Developer - Freelancer',
      company: 'IMarket',
      period: 'Nov 2024 - May 2025',
      description:
        'Software platform designed to manage different administrative and accounting aspects of small and medium-sized companies.',
      tasks: [
        'Development of RESTful APIs for communication between client and server',
        'Implementation of business logic and validations',
        'Creation of models, migrations, and database queries',
        'Performance optimization in critical operations',
        'Creation of reusable components and responsive user interfaces',
      ],
      technologies: ['Angular', 'TypeScript', '.NET 8', 'C#', 'Docker', 'PostgreSQL'],
    },
    {
      title: 'Web Developer - Freelancer',
      company: 'Various Platforms',
      period: 'Nov 2020 - April 2023',
      description:
        'Freelance projects managed through various platforms such as Upwork, Workana, among others.',
      tasks: [
        'Transform designs and mockups into functional sites using HTML, CSS, JS/TS, and frameworks',
        'Develop front-end SPA and PWA modules with progressive technologies',
        'Integrate data between front-end and back-end using Node.js, .NET, C#, and databases',
        'Convert graphic designs into clean code with modern tools and frameworks',
        'Maintain and optimize websites, ensuring speed, accessibility and compatibility',
      ],
      technologies: [
        'HTML',
        'CSS',
        'JavaScript',
        'TypeScript',
        'React',
        'Angular',
        'Vue.js',
        'Node.js',
        '.NET',
        'MongoDB',
        'PostgreSQL',
      ],
    },
  ];

  const projects = [
    {
      name: 'OwnOrbit',
      date: 'May 2025',
      description:
        'Scalable property rental management platform developed with a microservices architecture (Node.js, TypeScript, gRPC, Docker), integrating a React/React Native frontend to deliver a modern, responsive experience for landlords, tenants, and administrators.',
      tasks: [
        'Designed and implemented the global architecture, applying SOLID and Clean Architecture',
        'Developed Node.js/TypeScript microservices, Dockerized environments, and CI/CD-ready setup',
        'Built responsive web and mobile interfaces with React, React Native, Expo, and Tailwind CSS',
        'Established code quality standards (ESLint, Jest, commitlint) and reusable shared packages',
      ],
      technologies: [
        'Node.js',
        'TypeScript',
        'Express.js',
        'Docker',
        'NGINX',
        'React',
        'React Native',
        'Expo',
        'Tailwind CSS',
        'Jest',
      ],
    },
    {
      name: 'StockHex',
      date: 'Oct 27, 2024',
      description:
        'Inventory application designed to efficiently and scalably manage a company\'s products and resources, providing detailed tracking of stock, movements and item updates in real time. Based on a hexagonal architecture, the system is organized in independent layers.',
      technologies: ['.NET 8', 'C#', 'SQL Server', 'JWT', 'Swagger', 'Docker'],
      link: 'https://github.com/waddimi/stockhex',
    },
  ];

  const skillCategories = [
    {
      category: 'Core Stack',
      skills: [
        'React.js + TypeScript',
        'Next.js',
        'Node.js + Express.js',
        'MongoDB',
        'PostgreSQL',
        'Docker',
        'CI/CD',
      ],
    },
    {
      category: 'Frontend',
      skills: [
        'Angular 18',
        'Vue.js',
        'React Native',
        'HTML5/CSS3',
        'Tailwind',
        'Bootstrap',
        'Material UI',
        'Vite',
        'Jest',
      ],
    },
    {
      category: 'Backend',
      skills: ['.NET 8 (C#)', 'Python/Django', 'Ruby', 'GraphQL', 'gRPC', 'REST APIs'],
    },
    {
      category: 'Databases',
      skills: ['PostgreSQL', 'SQL Server', 'MongoDB', 'Firebase'],
    },
    {
      category: 'Cloud & DevOps',
      skills: [
        'AWS (ECS, RDS, S3, CloudFront, IAM)',
        'Docker',
        'NGINX',
        'Terraform',
        'GitHub Actions',
        'GitLab CI',
      ],
    },
    {
      category: 'Architecture',
      skills: ['Microservices', 'Monorepos', 'Hexagonal', 'SOLID', 'REST APIs', 'MVC'],
    },
    {
      category: 'Tools & AI',
      skills: ['GitHub', 'Git', 'Postman', 'Swagger', 'Figma', 'Copilot', 'Cursor', 'Windsurf'],
    },
    {
      category: 'Soft Skills',
      skills: [
        'Problem Solving',
        'Code Review',
        'Leadership',
        'Technical Documentation',
        'Teamwork',
        'Agile (Scrum)',
      ],
    },
  ];

  const education = {
    degree: 'System Engineering',
    institution: 'Universidad Tecnológica de Santiago (UTESA)',
    period: '2017 - 2024',
    languages: [
      { language: 'Spanish', level: 'Native (C2)' },
      { language: 'English', level: 'Intermediate (B1)' },
    ],
    certifications: ['Node.js', 'React', 'MongoDB'],
  };

  return (
    <div className="min-h-screen">
      <Hero {...personalInfo} />
      <Experience jobs={jobs} />
      <Projects projects={projects} />
      <Skills skillCategories={skillCategories} />
      <Education {...education} />
      <Footer {...personalInfo} />
    </div>
  );
}

export default App;
