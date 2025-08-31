import type { APIRoute } from 'astro';

interface StatsData {
  pypi_downloads: string | number;
  github_downloads: string | number;
  github_stars: string | number;
  github_commits: string | number;
}

// Simple in-memory cache
let cachedStats: StatsData | null = null;
let cacheTimestamp = 0;
const CACHE_SECONDS = 60;

async function fetchLiveStats(): Promise<StatsData> {
  const now = Date.now();
  
  // Return cached data if still valid
  if (cachedStats && now - cacheTimestamp < CACHE_SECONDS * 1000) {
    return cachedStats;
  }

  const stats: StatsData = {
    pypi_downloads: 'N/A',
    github_downloads: 'N/A',
    github_stars: 'N/A',
    github_commits: 'N/A',
  };

  const pypiPackage = 'clyp';
  const githubUser = 'clyplang';
  const githubRepo = 'clyp';

  try {
    // PyPI downloads
    try {
      const pypistatsUrl = `https://pypistats.org/api/packages/${pypiPackage}/recent`;
      const pypistatsResp = await fetch(pypistatsUrl);
      if (pypistatsResp.ok) {
        const data = await pypistatsResp.json();
        stats.pypi_downloads = data?.data?.last_month || 'N/A';
      }
    } catch (e) {
      console.error('Failed to fetch PyPI stats:', e);
    }

    // GitHub stars
    try {
      const githubRepoUrl = `https://api.github.com/repos/${githubUser}/${githubRepo}`;
      const githubResp = await fetch(githubRepoUrl);
      if (githubResp.ok) {
        const data = await githubResp.json();
        stats.github_stars = data?.stargazers_count || 'N/A';
      }
    } catch (e) {
      console.error('Failed to fetch GitHub repo stats:', e);
    }

    // GitHub commits
    try {
      const commitsUrl = `https://api.github.com/repos/${githubUser}/${githubRepo}/commits?per_page=1`;
      const commitsResp = await fetch(commitsUrl);
      if (commitsResp.ok) {
        const linkHeader = commitsResp.headers.get('Link');
        if (linkHeader) {
          const match = linkHeader.match(/&page=(\d+)>; rel="last"/);
          if (match) {
            stats.github_commits = parseInt(match[1]);
          }
        }
      }
    } catch (e) {
      console.error('Failed to fetch GitHub commits:', e);
    }

    // GitHub release downloads
    try {
      const releasesUrl = `https://api.github.com/repos/${githubUser}/${githubRepo}/releases`;
      const releasesResp = await fetch(releasesUrl);
      if (releasesResp.ok) {
        const releases = await releasesResp.json();
        let total = 0;
        if (Array.isArray(releases)) {
          for (const rel of releases) {
            for (const asset of rel.assets || []) {
              total += asset.download_count || 0;
            }
          }
        }
        stats.github_downloads = total;
      }
    } catch (e) {
      console.error('Failed to fetch GitHub releases:', e);
    }

    // Format numbers with commas
    Object.keys(stats).forEach(key => {
      const value = stats[key as keyof StatsData];
      if (typeof value === 'number') {
        stats[key as keyof StatsData] = value.toLocaleString();
      }
    });

    // Update cache
    cachedStats = stats;
    cacheTimestamp = now;
    
  } catch (error) {
    console.error('Error fetching live stats:', error);
  }

  return stats;
}

export const GET: APIRoute = async () => {
  try {
    const stats = await fetchLiveStats();
    
    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60'
      }
    });
  } catch (error) {
    console.error('API error:', error);
    
    return new Response(JSON.stringify({
      pypi_downloads: 'N/A',
      github_downloads: 'N/A', 
      github_stars: 'N/A',
      github_commits: 'N/A'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};