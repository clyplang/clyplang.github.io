import React, { useState, useEffect, useRef } from 'react';

// Interactive Code Editor Component
interface InteractiveCodeEditorProps {
  initialCode?: string;
  language?: string;
  onCodeChange?: (code: string) => void;
  showLineNumbers?: boolean;
  allowExecution?: boolean;
}

export const InteractiveCodeEditor: React.FC<InteractiveCodeEditorProps> = ({
  initialCode = '',
  language = 'clyp',
  onCodeChange,
  showLineNumbers = true,
  allowExecution = false
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    onCodeChange?.(newCode);
  };

  const executeCode = async () => {
    if (!allowExecution) return;
    
    setIsExecuting(true);
    // Simulate code execution
    setTimeout(() => {
      setOutput(`# Output from execution:\nCode compiled successfully!\n> ${code.split('\n')[0] || 'No code'}`);
      setIsExecuting(false);
    }, 1000);
  };

  return (
    <div className="interactive-code-editor">
      <div className="editor-header">
        <div className="editor-tabs">
          <div className="tab active">
            <span className="tab-icon">📝</span>
            main.{language}
          </div>
        </div>
        <div className="editor-actions">
          {allowExecution && (
            <button 
              className="action-btn primary"
              onClick={executeCode}
              disabled={isExecuting}
            >
              {isExecuting ? '⚡ Running...' : '▶️ Run'}
            </button>
          )}
          <button className="action-btn" onClick={() => navigator.clipboard.writeText(code)}>
            📋 Copy
          </button>
        </div>
      </div>
      
      <div className="editor-body">
        <div className="editor-panel">
          {showLineNumbers && (
            <div className="line-numbers">
              {code.split('\n').map((_, i) => (
                <div key={i} className="line-number">{i + 1}</div>
              ))}
            </div>
          )}
          <textarea
            ref={textareaRef}
            className="code-input"
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            placeholder="Write your Clyp code here..."
            spellCheck={false}
          />
        </div>
        
        {allowExecution && (
          <div className="output-panel">
            <div className="output-header">
              <span className="output-title">Output</span>
              <button className="clear-btn" onClick={() => setOutput('')}>Clear</button>
            </div>
            <pre className="output-content">{output || 'Run code to see output...'}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

// Command Palette Component
interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = [
    { id: 'home', name: 'Go to Home', icon: '🏠', action: () => window.location.href = '/' },
    { id: 'examples', name: 'View Examples', icon: '📚', action: () => window.location.href = '/examples' },
    { id: 'happening', name: 'What\'s Happening', icon: '📈', action: () => window.location.href = '/whats-happening' },
    { id: 'docs', name: 'Documentation', icon: '📖', action: () => window.open('https://clypdocs.codesft.dev', '_blank') },
    { id: 'github', name: 'GitHub Repository', icon: '🐙', action: () => window.open('https://github.com/clyplang/clyp', '_blank') },
    { id: 'install', name: 'Install Clyp', icon: '💾', action: () => navigator.clipboard.writeText('pip install clyp') },
    { id: 'copy-hello', name: 'Copy Hello World', icon: '👋', action: () => navigator.clipboard.writeText('str name = "World";\nprint("Hello, " + name + "!");') },
    { id: 'theme', name: 'Toggle Theme', icon: '🎨', action: () => document.body.classList.toggle('light-theme') },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(i => Math.min(i + 1, filteredCommands.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(i => Math.max(i - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
            onClose();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  if (!isOpen) return null;

  return (
    <div className="command-palette-overlay" onClick={onClose}>
      <div className="command-palette" onClick={e => e.stopPropagation()}>
        <div className="command-input-container">
          <span className="command-icon">⌘</span>
          <input
            ref={inputRef}
            className="command-input"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        
        <div className="command-list">
          {filteredCommands.length === 0 ? (
            <div className="no-commands">No commands found</div>
          ) : (
            filteredCommands.map((command, index) => (
              <div
                key={command.id}
                className={`command-item ${index === selectedIndex ? 'selected' : ''}`}
                onClick={() => {
                  command.action();
                  onClose();
                }}
              >
                <span className="command-item-icon">{command.icon}</span>
                <span className="command-item-name">{command.name}</span>
              </div>
            ))
          )}
        </div>
        
        <div className="command-footer">
          <div className="command-hint">
            <kbd>↑↓</kbd> navigate <kbd>Enter</kbd> select <kbd>Esc</kbd> close
          </div>
        </div>
      </div>
    </div>
  );
};

// Interactive Statistics Component
interface InteractiveStatsProps {
  stats: Array<{
    label: string;
    value: number;
    unit?: string;
    icon?: string;
    trend?: 'up' | 'down' | 'neutral';
    color?: string;
  }>;
}

export const InteractiveStats: React.FC<InteractiveStatsProps> = ({ stats }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [animatedValues, setAnimatedValues] = useState<number[]>(new Array(stats.length).fill(0));

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    stats.forEach((stat, index) => {
      const timer = setTimeout(() => {
        const interval = setInterval(() => {
          setAnimatedValues(prev => {
            const newValues = [...prev];
            if (newValues[index] < stat.value) {
              newValues[index] = Math.min(newValues[index] + Math.ceil(stat.value / 30), stat.value);
            }
            return newValues;
          });
        }, 50);
        
        setTimeout(() => clearInterval(interval), 2000);
      }, index * 200);
      
      timers.push(timer);
    });

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [stats]);

  return (
    <div className="interactive-stats">
      {stats.map((stat, index) => {
        const isHovered = hoveredIndex === index;
        const progress = (animatedValues[index] / stat.value) * 100;
        
        return (
          <div
            key={index}
            className={`stat-card ${isHovered ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{ '--accent-color': stat.color || 'var(--primary-color)' } as React.CSSProperties}
          >
            <div className="stat-header">
              {stat.icon && <span className="stat-icon">{stat.icon}</span>}
              <span className="stat-label">{stat.label}</span>
            </div>
            
            <div className="stat-value">
              <span className="stat-number">
                {animatedValues[index].toLocaleString()}
                {stat.unit && <span className="stat-unit">{stat.unit}</span>}
              </span>
              {stat.trend && (
                <span className={`stat-trend trend-${stat.trend}`}>
                  {stat.trend === 'up' ? '↗️' : stat.trend === 'down' ? '↘️' : '➡️'}
                </span>
              )}
            </div>
            
            <div className="stat-progress">
              <div 
                className="stat-progress-bar"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            {isHovered && (
              <div className="stat-details">
                <p>Real-time data • Updated just now</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Notification Center Component
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Release Available',
      message: 'Clyp v1.2.0 is now available with new features!',
      type: 'info',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      action: { label: 'View Release', onClick: () => window.open('https://github.com/clyplang/clyp/releases', '_blank') }
    },
    {
      id: '2',
      title: 'Documentation Updated',
      message: 'New examples and tutorials have been added.',
      type: 'success',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
    },
    {
      id: '3',
      title: 'Community Milestone',
      message: 'We\'ve reached 1000 GitHub stars! 🎉',
      type: 'success',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
    }
  ]);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (!isOpen) return null;

  return (
    <div className="notification-center-overlay" onClick={onClose}>
      <div className="notification-center" onClick={e => e.stopPropagation()}>
        <div className="notification-header">
          <h3>Notifications</h3>
          <div className="notification-actions">
            <button className="clear-all-btn" onClick={clearAll}>Clear All</button>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>
        </div>
        
        <div className="notification-list">
          {notifications.length === 0 ? (
            <div className="no-notifications">
              <span className="no-notifications-icon">🔔</span>
              <p>All caught up!</p>
            </div>
          ) : (
            notifications.map(notification => (
              <div key={notification.id} className={`notification-item type-${notification.type}`}>
                <div className="notification-content">
                  <h4>{notification.title}</h4>
                  <p>{notification.message}</p>
                  <span className="notification-time">{getTimeAgo(notification.timestamp)}</span>
                </div>
                
                <div className="notification-meta">
                  {notification.action && (
                    <button 
                      className="notification-action"
                      onClick={notification.action.onClick}
                    >
                      {notification.action.label}
                    </button>
                  )}
                  <button 
                    className="notification-dismiss"
                    onClick={() => removeNotification(notification.id)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Interactive Help System Component
interface InteractiveHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InteractiveHelp: React.FC<InteractiveHelpProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('quickstart');
  const [searchQuery, setSearchQuery] = useState('');

  const helpSections = {
    quickstart: {
      title: 'Quick Start',
      icon: '🚀',
      content: [
        { title: 'Installation', content: 'Run `pip install clyp` to install Clyp on your system.' },
        { title: 'First Program', content: 'Create a file with `.clyp` extension and write your first program.' },
        { title: 'Running Code', content: 'Use `clyp filename.clyp` to run your Clyp programs.' },
      ]
    },
    syntax: {
      title: 'Syntax Guide',
      icon: '📝',
      content: [
        { title: 'Variables', content: 'Declare variables with type annotations: `str name = "Clyp";`' },
        { title: 'Functions', content: 'Define functions with clear return types: `func greet() -> str`' },
        { title: 'Control Flow', content: 'Use familiar if/else, for, and while loops with clean syntax.' },
      ]
    },
    examples: {
      title: 'Code Examples',
      icon: '💡',
      content: [
        { title: 'Hello World', content: 'Basic program structure and output functions.' },
        { title: 'Data Structures', content: 'Working with lists, dictionaries, and custom types.' },
        { title: 'Advanced Features', content: 'Async/await, pattern matching, and more.' },
      ]
    }
  };

  const filteredContent = Object.entries(helpSections).map(([key, section]) => ({
    key,
    ...section,
    content: section.content.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.content.length > 0);

  if (!isOpen) return null;

  return (
    <div className="interactive-help-overlay" onClick={onClose}>
      <div className="interactive-help" onClick={e => e.stopPropagation()}>
        <div className="help-header">
          <h3>Help Center</h3>
          <button className="help-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="help-search">
          <input
            type="text"
            placeholder="Search help topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="help-search-input"
          />
        </div>
        
        <div className="help-body">
          <div className="help-tabs">
            {Object.entries(helpSections).map(([key, section]) => (
              <button
                key={key}
                className={`help-tab ${activeTab === key ? 'active' : ''}`}
                onClick={() => setActiveTab(key)}
              >
                <span className="help-tab-icon">{section.icon}</span>
                {section.title}
              </button>
            ))}
          </div>
          
          <div className="help-content">
            {searchQuery ? (
              <div className="help-search-results">
                <h4>Search Results</h4>
                {filteredContent.length === 0 ? (
                  <p>No results found for "{searchQuery}"</p>
                ) : (
                  filteredContent.map(section => (
                    <div key={section.key} className="help-section">
                      <h5>{section.icon} {section.title}</h5>
                      {section.content.map((item, index) => (
                        <div key={index} className="help-item">
                          <h6>{item.title}</h6>
                          <p>{item.content}</p>
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="help-section">
                {helpSections[activeTab as keyof typeof helpSections].content.map((item, index) => (
                  <div key={index} className="help-item">
                    <h4>{item.title}</h4>
                    <p>{item.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="help-footer">
          <p>Need more help? Check out our <a href="https://clypdocs.codesft.dev" target="_blank">documentation</a> or join the <a href="https://github.com/clyplang/clyp/discussions" target="_blank">community discussions</a>.</p>
        </div>
      </div>
    </div>
  );
};

export default {
  InteractiveCodeEditor,
  CommandPalette,
  InteractiveStats,
  NotificationCenter,
  InteractiveHelp
};