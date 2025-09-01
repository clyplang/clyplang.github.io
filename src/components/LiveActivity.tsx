import React, { useState, useEffect } from 'react';

interface ActivityItem {
  id: string;
  type: 'release' | 'pr' | 'commit' | 'issue';
  title: string;
  description: string;
  url: string;
  date: string;
  author?: string;
}

interface LiveActivityProps {
  className?: string;
}

const LiveActivity: React.FC<LiveActivityProps> = ({ className = '' }) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    try {
      // Simple fetch without fancy features
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
      releases.slice(0, 3).forEach((release: any) => {
        newActivities.push({
          id: `release-${release.id}`,
          type: 'release',
          title: release.name || release.tag_name,
          description: `New release published`,
          url: release.html_url,
          date: release.published_at,
          author: release.author?.login
        });
      });

      // Process pull requests
      pullRequests.slice(0, 5).forEach((pr: any) => {
        newActivities.push({
          id: `pr-${pr.id}`,
          type: 'pr',
          title: pr.title,
          description: `Pull request ${pr.state}`,
          url: pr.html_url,
          date: pr.created_at,
          author: pr.user.login
        });
      });

      // Sort by date (newest first)
      newActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setActivities(newActivities.slice(0, 8));
      setError(null);
    } catch (err) {
      setError('Failed to load activity feed');
      console.error('Activity fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

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
    <div className={`live-activity ${className}`}>
      <div className="activity-header">
        <div className="header-content">
          <div>
            <h2>🔴 Live Activity</h2>
            <p>Real-time updates from the Clyp repository</p>
          </div>
        </div>
      </div>

      <div className="activity-content">
        {loading ? (
          <div className="skeleton-container">
            <div className="activity-loading">
              <div className="loading-spinner"></div>
              <p>Loading latest activity...</p>
            </div>
          </div>
        ) : error ? (
          <div className="activity-error">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
            <button className="retry-button" onClick={() => fetchActivities()}>
              Try Again
            </button>
          </div>
        ) : activities.length === 0 ? (
          <div className="activity-empty">
            <div className="empty-icon">📭</div>
            <p>No recent activity</p>
          </div>
        ) : (
          <div className="activity-timeline">
            {activities.map((activity, index) => (
              <div 
                key={activity.id}
                className={`activity-card activity-card--visible`}
                onClick={() => typeof window !== 'undefined' && window.open(activity.url, '_blank')}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`activity-icon`} data-type={activity.type}>
                  {activity.type === 'release' ? '🚀' : 
                   activity.type === 'pr' ? '🔄' : 
                   activity.type === 'commit' ? '📝' : '🐛'}
                </div>
                <div className="activity-content">
                  <h3 className="activity-title">{activity.title}</h3>
                  <p className="activity-description">{activity.description}</p>
                  <div className="activity-meta">
                    {activity.author && (
                      <div className="activity-author">
                        <span>👤 {activity.author}</span>
                      </div>
                    )}
                    <div className="activity-time">
                      {formatDate(activity.date)}
                    </div>
                  </div>
                </div>
                <div className="activity-hover-indicator">→</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveActivity;