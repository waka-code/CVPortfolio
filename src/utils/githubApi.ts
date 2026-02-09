const GITHUB_OWNER = 'waka-code';
const GITHUB_REPO = 'CVPortfolio';
const GITHUB_BRANCH = 'main';

interface GitHubCommitResult {
  success: boolean;
  message: string;
  url?: string;
}

function getToken(): string | null {
  return localStorage.getItem('github_token');
}

export function setGitHubToken(token: string) {
  localStorage.setItem('github_token', token);
}

export function getGitHubToken(): string | null {
  return getToken();
}

export function clearGitHubToken() {
  localStorage.removeItem('github_token');
}

export async function commitBlogArticle(
  filename: string,
  content: string,
  locale: string,
  commitMessage?: string
): Promise<GitHubCommitResult> {
  const token = getToken();
  if (!token) {
    return { success: false, message: 'No GitHub token configured.' };
  }

  const path = `src/blog/${locale}/${filename}`;
  const message = commitMessage || `Add blog article: ${filename}`;

  try {
    // Check if file already exists (to get its SHA for updates)
    let existingSha: string | undefined;
    try {
      const checkRes = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );
      if (checkRes.ok) {
        const data = await checkRes.json();
        existingSha = data.sha;
      }
    } catch {
      // File doesn't exist, that's fine
    }

    // Create or update the file
    const body: Record<string, string> = {
      message,
      content: btoa(unescape(encodeURIComponent(content))),
      branch: GITHUB_BRANCH,
    };

    if (existingSha) {
      body.sha = existingSha;
    }

    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      return {
        success: false,
        message: error.message || `GitHub API error: ${res.status}`,
      };
    }

    const data = await res.json();
    return {
      success: true,
      message: existingSha ? 'Article updated successfully.' : 'Article created successfully.',
      url: data.content?.html_url,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred.',
    };
  }
}

export async function fetchBlogArticles(locale: string): Promise<{ name: string; content: string }[]> {
  const token = getToken();
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/src/blog/${locale}?ref=${GITHUB_BRANCH}`,
      { headers }
    );

    if (!res.ok) return [];

    const files: { name: string; download_url: string }[] = await res.json();
    const mdFiles = files.filter((f) => f.name.endsWith('.md'));

    const articles = await Promise.all(
      mdFiles.map(async (file) => {
        const contentRes = await fetch(file.download_url);
        const content = await contentRes.text();
        return { name: file.name, content };
      })
    );

    return articles;
  } catch {
    return [];
  }
}
