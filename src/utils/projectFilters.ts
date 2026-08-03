import type { Project } from '../components/ProjectCard';
import { slugify } from './slugify';

export interface ProjectFilterOption {
  value: string;
  label: string;
}

/**
 * Each company becomes a single option; projects that were not assigned by a
 * company are offered individually by their own name.
 */
export function buildFilterOptions(projects: Project[]): ProjectFilterOption[] {
  const companies = new Map<string, string>();
  const standalone: ProjectFilterOption[] = [];

  projects.forEach((project) => {
    if (project.company) {
      companies.set(slugify(project.company), project.company);
    } else {
      standalone.push({ value: project.id, label: project.name });
    }
  });

  return [
    ...Array.from(companies, ([value, label]) => ({ value, label })),
    ...standalone,
  ];
}

export function filterProjects(projects: Project[], filter: string) {
  if (!filter) return projects;

  return projects.filter((project) =>
    project.company ? slugify(project.company) === filter : project.id === filter
  );
}
