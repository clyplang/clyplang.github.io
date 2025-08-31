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
    try {
      const response = await fetch('/api/live_stats');
      if (response.ok) {
        const data = await response.json();
        setStats({
          pypi_downloads: data.pypi_downloads || 'N/A',
          github_stars: data.github_stars || 'N/A',
          github_commits: data.github_commits || 'N/A'
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