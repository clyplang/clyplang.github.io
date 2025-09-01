import React, { useState, useEffect, useRef } from 'react';

interface Release {
  id: number;
  name: string;
  tag_name: string;
  html_url: string;
  published_at: string;
  author?: {
    login: string;
    avatar_url: string;
  };
}

interface PullRequest {
  id: number;
  title: string;
  html_url: string;
  created_at: string;
  user: {
    login: string;
    avatar_url: string;
  };
  state: string;
}

interface StatCardProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  className?: string;
  refreshAction?: () => void;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  icon, 
  children, 
  className = '', 
  refreshAction,
  loading = false 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`stat-card ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="stat-header">
        <h3 className="stat-title">
          <span className="stat-icon">{icon}</span>
          {title}
        </h3>
        {refreshAction && (
          <button 
            className={`stat-refresh ${loading ? 'loading' : ''}`}
            onClick={refreshAction}
            disabled={loading}
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              className={loading ? 'spinning' : ''}
            >
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-8 3.58-8 8s3.58 8 8 8c3.74 0 6.85-2.56 7.72-6h-2.08c-.82 2.33-3.04 4-5.64 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
          </button>
        )}
      </div>
      <div className="stat-content">
        {children}
      </div>
    </div>
  );
};

const PulseLoadingDot = ({ delay = 0 }: { delay?: number }) => (
  <div 
    className="pulse-dot"
    style={{ animationDelay: `${delay}ms` }}
  />
);

const LoadingState = () => (
  <div className="stat-loading">
    <div className="loading-dots">
      <PulseLoadingDot delay={0} />
      <PulseLoadingDot delay={150} />
      <PulseLoadingDot delay={300} />
    </div>
    <span>Loading...</span>
  </div>
);

const ReleaseItem = ({ release, index }: { release: Release; index: number }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div 
      className={`release-item ${isVisible ? 'release-item--visible' : ''}`}
      onClick={() => typeof window !== 'undefined' && window.open(release.html_url, '_blank')}
    >
      <div className="release-content">
        <h4 className="release-name">
          {release.name || release.tag_name}
        </h4>
        <div className="release-meta">
          {release.author && (
            <div className="release-author">
              <img 
                src={release.author.avatar_url} 
                alt={release.author.login}
                className="author-avatar"
              />
              <span>{release.author.login}</span>
            </div>
          )}
          <span className="release-date">{formatDate(release.published_at)}</span>
        </div>
      </div>
      <div className="release-indicator">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.33 24l-2.83-2.829 9.339-9.175-9.339-9.167 2.83-2.829 12.17 11.996z"/>
        </svg>
      </div>
    </div>
  );
};

const PullRequestItem = ({ pr, index }: { pr: PullRequest; index: number }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 80);
    return () => clearTimeout(timer);
  }, [index]);

  const getRelativeTime = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return `${Math.floor(diffDays / 7)}w ago`;
  };

  return (
    <div 
      className={`pr-item ${isVisible ? 'pr-item--visible' : ''}`}
      onClick={() => typeof window !== 'undefined' && window.open(pr.html_url, '_blank')}
    >
      <div className="pr-content">
        <h4 className="pr-title">{pr.title}</h4>
        <div className="pr-meta">
          <div className="pr-author">
            <img 
              src={pr.user.avatar_url} 
              alt={pr.user.login}
              className="author-avatar"
            />
            <span>{pr.user.login}</span>
          </div>
          <span className="pr-time">{getRelativeTime(pr.created_at)}</span>
        </div>
      </div>
      <div className={`pr-status pr-status--${pr.state}`}>
        {pr.state === 'open' ? '🟢' : '🟣'}
      </div>
    </div>
  );
};

const AnimatedCounter = ({ 
  value, 
  label, 
  delay = 0 
}: { 
  value: number; 
  label: string; 
  delay?: number; 
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 1500;
    const steps = 30;
    const stepValue = value / steps;
    const stepDelay = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setDisplayValue(Math.min(Math.floor(stepValue * currentStep), value));
      
      if (currentStep >= steps) {
        setDisplayValue(value);
        clearInterval(interval);
      }
    }, stepDelay);

    return () => clearInterval(interval);
  }, [isVisible, value]);

  return (
    <div className="animated-counter">
      <div className="counter-value">{displayValue}</div>
      <div className="counter-label">{label}</div>
    </div>
  );
};

const StatsPanel: React.FC = () => {
  const [releases, setReleases] = useState<Release[]>([]);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [releasesLoading, setReleasesLoading] = useState(true);
  const [prsLoading, setPrsLoading] = useState(true);
  const [repoStats] = useState({
    language: 'Python',
    license: 'MIT',
    created: '2024'
  });

  const fetchReleases = async () => {
    setReleasesLoading(true);
    try {
      const response = await fetch('https://api.github.com/repos/clyplang/clyp/releases');
      if (response.ok) {
        const data = await response.json();
        setReleases(data.slice(0, 5));
      }
    } catch (error) {
      console.error('Failed to fetch releases:', error);
    } finally {
      setReleasesLoading(false);
    }
  };

  const fetchPullRequests = async () => {
    setPrsLoading(true);
    try {
      const response = await fetch('https://api.github.com/repos/clyplang/clyp/pulls');
      if (response.ok) {
        const data = await response.json();
        setPullRequests(data.slice(0, 5));
      }
    } catch (error) {
      console.error('Failed to fetch pull requests:', error);
    } finally {
      setPrsLoading(false);
    }
  };

  useEffect(() => {
    fetchReleases();
    fetchPullRequests();
  }, []);

  return (
    <div className="stats-panel">
      <StatCard 
        title="Recent Releases" 
        icon="🚀" 
        refreshAction={fetchReleases}
        loading={releasesLoading}
        className="releases-card"
      >
        {releasesLoading ? (
          <LoadingState />
        ) : releases.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <div className="empty-text">No releases found</div>
          </div>
        ) : (
          <div className="releases-list">
            {releases.map((release, index) => (
              <ReleaseItem 
                key={release.id} 
                release={release} 
                index={index}
              />
            ))}
          </div>
        )}
      </StatCard>

      <StatCard 
        title="Pull Requests" 
        icon="🔄" 
        className="prs-card"
      >
        <div className="prs-header">
          <AnimatedCounter 
            value={pullRequests.length} 
            label="Open PRs"
            delay={200}
          />
        </div>
        {prsLoading ? (
          <LoadingState />
        ) : pullRequests.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✅</div>
            <div className="empty-text">No open pull requests</div>
          </div>
        ) : (
          <div className="prs-list">
            {pullRequests.map((pr, index) => (
              <PullRequestItem 
                key={pr.id} 
                pr={pr} 
                index={index}
              />
            ))}
          </div>
        )}
      </StatCard>

      <StatCard 
        title="Repository Stats" 
        icon="📊"
        className="repo-stats-card"
      >
        <div className="repo-stats">
          <div className="repo-stat">
            <span className="stat-label">Language</span>
            <span className="stat-value">{repoStats.language}</span>
          </div>
          <div className="repo-stat">
            <span className="stat-label">License</span>
            <span className="stat-value">{repoStats.license}</span>
          </div>
          <div className="repo-stat">
            <span className="stat-label">Created</span>
            <span className="stat-value">{repoStats.created}</span>
          </div>
        </div>
      </StatCard>
    </div>
  );
};

export default StatsPanel;