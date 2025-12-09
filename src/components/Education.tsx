import { GraduationCap, Languages } from 'lucide-react';

interface EducationProps {
  degree: string;
  institution: string;
  period: string;
  languages: { language: string; level: string }[];
  certifications: string[];
}

export function Education({ degree, institution, period, languages, certifications }: EducationProps) {
  return (
    <section className="py-20 bg-slate-50 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <GraduationCap className="text-blue-600" size={32} />
              <h2 className="text-3xl font-bold text-slate-900">Education</h2>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200 mb-8">
              <h3 className="text-xl font-bold text-slate-900 mb-2">{degree}</h3>
              <p className="text-blue-600 font-semibold mb-1">{institution}</p>
              <p className="text-slate-600">{period}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Certifications</h3>
              <ul className="space-y-2">
                {certifications.map((cert, index) => (
                  <li key={index} className="flex gap-2 text-slate-700">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-6">
              <Languages className="text-blue-600" size={32} />
              <h2 className="text-3xl font-bold text-slate-900">Languages</h2>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200">
              {languages.map((lang, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-semibold text-slate-900">{lang.language}</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {lang.level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
