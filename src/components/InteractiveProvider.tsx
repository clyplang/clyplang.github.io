import React, { useState, useEffect, createContext, useContext } from 'react';
import { CommandPalette, NotificationCenter, InteractiveHelp } from './AdvancedInteractive';
import { KeyboardShortcuts, ProgressTracker, SyntaxTour, ThemeCustomizer } from './UXEnhancements';

// Global Interactive Context
interface InteractiveContextType {
  openCommandPalette: () => void;
  openNotifications: () => void;
  openHelp: () => void;
  openKeyboardShortcuts: () => void;
  openSyntaxTour: () => void;
  openThemeCustomizer: () => void;
  addNotification: (notification: any) => void;
}

const InteractiveContext = createContext<InteractiveContextType | null>(null);

export const useInteractive = () => {
  const context = useContext(InteractiveContext);
  if (!context) {
    throw new Error('useInteractive must be used within InteractiveProvider');
  }
  return context;
};

// Global Interactive Provider Component
interface InteractiveProviderProps {
  children: React.ReactNode;
  currentPage?: string;
}

export const InteractiveProvider: React.FC<InteractiveProviderProps> = ({ 
  children, 
  currentPage = '/' 
}) => {
  // State for all overlays
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [keyboardShortcutsOpen, setKeyboardShortcutsOpen] = useState(false);
  const [syntaxTourOpen, setSyntaxTourOpen] = useState(false);
  const [themeCustomizerOpen, setThemeCustomizerOpen] = useState(false);
  
  // Global keyboard shortcuts
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrl = e.ctrlKey || e.metaKey;
      
      if (isCtrl && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      
      if (isCtrl && e.shiftKey && e.key === 'N') {
        e.preventDefault();
        setNotificationsOpen(true);
      }
      
      if (isCtrl && e.shiftKey && e.key === 'H') {
        e.preventDefault();
        setHelpOpen(true);
      }
      
      if (isCtrl && e.key === '/') {
        e.preventDefault();
        setKeyboardShortcutsOpen(true);
      }
      
      if (isCtrl && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        setSyntaxTourOpen(true);
      }
      
      if (isCtrl && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setThemeCustomizerOpen(true);
      }
      
      // Sequential navigation shortcuts (G + key)
      if (e.key === 'g') {
        let nextKey = '';
        const timeout = setTimeout(() => {
          nextKey = '';
        }, 1000);
        
        const handleNextKey = (nextE: KeyboardEvent) => {
          clearTimeout(timeout);
          window.removeEventListener('keydown', handleNextKey);
          
          switch (nextE.key) {
            case 'h':
              window.location.href = '/';
              break;
            case 'e':
              window.location.href = '/examples';
              break;
            case 'w':
              window.location.href = '/whats-happening';
              break;
          }
        };
        
        window.addEventListener('keydown', handleNextKey);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Context value
  const contextValue: InteractiveContextType = {
    openCommandPalette: () => setCommandPaletteOpen(true),
    openNotifications: () => setNotificationsOpen(true),
    openHelp: () => setHelpOpen(true),
    openKeyboardShortcuts: () => setKeyboardShortcutsOpen(true),
    openSyntaxTour: () => setSyntaxTourOpen(true),
    openThemeCustomizer: () => setThemeCustomizerOpen(true),
    addNotification: (notification) => {
      // This would add to notification state
      console.log('Adding notification:', notification);
    }
  };

  return (
    <InteractiveContext.Provider value={contextValue}>
      {children}
      
      {/* Progress Tracker - always visible when scrolling */}
      <ProgressTracker />
      
      {/* Command Palette */}
      <CommandPalette 
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
      
      {/* Notification Center */}
      <NotificationCenter 
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
      
      {/* Interactive Help */}
      <InteractiveHelp 
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
      />
      
      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts 
        isOpen={keyboardShortcutsOpen}
        onClose={() => setKeyboardShortcutsOpen(false)}
      />
      
      {/* Syntax Tour */}
      <SyntaxTour 
        isActive={syntaxTourOpen}
        onClose={() => setSyntaxTourOpen(false)}
      />
      
      {/* Theme Customizer */}
      <ThemeCustomizer 
        isOpen={themeCustomizerOpen}
        onClose={() => setThemeCustomizerOpen(false)}
      />
    </InteractiveContext.Provider>
  );
};

// Quick Access Toolbar Component
export const QuickAccessToolbar: React.FC = () => {
  // Safely access the interactive context
  let interactive;
  try {
    interactive = useInteractive();
  } catch (error) {
    // If not in provider context, render nothing
    return null;
  }
  
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="quick-access-toolbar">
      <div className="toolbar-items">
        <button 
          className="toolbar-item"
          onClick={interactive.openCommandPalette}
          title="Command Palette (Ctrl+K)"
        >
          <span className="toolbar-icon">⌘</span>
        </button>
        
        <button 
          className="toolbar-item"
          onClick={interactive.openNotifications}
          title="Notifications (Ctrl+Shift+N)"
        >
          <span className="toolbar-icon">🔔</span>
          <span className="notification-badge">3</span>
        </button>
        
        <button 
          className="toolbar-item"
          onClick={interactive.openHelp}
          title="Help Center (Ctrl+Shift+H)"
        >
          <span className="toolbar-icon">❓</span>
        </button>
        
        <button 
          className="toolbar-item"
          onClick={interactive.openSyntaxTour}
          title="Syntax Tour (Ctrl+Shift+T)"
        >
          <span className="toolbar-icon">🎯</span>
        </button>
        
        <button 
          className="toolbar-item"
          onClick={interactive.openThemeCustomizer}
          title="Theme Customizer (Ctrl+Shift+P)"
        >
          <span className="toolbar-icon">🎨</span>
        </button>
        
        <button 
          className="toolbar-item"
          onClick={interactive.openKeyboardShortcuts}
          title="Keyboard Shortcuts (Ctrl+/)"
        >
          <span className="toolbar-icon">⌨️</span>
        </button>
      </div>
    </div>
  );
};

// Enhanced Floating Action Menu
interface FloatingActionMenuProps {
  position?: 'bottom-right' | 'bottom-left';
}

export const FloatingActionMenu: React.FC<FloatingActionMenuProps> = ({ 
  position = 'bottom-right' 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Safely access the interactive context
  let interactive;
  try {
    interactive = useInteractive();
  } catch (error) {
    // If not in provider context, render nothing
    return null;
  }

  const actions = [
    { 
      icon: '⌘', 
      label: 'Commands', 
      action: interactive.openCommandPalette,
      color: 'var(--primary-color)'
    },
    { 
      icon: '🔔', 
      label: 'Notifications', 
      action: interactive.openNotifications,
      color: 'var(--secondary-color)',
      badge: 3
    },
    { 
      icon: '❓', 
      label: 'Help', 
      action: interactive.openHelp,
      color: 'var(--success-color)'
    },
    { 
      icon: '🎯', 
      label: 'Tour', 
      action: interactive.openSyntaxTour,
      color: 'var(--warning-color)'
    },
    { 
      icon: '🎨', 
      label: 'Theme', 
      action: interactive.openThemeCustomizer,
      color: 'var(--error-color)'
    }
  ];

  return (
    <div className={`floating-action-menu ${position} ${isExpanded ? 'expanded' : ''}`}>
      <div className="action-items">
        {actions.map((action, index) => (
          <div 
            key={index}
            className="action-item"
            style={{ 
              '--delay': `${index * 0.1}s`,
              '--color': action.color 
            } as React.CSSProperties}
            onClick={() => {
              action.action();
              setIsExpanded(false);
            }}
          >
            <div className="action-content">
              <span className="action-icon">{action.icon}</span>
              {action.badge && <span className="action-badge">{action.badge}</span>}
            </div>
            <span className="action-label">{action.label}</span>
          </div>
        ))}
      </div>
      
      <button 
        className="main-action-button"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label="Toggle action menu"
      >
        <span className={`main-action-icon ${isExpanded ? 'rotated' : ''}`}>✨</span>
      </button>
    </div>
  );
};

// Context Hook for easy access
export const useQuickActions = () => {
  // Safely access the interactive context
  try {
    const interactive = useInteractive();
    return {
      ...interactive,
      showCommandPalette: interactive.openCommandPalette,
      showNotifications: interactive.openNotifications,
      showHelp: interactive.openHelp,
      showKeyboardShortcuts: interactive.openKeyboardShortcuts,
      startSyntaxTour: interactive.openSyntaxTour,
      customizeTheme: interactive.openThemeCustomizer,
    };
  } catch (error) {
    // Return no-op functions if not in provider context
    return {
      openCommandPalette: () => {},
      openNotifications: () => {},
      openHelp: () => {},
      openKeyboardShortcuts: () => {},
      openSyntaxTour: () => {},
      openThemeCustomizer: () => {},
      addNotification: () => {},
      showCommandPalette: () => {},
      showNotifications: () => {},
      showHelp: () => {},
      showKeyboardShortcuts: () => {},
      startSyntaxTour: () => {},
      customizeTheme: () => {},
    };
  }
};

export default {
  InteractiveProvider,
  QuickAccessToolbar,
  FloatingActionMenu,
  useInteractive,
  useQuickActions
};