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
        <h3>🚀 Recent Releases</h3>
        {loading ? (
          <div>Loading...</div>
        ) : releases.length === 0 ? (
          <div>No releases found</div>
        ) : (
          <div className="releases-list">
            {releases.map((release) => (
              <div 
                key={release.id}
                className="release-item"
                onClick={() => typeof window !== 'undefined' && window.open(release.html_url, '_blank')}
              >
                <div>{release.name || release.tag_name}</div>
                <div className="release-meta">
                  {release.author && <span>by {release.author.login}</span>}
                  <span>{formatDate(release.published_at)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="stat-card">
        <h3>🔄 Pull Requests</h3>
        {loading ? (
          <div>Loading...</div>
        ) : pullRequests.length === 0 ? (
          <div>No open pull requests</div>
        ) : (
          <div className="prs-list">
            {pullRequests.map((pr) => (
              <div 
                key={pr.id}
                className="pr-item"
                onClick={() => typeof window !== 'undefined' && window.open(pr.html_url, '_blank')}
              >
                <div>{pr.title}</div>
                <div className="pr-meta">
                  <span>by {pr.user.login}</span>
                  <span className={`pr-status ${pr.state}`}>{pr.state}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="stat-card">
        <h3>📊 Repository Stats</h3>
        <div className="repo-stats">
          <div className="repo-stat">
            <span>Language:</span>
            <span>Python</span>
          </div>
          <div className="repo-stat">
            <span>License:</span>
            <span>MIT</span>
          </div>
          <div className="repo-stat">
            <span>Created:</span>
            <span>2024</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;