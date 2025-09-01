import React, { useState, useEffect } from 'react';

interface FeatureCardProps {
    icon: string;
    title: string;
    description: string;
    delay?: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <div
            className={`feature-card ${isVisible ? 'animate-in' : ''}`}
            style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--spacing-xl)',
                textAlign: 'center',
                transition: 'all 0.4s ease',
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                opacity: isVisible ? 1 : 0,
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.borderColor = 'var(--primary-color)';
                e.currentTarget.style.boxShadow = 'var(--glow-primary)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
        >
            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-lg)' }}>
                {icon}
            </div>
            <h3 style={{ 
                marginBottom: 'var(--spacing-md)', 
                color: 'var(--text-primary)',
                fontSize: '1.2rem',
                fontWeight: '600'
            }}>
                {title}
            </h3>
            <p style={{ 
                color: 'var(--text-secondary)', 
                lineHeight: '1.6',
                fontSize: '0.95rem'
            }}>
                {description}
            </p>
        </div>
    );
};

interface AnimatedCounterProps {
    target: number;
    label: string;
    suffix?: string;
    duration?: number;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ 
    target, 
    label, 
    suffix = '', 
    duration = 2000 
}) => {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        const element = document.getElementById(`counter-${label}`);
        if (element) observer.observe(element);

        return () => observer.disconnect();
    }, [label]);

    useEffect(() => {
        if (!isVisible) return;

        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [isVisible, target, duration]);

    return (
        <div 
            id={`counter-${label}`}
            style={{ 
                textAlign: 'center',
                padding: 'var(--spacing-lg)',
            }}
        >
            <div style={{ 
                fontSize: '2.5rem', 
                fontWeight: '700',
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: 'var(--spacing-sm)'
            }}>
                {count}{suffix}
            </div>
            <div style={{ 
                color: 'var(--text-secondary)', 
                fontSize: '0.9rem',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
            }}>
                {label}
            </div>
        </div>
    );
};

interface InteractiveButtonProps {
    children: React.ReactNode;
    href?: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary';
    size?: 'small' | 'medium' | 'large';
}

export const InteractiveButton: React.FC<InteractiveButtonProps> = ({ 
    children, 
    href, 
    onClick, 
    variant = 'primary', 
    size = 'medium' 
}) => {
    const [isPressed, setIsPressed] = useState(false);

    const baseStyles = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        border: 'none',
        borderRadius: 'var(--radius-lg)',
        fontFamily: 'inherit',
        fontWeight: '600',
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative' as const,
        overflow: 'hidden' as const,
        transform: isPressed ? 'scale(0.98)' : 'scale(1)',
    };

    const sizeStyles = {
        small: { padding: '0.5rem 1rem', fontSize: '0.85rem' },
        medium: { padding: '0.75rem 1.5rem', fontSize: '0.95rem' },
        large: { padding: '1rem 2rem', fontSize: '1.1rem' },
    };

    const variantStyles = {
        primary: {
            background: 'var(--gradient-primary)',
            color: 'white',
            boxShadow: 'var(--shadow-md)',
        },
        secondary: {
            background: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
        },
    };

    const combinedStyles = {
        ...baseStyles,
        ...sizeStyles[size],
        ...variantStyles[variant],
    };

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);
    const handleMouseLeave = () => setIsPressed(false);

    const Element = href ? 'a' : 'button';
    const props = href ? { href } : { onClick };

    return (
        <Element
            {...props}
            style={combinedStyles}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </Element>
    );
};

export default { FeatureCard, AnimatedCounter, InteractiveButton };