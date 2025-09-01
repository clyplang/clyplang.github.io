import React, { useState, useEffect } from 'react';

interface Release {
  id: number;
  name: string;
  tag_name: string;
  html_url: string;
  published_at: string;
  author?: {
    login: string;
  };
}

interface PullRequest {
  id: number;
  title: string;
  html_url: string;
  created_at: string;
  user: {
    login: string;
  };
  state: string;
}

const StatsPanel: React.FC = () => {
  const [releases, setReleases] = useState<Release[]>([]);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [releasesRes, prsRes] = await Promise.all([
        fetch('https://api.github.com/repos/clyplang/clyp/releases'),
        fetch('https://api.github.com/repos/clyplang/clyp/pulls')
      ]);

      if (releasesRes.ok) {
        const releasesData = await releasesRes.json();
        setReleases(releasesData.slice(0, 3));
      }

      if (prsRes.ok) {
        const prsData = await prsRes.json();
        setPullRequests(prsData.slice(0, 3));
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="stats-panel">
      <div className="stat-card">
        <div className="stat-header">
          <h3>🚀 Recent Releases</h3>
          <div className="stat-indicator">
            {releases.length}
          </div>
        </div>
        <div className="stat-content">
          {loading ? (
            <div className="stat-loading">
              <div className="loading-skeleton"></div>
              <div className="loading-skeleton"></div>
              <div className="loading-skeleton"></div>
            </div>
          ) : releases.length === 0 ? (
            <div className="stat-empty">
              <div className="empty-icon">📦</div>
              <p>No releases found</p>
            </div>
          ) : (
            <div className="stat-list">
              {releases.map((release) => (
                <div 
                  key={release.id}
                  className="stat-item"
                  onClick={() => typeof window !== 'undefined' && window.open(release.html_url, '_blank')}
                >
                  <div className="stat-item-content">
                    <div className="stat-item-title">{release.name || release.tag_name}</div>
                    <div className="stat-item-meta">
                      {release.author && <span>by {release.author.login}</span>}
                      <span>{formatDate(release.published_at)}</span>
                    </div>
                  </div>
                  <div className="stat-item-arrow">→</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <h3>🔄 Pull Requests</h3>
          <div className="stat-indicator">
            {pullRequests.length}
          </div>
        </div>
        <div className="stat-content">
          {loading ? (
            <div className="stat-loading">
              <div className="loading-skeleton"></div>
              <div className="loading-skeleton"></div>
              <div className="loading-skeleton"></div>
            </div>
          ) : pullRequests.length === 0 ? (
            <div className="stat-empty">
              <div className="empty-icon">🔧</div>
              <p>No open pull requests</p>
            </div>
          ) : (
            <div className="stat-list">
              {pullRequests.map((pr) => (
                <div 
                  key={pr.id}
                  className="stat-item"
                  onClick={() => typeof window !== 'undefined' && window.open(pr.html_url, '_blank')}
                >
                  <div className="stat-item-content">
                    <div className="stat-item-title">{pr.title}</div>
                    <div className="stat-item-meta">
                      <span>by {pr.user.login}</span>
                      <span className={`pr-status ${pr.state}`}>{pr.state}</span>
                    </div>
                  </div>
                  <div className="stat-item-arrow">→</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <h3>📊 Repository Stats</h3>
        </div>
        <div className="stat-content">
          <div className="stat-grid">
            <div className="stat-metric">
              <div className="stat-metric-label">Language</div>
              <div className="stat-metric-value">Python</div>
            </div>
            <div className="stat-metric">
              <div className="stat-metric-label">License</div>
              <div className="stat-metric-value">MIT</div>
            </div>
            <div className="stat-metric">
              <div className="stat-metric-label">Created</div>
              <div className="stat-metric-value">2024</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;