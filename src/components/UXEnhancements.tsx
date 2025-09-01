import React, { useState, useEffect, useRef } from 'react';

// Keyboard Shortcuts Overlay Component
interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ isOpen, onClose }) => {
  const shortcuts = [
    { key: 'Ctrl/Cmd + K', description: 'Open command palette', category: 'Navigation' },
    { key: 'Ctrl/Cmd + /', description: 'Toggle this help', category: 'Navigation' },
    { key: 'Ctrl/Cmd + Shift + N', description: 'Toggle notifications', category: 'Navigation' },
    { key: 'Ctrl/Cmd + Shift + H', description: 'Open help center', category: 'Navigation' },
    { key: 'Ctrl/Cmd + Enter', description: 'Run code in editor', category: 'Code Editor' },
    { key: 'Ctrl/Cmd + S', description: 'Save code snippet', category: 'Code Editor' },
    { key: 'Ctrl/Cmd + D', description: 'Duplicate line', category: 'Code Editor' },
    { key: 'Tab', description: 'Indent line', category: 'Code Editor' },
    { key: 'Shift + Tab', description: 'Unindent line', category: 'Code Editor' },
    { key: 'Esc', description: 'Close overlays', category: 'General' },
    { key: 'G → H', description: 'Go to home', category: 'Navigation' },
    { key: 'G → E', description: 'Go to examples', category: 'Navigation' },
    { key: 'G → W', description: 'Go to what\'s happening', category: 'Navigation' },
  ];

  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, typeof shortcuts>);

  if (!isOpen) return null;

  return (
    <div className="keyboard-shortcuts-overlay" onClick={onClose}>
      <div className="keyboard-shortcuts" onClick={e => e.stopPropagation()}>
        <div className="shortcuts-header">
          <h3>⌨️ Keyboard Shortcuts</h3>
          <button className="shortcuts-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="shortcuts-grid">
          {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
            <div key={category} className="shortcuts-category">
              <h4>{category}</h4>
              <div className="shortcuts-list">
                {categoryShortcuts.map((shortcut, index) => (
                  <div key={index} className="shortcut-item">
                    <div className="shortcut-keys">
                      {shortcut.key.split(' + ').map((part, i, arr) => (
                        <React.Fragment key={i}>
                          <kbd>{part}</kbd>
                          {i < arr.length - 1 && <span className="shortcut-plus">+</span>}
                        </React.Fragment>
                      ))}
                    </div>
                    <span className="shortcut-description">{shortcut.description}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Progress Tracker Component
export const ProgressTracker: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const updateProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
      setIsVisible(scrollTop > 100);
    };

    const calculateReadingTime = () => {
      const text = document.body.innerText;
      const words = text.split(' ').length;
      const avgWordsPerMinute = 200;
      const time = Math.ceil(words / avgWordsPerMinute);
      setReadingTime(time);
    };

    updateProgress();
    calculateReadingTime();

    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="progress-tracker">
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      <div className="progress-info">
        <span className="progress-percentage">{Math.round(scrollProgress)}%</span>
        <span className="reading-time">{readingTime} min read</span>
      </div>
    </div>
  );
};

// Interactive Navigation Enhancement
interface SmartNavigationProps {
  currentPage: string;
}

export const SmartNavigation: React.FC<SmartNavigationProps> = ({ currentPage }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const navigationItems = [
    { path: '/', label: 'Home', icon: '🏠', keywords: ['home', 'main', 'index'] },
    { path: '/examples', label: 'Examples', icon: '📚', keywords: ['examples', 'code', 'samples', 'demo'] },
    { path: '/whats-happening', label: 'What\'s Happening', icon: '📈', keywords: ['activity', 'news', 'updates', 'happening'] },
    { path: 'https://clypdocs.codesft.dev', label: 'Documentation', icon: '📖', keywords: ['docs', 'documentation', 'guide', 'manual'] },
    { path: 'https://github.com/clyplang/clyp', label: 'GitHub', icon: '🐙', keywords: ['github', 'source', 'code', 'repository'] },
  ];

  const filteredItems = navigationItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.keywords.some(keyword => keyword.includes(searchQuery.toLowerCase()))
  );

  const handleNavigation = (path: string) => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    if (path.startsWith('http')) {
      window.open(path, '_blank');
    } else {
      window.location.href = path;
    }
    setIsExpanded(false);
    setSearchQuery('');
  };

  useEffect(() => {
    if (isExpanded && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isExpanded]);

  return (
    <div className={`smart-navigation ${isExpanded ? 'expanded' : ''}`}>
      <div className="nav-toggle">
        <button
          className="nav-toggle-btn"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label="Toggle navigation"
        >
          <span className="nav-icon">🧭</span>
          <span className="nav-label">Navigate</span>
        </button>
      </div>

      {isExpanded && (
        <div className="nav-dropdown">
          <div className="nav-search">
            <input
              ref={searchRef}
              type="text"
              placeholder="Search navigation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="nav-search-input"
            />
          </div>
          
          <div className="nav-items">
            {filteredItems.map((item) => (
              <button
                key={item.path}
                className={`nav-item ${item.path === currentPage ? 'active' : ''}`}
                onClick={() => handleNavigation(item.path)}
              >
                <span className="nav-item-icon">{item.icon}</span>
                <span className="nav-item-label">{item.label}</span>
              </button>
            ))}
          </div>
          
          <div className="nav-footer">
            <div className="nav-hint">
              Press <kbd>Ctrl</kbd> + <kbd>K</kbd> for command palette
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Code Syntax Tour Component
interface SyntaxTourProps {
  isActive: boolean;
  onClose: () => void;
}

export const SyntaxTour: React.FC<SyntaxTourProps> = ({ isActive, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [tourData] = useState([
    {
      title: "Variable Declaration",
      code: "str name = \"Clyp\";\nint age = 3;",
      explanation: "Clyp uses clear type annotations. Declare variables with their type followed by the assignment.",
      highlight: [0, 1]
    },
    {
      title: "Function Definition",
      code: "func greet(str person) -> str {\n    return \"Hello, \" + person + \"!\";\n}",
      explanation: "Functions are defined with the 'func' keyword, parameter types, and return type annotations.",
      highlight: [0]
    },
    {
      title: "Control Flow",
      code: "if (age >= 18) {\n    print(\"Adult\");\n} else {\n    print(\"Minor\");\n}",
      explanation: "Familiar if/else syntax with clear braces and conditions.",
      highlight: [0, 2]
    },
    {
      title: "Loops and Iteration",
      code: "for (int i = 0; i < 10; i++) {\n    print(i);\n}\n\nlist<str> items = [\"a\", \"b\", \"c\"];\nfor (item in items) {\n    print(item);\n}",
      explanation: "Both traditional for loops and for-in loops for collections.",
      highlight: [0, 4, 5]
    }
  ]);

  const nextStep = () => {
    if (currentStep < tourData.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isActive) return null;

  const currentTour = tourData[currentStep];

  return (
    <div className="syntax-tour-overlay">
      <div className="syntax-tour">
        <div className="tour-header">
          <h3>🎯 Clyp Syntax Tour</h3>
          <div className="tour-progress">
            Step {currentStep + 1} of {tourData.length}
          </div>
          <button className="tour-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="tour-content">
          <div className="tour-step">
            <h4>{currentTour.title}</h4>
            <div className="tour-code-container">
              <div className="code-window">
                <div className="code-header">
                  <div className="code-dots">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                  </div>
                  <span className="code-title">example.clyp</span>
                </div>
                <div className="code-content">
                  <pre className="tour-code">
                    {currentTour.code.split('\n').map((line, index) => (
                      <div 
                        key={index}
                        className={`code-line ${currentTour.highlight.includes(index) ? 'highlighted' : ''}`}
                      >
                        <span className="line-number">{index + 1}</span>
                        <span className="line-content">{line}</span>
                      </div>
                    ))}
                  </pre>
                </div>
              </div>
            </div>
            <div className="tour-explanation">
              <p>{currentTour.explanation}</p>
            </div>
          </div>
        </div>
        
        <div className="tour-controls">
          <button 
            className="tour-btn secondary"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            ← Previous
          </button>
          
          <div className="tour-indicators">
            {tourData.map((_, index) => (
              <button
                key={index}
                className={`tour-indicator ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                onClick={() => setCurrentStep(index)}
              />
            ))}
          </div>
          
          <button 
            className="tour-btn primary"
            onClick={nextStep}
          >
            {currentStep === tourData.length - 1 ? 'Finish Tour' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Theme Customizer Component
interface ThemeCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ isOpen, onClose }) => {
  const [activeTheme, setActiveTheme] = useState('dark');
  const [customColors, setCustomColors] = useState({
    primary: '#7c3aed',
    secondary: '#06b6d4',
    accent: '#f59e0b'
  });

  const themes = [
    { id: 'dark', name: 'Dark Mode', preview: ['#0f172a', '#1e293b', '#7c3aed'] },
    { id: 'light', name: 'Light Mode', preview: ['#ffffff', '#f8fafc', '#7c3aed'] },
    { id: 'midnight', name: 'Midnight', preview: ['#000000', '#111111', '#00ccff'] },
    { id: 'neon', name: 'Neon', preview: ['#0a0a0a', '#1a1a1a', '#ff2d92'] },
    { id: 'forest', name: 'Forest', preview: ['#0f2419', '#1a3a2e', '#00ff88'] },
  ];

  const applyTheme = (themeId: string) => {
    setActiveTheme(themeId);
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${themeId}`);
  };

  const applyCustomColor = (property: string, color: string) => {
    setCustomColors(prev => ({ ...prev, [property]: color }));
    document.documentElement.style.setProperty(`--${property}-color`, color);
  };

  if (!isOpen) return null;

  return (
    <div className="theme-customizer-overlay" onClick={onClose}>
      <div className="theme-customizer" onClick={e => e.stopPropagation()}>
        <div className="customizer-header">
          <h3>🎨 Theme Customizer</h3>
          <button className="customizer-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="customizer-content">
          <div className="customizer-section">
            <h4>Preset Themes</h4>
            <div className="theme-grid">
              {themes.map(theme => (
                <button
                  key={theme.id}
                  className={`theme-option ${activeTheme === theme.id ? 'active' : ''}`}
                  onClick={() => applyTheme(theme.id)}
                >
                  <div className="theme-preview">
                    {theme.preview.map((color, index) => (
                      <div
                        key={index}
                        className="theme-color"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <span className="theme-name">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="customizer-section">
            <h4>Custom Colors</h4>
            <div className="color-inputs">
              {Object.entries(customColors).map(([key, value]) => (
                <div key={key} className="color-input-group">
                  <label htmlFor={`color-${key}`}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                  <div className="color-input-container">
                    <input
                      id={`color-${key}`}
                      type="color"
                      value={value}
                      onChange={(e) => applyCustomColor(key, e.target.value)}
                      className="color-input"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => applyCustomColor(key, e.target.value)}
                      className="color-text-input"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="customizer-section">
            <h4>Preview</h4>
            <div className="theme-preview-large">
              <div className="preview-header">Header</div>
              <div className="preview-content">
                <div className="preview-card">
                  <h5>Sample Card</h5>
                  <p>This is how your theme will look.</p>
                  <button className="preview-button">Sample Button</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="customizer-footer">
          <button className="reset-btn" onClick={() => applyTheme('dark')}>
            Reset to Default
          </button>
          <button className="export-btn">
            Export Theme
          </button>
        </div>
      </div>
    </div>
  );
};

export default {
  KeyboardShortcuts,
  ProgressTracker,
  SmartNavigation,
  SyntaxTour,
  ThemeCustomizer
};