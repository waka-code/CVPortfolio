import type { Job } from '../components/ExperienceCard';
import { slugify } from './slugify';

export interface JobFilterOption {
  value: string;
  label: string;
}

function uniqueOptions(values: string[]): JobFilterOption[] {
  const seen = new Map<string, string>();
  values.forEach((value) => seen.set(slugify(value), value));
  return Array.from(seen, ([value, label]) => ({ value, label }));
}

export function buildCompanyOptions(jobs: Job[]) {
  return uniqueOptions(jobs.map((job) => job.company));
}

export function buildRoleOptions(jobs: Job[]) {
  return uniqueOptions(jobs.map((job) => job.title));
}

export function filterJobs(jobs: Job[], company: string, role: string) {
  return jobs.filter(
    (job) =>
      (!company || slugify(job.company) === company) &&
      (!role || slugify(job.title) === role)
  );
}
