export const ADMIN_HASH = '#admin';

export const HOME_SECTION_HASH = '#home';
export const ABOUT_HASH = '#about';

export const PROJECTS_SECTION_HASH = '#projects';
export const ALL_PROJECTS_HASH = '#all-projects';
export const PROJECT_HASH_PREFIX = '#project/';

export const projectHash = (id: string) => `${PROJECT_HASH_PREFIX}${id}`;

export const COMPANY_PARAM = 'company';
export const PAGE_PARAM = 'page';

export const EXPERIENCE_SECTION_HASH = '#experience';
export const ALL_EXPERIENCE_HASH = '#all-experience';
export const JOB_HASH_PREFIX = '#job/';

export const jobHash = (id: string) => `${JOB_HASH_PREFIX}${id}`;

export const JOB_COMPANY_PARAM = 'jobCompany';
export const JOB_ROLE_PARAM = 'jobRole';
export const JOB_PAGE_PARAM = 'jobPage';

export const BLOG_SECTION_HASH = '#blog';
export const ALL_BLOG_HASH = '#all-blog';
export const BLOG_HASH_PREFIX = '#blog/';

export const blogHash = (slug: string) => `${BLOG_HASH_PREFIX}${slug}`;

export const BLOG_SEARCH_PARAM = 'blogSearch';
export const BLOG_TECH_PARAM = 'blogTech';
export const BLOG_BRANCH_PARAM = 'blogBranch';
export const BLOG_PAGE_PARAM = 'blogPage';
