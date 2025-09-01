import React, { useState, useEffect } from 'react';

interface FloatingActionButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  label,
  onClick,
  position = 'bottom-right',
  size = 'medium',
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const sizeClasses = {
    small: 'fab-small',
    medium: 'fab-medium',
    large: 'fab-large'
  };

  const positionClasses = {
    'bottom-right': 'fab-bottom-right',
    'bottom-left': 'fab-bottom-left',
    'top-right': 'fab-top-right',
    'top-left': 'fab-top-left'
  };

  return (
    <div 
      className={`floating-action-button ${sizeClasses[size]} ${positionClasses[position]} ${isVisible ? 'fab-visible' : ''} ${className}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      onClick={onClick}
    >
      <div className="fab-content">
        <span className="fab-icon">{icon}</span>
        <span className={`fab-label ${isExpanded ? 'fab-label-expanded' : ''}`}>
          {label}
        </span>
      </div>
      <div className="fab-ripple"></div>
    </div>
  );
};

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 500
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  return (
    <div 
      className="tooltip-wrapper"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {isVisible && (
        <div className={`tooltip tooltip-${position}`}>
          {content}
          <div className="tooltip-arrow"></div>
        </div>
      )}
    </div>
  );
};

interface ProgressIndicatorProps {
  progress: number;
  size?: 'small' | 'medium' | 'large';
  showPercentage?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  animated?: boolean;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  progress,
  size = 'medium',
  showPercentage = false,
  color = 'primary',
  animated = true
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedProgress(progress);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedProgress(progress);
    }
  }, [progress, animated]);

  const circumference = 2 * Math.PI * 45; // radius of 45
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  return (
    <div className={`progress-indicator progress-${size} progress-${color}`}>
      <svg className="progress-svg" width="100" height="100" viewBox="0 0 100 100">
        <circle
          className="progress-background"
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
          stroke="currentColor"
          strokeWidth="6"
          opacity="0.2"
        />
        <circle
          className="progress-foreground"
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
          stroke="currentColor"
          strokeWidth="6"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
      </svg>
      {showPercentage && (
        <div className="progress-text">
          {Math.round(animatedProgress)}%
        </div>
      )}
    </div>
  );
};

interface PulseIndicatorProps {
  active?: boolean;
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  intensity?: 'low' | 'medium' | 'high';
}

export const PulseIndicator: React.FC<PulseIndicatorProps> = ({
  active = true,
  size = 'medium',
  color = 'primary',
  intensity = 'medium'
}) => {
  return (
    <div className={`pulse-indicator pulse-${size} pulse-${color} pulse-${intensity} ${active ? 'pulse-active' : ''}`}>
      <div className="pulse-core"></div>
      <div className="pulse-ring pulse-ring-1"></div>
      <div className="pulse-ring pulse-ring-2"></div>
      <div className="pulse-ring pulse-ring-3"></div>
    </div>
  );
};

interface ShimmerEffectProps {
  children: React.ReactNode;
  direction?: 'left-to-right' | 'right-to-left' | 'top-to-bottom';
  duration?: number;
  trigger?: 'hover' | 'auto' | 'click';
}

export const ShimmerEffect: React.FC<ShimmerEffectProps> = ({
  children,
  direction = 'left-to-right',
  duration = 1500,
  trigger = 'hover'
}) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger === 'auto') {
      const interval = setInterval(() => {
        setIsActive(true);
        setTimeout(() => setIsActive(false), duration);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [trigger, duration]);

  const handleInteraction = () => {
    if (trigger === 'hover' || trigger === 'click') {
      setIsActive(true);
      setTimeout(() => setIsActive(false), duration);
    }
  };

  const eventProps = trigger === 'hover' 
    ? { onMouseEnter: handleInteraction }
    : trigger === 'click'
    ? { onClick: handleInteraction }
    : {};

  return (
    <div 
      className={`shimmer-wrapper shimmer-${direction} ${isActive ? 'shimmer-active' : ''}`}
      {...eventProps}
      style={{ '--shimmer-duration': `${duration}ms` } as React.CSSProperties}
    >
      {children}
      <div className="shimmer-overlay"></div>
    </div>
  );
};

interface GlowEffectProps {
  children: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  intensity?: 'low' | 'medium' | 'high';
  trigger?: 'hover' | 'focus' | 'always';
}

export const GlowEffect: React.FC<GlowEffectProps> = ({
  children,
  color = 'primary',
  intensity = 'medium',
  trigger = 'hover'
}) => {
  const [isActive, setIsActive] = useState(trigger === 'always');

  const eventProps = trigger === 'hover'
    ? {
        onMouseEnter: () => setIsActive(true),
        onMouseLeave: () => setIsActive(false)
      }
    : trigger === 'focus'
    ? {
        onFocus: () => setIsActive(true),
        onBlur: () => setIsActive(false)
      }
    : {};

  return (
    <div 
      className={`glow-wrapper glow-${color} glow-${intensity} ${isActive ? 'glow-active' : ''}`}
      {...eventProps}
    >
      {children}
    </div>
  );
};

export default {
  FloatingActionButton,
  Tooltip,
  ProgressIndicator,
  PulseIndicator,
  ShimmerEffect,
  GlowEffect
};