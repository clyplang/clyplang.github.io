import React, { useState, useEffect } from 'react';

interface LiveStatsData {
  pypi_downloads: string | number;
  github_stars: string | number;
  github_commits: string | number;
}

const LiveStats: React.FC = () => {
  const [stats, setStats] = useState<LiveStatsData>({
    pypi_downloads: '...',
    github_stars: '...',
    github_commits: '...'
  });

  const updateLiveStats = async () => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    try {
      // Fetch directly from GitHub API (client-side)
      const githubResponse = await fetch('https://api.github.com/repos/clyplang/clyp');
      
      if (githubResponse.ok) {
        const githubData = await githubResponse.json();
        setStats({
          pypi_downloads: 'N/A', // PyPI stats not available client-side due to CORS
          github_stars: githubData.stargazers_count || 'N/A',
          github_commits: 'N/A' // Commits count requires additional API call with pagination
        });
      } else {
        setStats({
          pypi_downloads: 'N/A',
          github_stars: 'N/A',
          github_commits: 'N/A'
        });
      }
    } catch (error) {
      console.error('Failed to fetch live stats:', error);
      setStats({
        pypi_downloads: 'N/A',
        github_stars: 'N/A',
        github_commits: 'N/A'
      });
    }
  };

  useEffect(() => {
    // Update on load and every 60 seconds
    updateLiveStats();
    const interval = setInterval(updateLiveStats, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="live-stats-section">
      <div className="live-stats-container">
        <div className="live-stats-grid">
          <div className="live-stat" id="pypi-downloads">
            <div className="stat-label">PyPI Downloads</div>
            <div className="stat-value">{stats.pypi_downloads}</div>
          </div>
          <div className="live-stat" id="github-stars">
            <div className="stat-label">GitHub Stars</div>
            <div className="stat-value">{stats.github_stars}</div>
          </div>
          <div className="live-stat" id="github-commits">
            <div className="stat-label">GitHub Commits</div>
            <div className="stat-value">{stats.github_commits}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveStats;