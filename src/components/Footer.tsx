import { Mail, Phone, Github, Linkedin } from 'lucide-react';

interface FooterProps {
  name: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
}

export function Footer({ name, email, phone, github, linkedin }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Let's Connect</h2>
          <p className="text-slate-400 mb-6">
            Feel free to reach out for collaborations or just a friendly chat
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-2 text-slate-300 hover:text-blue-400 transition-colors"
          >
            <Mail size={20} />
            <span>{email}</span>
          </a>
          <a
            href={`tel:${phone}`}
            className="flex items-center gap-2 text-slate-300 hover:text-blue-400 transition-colors"
          >
            <Phone size={20} />
            <span>{phone}</span>
          </a>
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-slate-300 hover:text-blue-400 transition-colors"
          >
            <Github size={20} />
            <span>GitHub</span>
          </a>
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-slate-300 hover:text-blue-400 transition-colors"
          >
            <Linkedin size={20} />
            <span>LinkedIn</span>
          </a>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
          <p>&copy; {new Date().getFullYear()} {name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
