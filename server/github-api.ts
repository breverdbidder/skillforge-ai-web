import { ENV } from "./_core/env";

interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  author: {
    login: string;
    avatar_url: string;
  } | null;
  stats?: {
    total: number;
    additions: number;
    deletions: number;
  };
}

interface GitHubRepository {
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  updated_at: string;
  default_branch: string;
}

interface GitHubPullRequest {
  number: number;
  title: string;
  state: string;
  created_at: string;
  updated_at: string;
  user: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
}

/**
 * GitHub API Client
 * Uses GitHub Personal Access Token from settings
 */
export class GitHubAPIClient {
  private baseURL = "https://api.github.com";
  private token: string | null = null;

  constructor(token?: string) {
    this.token = token || null;
  }

  private async request<T>(endpoint: string): Promise<T> {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get commits for a repository
   */
  async getCommits(owner: string, repo: string, options?: {
    branch?: string;
    per_page?: number;
    since?: string;
  }): Promise<GitHubCommit[]> {
    const params = new URLSearchParams();
    if (options?.branch) params.append("sha", options.branch);
    if (options?.per_page) params.append("per_page", options.per_page.toString());
    if (options?.since) params.append("since", options.since);

    const query = params.toString() ? `?${params.toString()}` : "";
    return this.request<GitHubCommit[]>(`/repos/${owner}/${repo}/commits${query}`);
  }

  /**
   * Get repository information
   */
  async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    return this.request<GitHubRepository>(`/repos/${owner}/${repo}`);
  }

  /**
   * Get pull requests for a repository
   */
  async getPullRequests(owner: string, repo: string, state: "open" | "closed" | "all" = "open"): Promise<GitHubPullRequest[]> {
    return this.request<GitHubPullRequest[]>(`/repos/${owner}/${repo}/pulls?state=${state}&per_page=10`);
  }

  /**
   * Get repository statistics
   */
  async getRepositoryStats(owner: string, repo: string) {
    const repo_data = await this.getRepository(owner, repo);
    const commits = await this.getCommits(owner, repo, { per_page: 1 });
    
    return {
      name: repo_data.name,
      full_name: repo_data.full_name,
      description: repo_data.description,
      url: repo_data.html_url,
      stars: repo_data.stargazers_count,
      forks: repo_data.forks_count,
      open_issues: repo_data.open_issues_count,
      last_updated: repo_data.updated_at,
      default_branch: repo_data.default_branch,
      latest_commit: commits[0] || null,
    };
  }

  /**
   * Get commits across multiple repositories
   */
  async getCommitsFromRepos(repos: Array<{ owner: string; repo: string }>, limit: number = 20) {
    const allCommits: Array<{
      repository: string;
      sha: string;
      message: string;
      author: string | null;
      authorAvatar: string | null;
      date: string;
      url: string;
      additions?: number;
      deletions?: number;
    }> = [];

    for (const { owner, repo } of repos) {
      try {
        const commits = await this.getCommits(owner, repo, { per_page: 10 });
        
        for (const commit of commits) {
          allCommits.push({
            repository: `${owner}/${repo}`,
            sha: commit.sha,
            message: commit.commit.message,
            author: commit.author?.login || commit.commit.author.name,
            authorAvatar: commit.author?.avatar_url || null,
            date: commit.commit.author.date,
            url: `https://github.com/${owner}/${repo}/commit/${commit.sha}`,
            additions: commit.stats?.additions,
            deletions: commit.stats?.deletions,
          });
        }
      } catch (error) {
        console.error(`Failed to fetch commits for ${owner}/${repo}:`, error);
      }
    }

    // Sort by date descending and limit
    return allCommits
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }
}

/**
 * Get GitHub client with token from settings
 */
export async function getGitHubClient(token?: string): Promise<GitHubAPIClient> {
  // Try to get token from settings if not provided
  if (!token) {
    const { getSetting } = await import("./db-skills");
    const settingToken = await getSetting("github_token");
    token = settingToken || undefined;
  }
  
  return new GitHubAPIClient(token);
}
