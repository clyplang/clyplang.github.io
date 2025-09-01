import React, { useState, useEffect, useRef } from 'react';

interface ActivityItem {
  id: string;
  type: 'release' | 'pr' | 'commit' | 'issue';
  title: string;
  description: string;
  url: string;
  date: string;
  author?: string;
  avatar?: string;
}

interface ActivityFilters {
  releases: boolean;
  pullRequests: boolean;
  commits: boolean;
  issues: boolean;
}

interface LiveActivityProps {
  className?: string;
}

const ActivityTypeIcon = ({ type }: { type: ActivityItem['type'] }) => {
  const icons = {
    release: '🚀',
    pr: '🔄',
    commit: '💻',
    issue: '🐛'
  };
  
  return (
    <div className="activity-icon" data-type={type}>
      {icons[type]}
    </div>
  );
};

const SkeletonLoader = () => (
  <div className="skeleton-container">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="skeleton-item">
        <div className="skeleton-icon"></div>
        <div className="skeleton-content">
          <div className="skeleton-line skeleton-title"></div>
          <div className="skeleton-line skeleton-description"></div>
          <div className="skeleton-line skeleton-meta"></div>
        </div>
      </div>
    ))}
  </div>
);

const ActivityCard = ({ item, index }: { item: ActivityItem; index: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 100);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [index]);

  const formatDate = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div 
            ref={cardRef}
      className={`activity-card ${isVisible ? 'activity-card--visible' : ''}`}
      onClick={() => typeof window !== 'undefined' && window.open(item.url, '_blank')}
    >
      <ActivityTypeIcon type={item.type} />
      <div className="activity-content">
        <h3 className="activity-title">{item.title}</h3>
        <p className="activity-description">{item.description}</p>
        <div className="activity-meta">
          {item.author && (
            <span className="activity-author">
              {item.avatar && <img src={item.avatar} alt={item.author} className="author-avatar" />}
              {item.author}
            </span>
          )}
          <span className="activity-time">{formatDate(item.date)}</span>
        </div>
      </div>
      <div className="activity-hover-indicator">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.33 24l-2.83-2.829 9.339-9.175-9.339-9.167 2.83-2.829 12.17 11.996z"/>
        </svg>
      </div>
    </div>
  );
};

const FilterButton = ({ 
  label, 
  active, 
  count, 
  onClick 
}: { 
  label: string; 
  active: boolean; 
  count: number; 
  onClick: () => void; 
}) => (
  <button 
    className={`filter-button ${active ? 'filter-button--active' : ''}`}
    onClick={onClick}
  >
    <span>{label}</span>
    <span className="filter-count">{count}</span>
  </button>
);

const LiveActivity: React.FC<LiveActivityProps> = ({ className = '' }) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ActivityFilters>({
    releases: true,
    pullRequests: true,
    commits: true,
    issues: true
  });
  const [refreshing, setRefreshing] = useState(false);
  const refreshIntervalRef = useRef<NodeJS.Timeout>();

  const fetchActivities = async (showRefreshState = false) => {
    try {
      if (showRefreshState) setRefreshing(true);
      
      // Fetch multiple types of activities
      const [releases, pullRequests] = await Promise.all([
        fetch('https://api.github.com/repos/clyplang/clyp/releases')
          .then(res => res.ok ? res.json() : [])
          .catch(() => []),
        fetch('https://api.github.com/repos/clyplang/clyp/pulls')
          .then(res => res.ok ? res.json() : [])
          .catch(() => [])
      ]);

      const newActivities: ActivityItem[] = [];

      // Process releases
      releases.slice(0, 5).forEach((release: any) => {
        newActivities.push({
          id: `release-${release.id}`,
          type: 'release',
          title: release.name || release.tag_name,
          description: `New release published`,
          url: release.html_url,
          date: release.published_at,
          author: release.author?.login,
          avatar: release.author?.avatar_url
        });
      });

      // Process pull requests
      pullRequests.slice(0, 8).forEach((pr: any) => {
        newActivities.push({
          id: `pr-${pr.id}`,
          type: 'pr',
          title: pr.title,
          description: `Pull request ${pr.state}`,
          url: pr.html_url,
          date: pr.created_at,
          author: pr.user.login,
          avatar: pr.user.avatar_url
        });
      });

      // Sort by date (newest first)
      newActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setActivities(newActivities.slice(0, 12));
      setError(null);
    } catch (err) {
      setError('Failed to load activity feed');
      console.error('Activity fetch error:', err);
    } finally {
      setLoading(false);
      if (showRefreshState) {
        setTimeout(() => setRefreshing(false), 500);
      }
    }
  };

  useEffect(() => {
    fetchActivities();
    
    // Auto-refresh every 2 minutes
    refreshIntervalRef.current = setInterval(() => {
      fetchActivities(true);
    }, 2 * 60 * 1000);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const filtered = activities.filter(activity => {
      switch (activity.type) {
        case 'release': return filters.releases;
        case 'pr': return filters.pullRequests;
        case 'commit': return filters.commits;
        case 'issue': return filters.issues;
        default: return true;
      }
    });
    setFilteredActivities(filtered);
  }, [activities, filters]);

  const toggleFilter = (filterType: keyof ActivityFilters) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: !prev[filterType]
    }));
  };

  const getFilterCounts = () => {
    return {
      releases: activities.filter(a => a.type === 'release').length,
      pullRequests: activities.filter(a => a.type === 'pr').length,
      commits: activities.filter(a => a.type === 'commit').length,
      issues: activities.filter(a => a.type === 'issue').length,
    };
  };

  const handleRefresh = () => {
    fetchActivities(true);
  };

  const counts = getFilterCounts();

  return (
    <div className={`live-activity ${className}`}>
      <div className="activity-header">
        <div className="header-content">
          <div className="header-icon-wrapper">
            <div className="header-icon">📈</div>
          </div>
          <div className="header-text">
            <h2>Live Activity</h2>
            <p>Real-time updates from the Clyp repository</p>
          </div>
          <div className="header-actions">
            <div className="live-indicator">
              <span className="live-dot"></span>
              <span>Live</span>
            </div>
            <button 
              className={`refresh-button ${refreshing ? 'refreshing' : ''}`}
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="currentColor"
                className={refreshing ? 'spinning' : ''}
              >
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-8 3.58-8 8s3.58 8 8 8c3.74 0 6.85-2.56 7.72-6h-2.08c-.82 2.33-3.04 4-5.64 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="activity-filters">
          <FilterButton
            label="Releases"
            active={filters.releases}
            count={counts.releases}
            onClick={() => toggleFilter('releases')}
          />
          <FilterButton
            label="Pull Requests"
            active={filters.pullRequests}
            count={counts.pullRequests}
            onClick={() => toggleFilter('pullRequests')}
          />
        </div>
      </div>

      <div className="activity-timeline">
        {loading ? (
          <SkeletonLoader />
        ) : error ? (
          <div className="activity-error">
            <div className="error-icon">⚠️</div>
            <div className="error-message">{error}</div>
            <button className="error-retry" onClick={() => fetchActivities()}>
              Try Again
            </button>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="activity-empty">
            <div className="empty-icon">📭</div>
            <div className="empty-message">No activities match your filters</div>
          </div>
        ) : (
          <div className="activity-list">
            {filteredActivities.map((activity, index) => (
              <ActivityCard 
                key={activity.id} 
                item={activity} 
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveActivity;