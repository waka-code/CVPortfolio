import { Briefcase } from 'lucide-react';

interface Job {
  title: string;
  company: string;
  period: string;
  description: string;
  tasks: string[];
  technologies: string[];
}

interface ExperienceProps {
  jobs: Job[];
}

export function Experience({ jobs }: ExperienceProps) {
  return (
    <section className="py-20 bg-white px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <Briefcase className="text-blue-600" size={32} />
          <h2 className="text-4xl font-bold text-slate-900">Professional Experience</h2>
        </div>

        <div className="space-y-8">
          {jobs.map((job, index) => (
            <div
              key={index}
              className="bg-slate-50 rounded-xl p-8 hover:shadow-lg transition-shadow border border-slate-200"
            >
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{job.title}</h3>
                <p className="text-xl text-blue-600 font-semibold mb-1">{job.company}</p>
                <p className="text-slate-600">{job.period}</p>
              </div>

              <p className="text-slate-700 mb-4 leading-relaxed">{job.description}</p>

              <div className="mb-4">
                <h4 className="font-semibold text-slate-900 mb-2">Key Responsibilities:</h4>
                <ul className="space-y-2">
                  {job.tasks.map((task, taskIndex) => (
                    <li key={taskIndex} className="flex gap-2 text-slate-700">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Technologies:</h4>
                <div className="flex flex-wrap gap-2">
                  {job.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
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
