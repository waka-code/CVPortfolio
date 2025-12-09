import { Wrench } from 'lucide-react';

interface SkillCategory {
  category: string;
  skills: string[];
}

interface SkillsProps {
  skillCategories: SkillCategory[];
}

export function Skills({ skillCategories }: SkillsProps) {
  return (
    <section className="py-20 bg-white px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <Wrench className="text-blue-600" size={32} />
          <h2 className="text-4xl font-bold text-slate-900">Technical Skills</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-blue-600">
                {category.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="px-4 py-2 bg-white text-slate-700 rounded-lg text-sm font-medium border border-slate-200 hover:border-blue-300 hover:text-blue-700 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
