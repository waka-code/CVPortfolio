import { Github, Linkedin, Mail, Phone } from 'lucide-react';

interface HeroProps {
  name: string;
  title: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  summary: string;
}

export function Hero({ name, title, email, phone, github, linkedin, summary }: HeroProps) {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
          {name}
        </h1>
        <p className="text-2xl md:text-3xl text-slate-300 mb-6">{title}</p>
        <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          {summary}
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Mail size={20} />
            <span>Email</span>
          </a>
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            <Github size={20} />
            <span>GitHub</span>
          </a>
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            <Linkedin size={20} />
            <span>LinkedIn</span>
          </a>
          <a
            href={`tel:${phone}`}
            className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            <Phone size={20} />
            <span>Call</span>
          </a>
        </div>
      </div>
    </section>
  );
}
