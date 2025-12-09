import { Code2, ExternalLink } from 'lucide-react';

interface Project {
  name: string;
  date: string;
  description: string;
  tasks?: string[];
  technologies: string[];
  link?: string;
}

interface ProjectsProps {
  projects: Project[];
}

export function Projects({ projects }: ProjectsProps) {
  return (
    <section className="py-20 bg-slate-50 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <Code2 className="text-blue-600" size={32} />
          <h2 className="text-4xl font-bold text-slate-900">Personal Projects</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 hover:shadow-xl transition-all border border-slate-200 hover:border-blue-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">{project.name}</h3>
                  <p className="text-slate-600 text-sm">{project.date}</p>
                </div>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <ExternalLink size={24} />
                  </a>
                )}
              </div>

              <p className="text-slate-700 mb-4 leading-relaxed">{project.description}</p>

              {project.tasks && project.tasks.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-slate-900 mb-2">Key Features:</h4>
                  <ul className="space-y-2">
                    {project.tasks.map((task, taskIndex) => (
                      <li key={taskIndex} className="flex gap-2 text-slate-700 text-sm">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Tech Stack:</h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
