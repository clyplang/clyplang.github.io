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
        <h2>Live Activity</h2>
        <p>Real-time updates from the Clyp repository</p>
      </div>

      <div className="activity-content">
        {loading ? (
          <div className="loading">Loading latest activity...</div>
        ) : error ? (
          <div className="error">
            <p>{error}</p>
            <button onClick={() => fetchActivities()}>Try Again</button>
          </div>
        ) : activities.length === 0 ? (
          <div className="empty">No recent activity</div>
        ) : (
          <div className="activity-list">
            {activities.map((activity) => (
              <div 
                key={activity.id}
                className="activity-item"
                onClick={() => typeof window !== 'undefined' && window.open(activity.url, '_blank')}
              >
                <div className="activity-type">
                  {activity.type === 'release' ? '🚀' : '🔄'}
                </div>
                <div className="activity-details">
                  <h3>{activity.title}</h3>
                  <p>{activity.description}</p>
                  <div className="activity-meta">
                    {activity.author && <span>by {activity.author}</span>}
                    <span>{formatDate(activity.date)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveActivity;