// Main JavaScript for Clyp website
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeTheme();
    initializeNavigation();
    initializeSmoothScrolling();
    initializeCodeHighlighting();
    initializeAnimations();
    initializeEnhancedFeatures();
    loadLiveStats();
});

// Enhanced features initialization
function initializeEnhancedFeatures() {
    // Enhanced copy functionality for code blocks
    enhanceCopyButtons();
    
    // Add loading animations
    addLoadingAnimations();
    
    // Initialize enhanced interactions
    initializeEnhancedInteractions();
    
    // Add scroll progress indicator
    addScrollProgress();
}

// Enhanced copy buttons with better feedback
function enhanceCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-code-btn, [onclick*="copyCode"]');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Enhanced feedback animation
            this.style.transform = 'scale(0.95)';
            this.style.background = 'var(--secondary-color)';
            
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.height, rect.width);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                this.style.transform = '';
                this.style.background = '';
                if (ripple.parentNode) ripple.remove();
            }, 200);
        });
    });
}

// Add loading animations
function addLoadingAnimations() {
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(stat => {
        if (stat.textContent === '...' || stat.textContent === 'N/A') {
            stat.classList.add('loading');
        }
    });
}

// Enhanced interactions
function initializeEnhancedInteractions() {
    // Enhanced button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Enhanced feature card interactions
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Enhanced code window interactions
    const codeWindows = document.querySelectorAll('.code-window');
    codeWindows.forEach(window => {
        window.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        window.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// Add scroll progress indicator
function addScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
        z-index: 10000;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Enhanced live stats loading
async function loadLiveStats() {
    try {
        const response = await fetch('/api/live_stats');
        const stats = await response.json();
        
        // Remove loading states
        document.querySelectorAll('.stat-value').forEach(stat => {
            stat.classList.remove('loading');
        });
        
        // Update stats with animation
        animateStatUpdate('pypi-downloads-value', stats.pypi_downloads || 'N/A');
        animateStatUpdate('github-stars-value', stats.github_stars || 'N/A');
        animateStatUpdate('github-commits-value', stats.github_commits || 'N/A');
        
    } catch (error) {
        console.log('Stats unavailable, using fallback');
        document.querySelectorAll('.stat-value').forEach(stat => {
            stat.classList.remove('loading');
            if (stat.textContent === '...') {
                stat.textContent = 'N/A';
            }
        });
    }
}

// Animate stat updates
function animateStatUpdate(elementId, newValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.style.transform = 'scale(0.8)';
    element.style.opacity = '0.5';
    
    setTimeout(() => {
        element.textContent = newValue;
        element.style.transform = 'scale(1)';
        element.style.opacity = '1';
    }, 200);
}

// Add CSS for ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .btn {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(rippleStyle);

// Theme management
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    // Get saved theme or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
    } else if (systemPrefersDark) {
        html.setAttribute('data-theme', 'dark');
    } else {
        html.setAttribute('data-theme', 'light');
    }
    
    // Update toggle icons
    updateThemeIcons();
    
    // Theme toggle functionality
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcons();
            
            // Add subtle animation feedback
            themeToggle.style.transform = 'scale(0.95)';
            setTimeout(() => {
                themeToggle.style.transform = '';
            }, 100);
        });
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        // Only update if user hasn't set a preference
        if (!localStorage.getItem('theme')) {
            html.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            updateThemeIcons();
        }
    });
}

function updateThemeIcons() {
    const html = document.documentElement;
    const sunIcon = document.querySelector('.theme-toggle .sun-icon');
    const moonIcon = document.querySelector('.theme-toggle .moon-icon');
    const currentTheme = html.getAttribute('data-theme');
    
    if (sunIcon && moonIcon) {
        if (currentTheme === 'dark') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }
}

// Navigation functionality
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    
    // Navbar scroll behavior with theme awareness
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        
        if (currentScrollY > 100) {
            if (isDark) {
                navbar.style.background = 'rgba(26, 32, 44, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            }
        } else {
            if (isDark) {
                navbar.style.background = 'rgba(26, 32, 44, 0.95)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            }
            navbar.style.boxShadow = 'none';
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Mobile menu toggle functionality
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            // Update hamburger icon
            const icon = mobileMenuToggle.querySelector('span');
            if (navMenu.classList.contains('active')) {
                icon.innerHTML = '✕';
                icon.style.fontSize = '1.2rem';
            } else {
                icon.innerHTML = '☰';
                icon.style.fontSize = '1.5rem';
            }
        });
        
        // Close mobile menu when clicking on nav links
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
                const icon = mobileMenuToggle.querySelector('span');
                icon.innerHTML = '☰';
                icon.style.fontSize = '1.5rem';
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
                const icon = mobileMenuToggle.querySelector('span');
                icon.innerHTML = '☰';
                icon.style.fontSize = '1.5rem';
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
                const icon = mobileMenuToggle.querySelector('span');
                icon.innerHTML = '☰';
                icon.style.fontSize = '1.5rem';
            }
        });
    }
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Enhanced code highlighting and copy functionality
function initializeCodeHighlighting() {
    // Add copy buttons to code blocks
    const codeBlocks = document.querySelectorAll('.highlight');
    
    codeBlocks.forEach((block, index) => {
        const wrapper = block.parentElement;
        if (wrapper.classList.contains('code-content')) {
            const header = wrapper.previousElementSibling;
            if (header && header.classList.contains('code-header')) {
                // Check if copy button already exists
                if (!header.querySelector('.copy-code-btn')) {
                    const copyBtn = createCopyButton(block, index);
                    header.appendChild(copyBtn);
                }
            }
        }
    });
    
    // Enhance code blocks with interactions
    enhanceCodeBlocks();
    
    // Syntax highlighting for dynamic content
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }
}

// Enhanced copy button creation
function createCopyButton(codeBlock, index) {
    const button = document.createElement('button');
    button.className = 'copy-code-btn';
    button.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
        </svg>
        Copy
    `;
    
    button.addEventListener('click', async () => {
        const code = codeBlock.querySelector('pre').textContent;
        
        try {
            await navigator.clipboard.writeText(code);
            
            // Success feedback
            const originalHTML = button.innerHTML;
            button.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                Copied!
            `;
            button.classList.add('copied');
            
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.classList.remove('copied');
            }, 2000);
            
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = code;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
                const originalHTML = button.innerHTML;
                button.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    Copied!
                `;
                button.classList.add('copied');
                setTimeout(() => {
                    button.innerHTML = originalHTML;
                    button.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy code: ', err);
                button.textContent = 'Copy failed';
                setTimeout(() => {
                    button.innerHTML = originalHTML;
                }, 2000);
            }
            
            document.body.removeChild(textArea);
        }
    });
    
    return button;
}

// Enhanced code block interactions
function enhanceCodeBlocks() {
    const codeBlocks = document.querySelectorAll('.code-window');
    
    codeBlocks.forEach(block => {
        // Add focus/blur effects
        block.addEventListener('mouseenter', () => {
            block.style.transform = 'translateY(-2px)';
        });
        
        block.addEventListener('mouseleave', () => {
            block.style.transform = '';
        });
        
        // Add click to focus
        const codeContent = block.querySelector('.code-content');
        if (codeContent) {
            codeContent.addEventListener('click', () => {
                // Scroll code into better view if needed
                const rect = block.getBoundingClientRect();
                if (rect.top < 100) {
                    block.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        }
    });
}

// Initialize animations and scroll effects
function initializeAnimations() {
    // Intersection Observer for fade-in animations with better settings
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // Add staggered animation for multiple elements
                const siblings = Array.from(entry.target.parentNode.children);
                const index = siblings.indexOf(entry.target);
                entry.target.style.animationDelay = `${index * 100}ms`;
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate
    const animatedElements = document.querySelectorAll('.feature-card, .example-card, .step-card, .reference-card');
    animatedElements.forEach((el, index) => {
        el.classList.add('animate-ready');
        observer.observe(el);
    });
    
    // Enhanced parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            const heroContent = hero.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.transform = `translateY(${rate}px)`;
            }
        });
    }
}

// Tab functionality for examples
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Advanced syntax highlighting functionality
function initializeAdvancedHighlighting() {
    // Add language indicators to code blocks
    addLanguageIndicators();
    
    // Enhance existing highlighted code
    enhanceHighlightedCode();
    
    // Initialize real-time highlighting for editors
    initializeRealTimeHighlighting();
    
    // Add line numbers where appropriate
    addLineNumbersToCodeBlocks();
}

// Add language indicators to code headers
function addLanguageIndicators() {
    const codeHeaders = document.querySelectorAll('.code-header');
    
    codeHeaders.forEach(header => {
        const title = header.querySelector('.code-title');
        if (title) {
            const filename = title.textContent;
            const extension = filename.split('.').pop();
            
            // Set language attribute for CSS styling
            header.setAttribute('data-language', extension);
            
            // Add language badge if not already present
            if (!header.querySelector('.language-badge')) {
                const badge = document.createElement('span');
                badge.className = 'language-badge';
                badge.textContent = extension.toUpperCase();
                header.appendChild(badge);
            }
        }
    });
}

// Enhance highlighted code with additional features
function enhanceHighlightedCode() {
    const highlightBlocks = document.querySelectorAll('.highlight');
    
    highlightBlocks.forEach(block => {
        // Add hover effects for syntax elements
        addSyntaxHoverEffects(block);
        
        // Highlight matching brackets
        addBracketMatching(block);
        
        // Add word highlighting on double-click
        addWordHighlighting(block);
    });
}

// Add hover effects for different syntax elements
function addSyntaxHoverEffects(codeBlock) {
    const syntaxElements = codeBlock.querySelectorAll('.k, .nf, .nc, .kt');
    
    syntaxElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            element.style.borderRadius = '2px';
            element.style.padding = '1px 2px';
            element.style.margin = '-1px -2px';
            element.style.transition = 'all 0.2s ease';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.backgroundColor = '';
            element.style.borderRadius = '';
            element.style.padding = '';
            element.style.margin = '';
        });
    });
}

// Add bracket matching functionality
function addBracketMatching(codeBlock) {
    const brackets = codeBlock.querySelectorAll('.p');
    const bracketPairs = { '(': ')', '[': ']', '{': '}' };
    
    brackets.forEach(bracket => {
        const char = bracket.textContent.trim();
        if (bracketPairs[char] || Object.values(bracketPairs).includes(char)) {
            bracket.addEventListener('mouseenter', () => {
                highlightMatchingBracket(bracket, codeBlock, char);
            });
            
            bracket.addEventListener('mouseleave', () => {
                clearBracketHighlights(codeBlock);
            });
        }
    });
}

// Highlight matching brackets
function highlightMatchingBracket(bracket, codeBlock, char) {
    const allBrackets = Array.from(codeBlock.querySelectorAll('.p'));
    const bracketPairs = { '(': ')', '[': ']', '{': '}' };
    const reversePairs = { ')': '(', ']': '[', '}': '{' };
    
    const currentIndex = allBrackets.indexOf(bracket);
    let matchChar = bracketPairs[char] || reversePairs[char];
    let direction = bracketPairs[char] ? 1 : -1;
    let depth = 0;
    
    // Highlight current bracket
    bracket.style.backgroundColor = 'rgba(79, 172, 254, 0.3)';
    bracket.style.borderRadius = '2px';
    
    // Find matching bracket
    for (let i = currentIndex + direction; i >= 0 && i < allBrackets.length; i += direction) {
        const currentBracket = allBrackets[i];
        const currentChar = currentBracket.textContent.trim();
        
        if (currentChar === char) {
            depth++;
        } else if (currentChar === matchChar) {
            if (depth === 0) {
                currentBracket.style.backgroundColor = 'rgba(79, 172, 254, 0.3)';
                currentBracket.style.borderRadius = '2px';
                break;
            }
            depth--;
        }
    }
}

// Clear bracket highlights
function clearBracketHighlights(codeBlock) {
    const brackets = codeBlock.querySelectorAll('.p');
    brackets.forEach(bracket => {
        bracket.style.backgroundColor = '';
        bracket.style.borderRadius = '';
    });
}

// Add word highlighting on double-click
function addWordHighlighting(codeBlock) {
    codeBlock.addEventListener('dblclick', (e) => {
        const target = e.target;
        if (target.matches('.n, .nf, .nv')) {
            const word = target.textContent.trim();
            highlightAllOccurrences(codeBlock, word);
            
            // Clear highlights after 3 seconds
            setTimeout(() => {
                clearWordHighlights(codeBlock);
            }, 3000);
        }
    });
}

// Highlight all occurrences of a word
function highlightAllOccurrences(codeBlock, word) {
    clearWordHighlights(codeBlock);
    
    const elements = codeBlock.querySelectorAll('.n, .nf, .nv');
    elements.forEach(element => {
        if (element.textContent.trim() === word) {
            element.classList.add('word-highlight');
        }
    });
}

// Clear word highlights
function clearWordHighlights(codeBlock) {
    const highlighted = codeBlock.querySelectorAll('.word-highlight');
    highlighted.forEach(element => {
        element.classList.remove('word-highlight');
    });
}

// Initialize real-time highlighting for code editors
function initializeRealTimeHighlighting() {
    const codeEditor = document.getElementById('code-editor');
    if (codeEditor) {
        // Add syntax highlighting as user types (debounced)
        let highlightTimer;
        codeEditor.addEventListener('input', () => {
            clearTimeout(highlightTimer);
            highlightTimer = setTimeout(() => {
                highlightCodeEditor(codeEditor);
            }, 300);
        });
        
        // Initial highlighting
        highlightCodeEditor(codeEditor);
    }
}

// Highlight code in editor (simplified client-side highlighting)
function highlightCodeEditor(editor) {
    const code = editor.value;
    const lines = code.split('\n');
    
    // Create a preview div for highlighted code (if needed)
    let preview = document.getElementById('editor-preview');
    if (!preview) {
        preview = document.createElement('div');
        preview.id = 'editor-preview';
        preview.className = 'editor-preview';
        preview.style.display = 'none'; // Hidden by default
        editor.parentNode.appendChild(preview);
    }
    
    // Simple client-side highlighting patterns for Clyp
    const patterns = [
        { regex: /#.*$/gm, class: 'comment' },
        { regex: /\b(function|class|if|else|while|for|return|let)\b/g, class: 'keyword' },
        { regex: /\b(int|str|bool|float|list|dict)\b/g, class: 'type' },
        { regex: /"([^"\\]|\\.)*"/g, class: 'string' },
        { regex: /\b\d+(\.\d+)?\b/g, class: 'number' },
        { regex: /\b(print|len|range)\b/g, class: 'builtin' }
    ];
    
    let highlightedCode = code;
    patterns.forEach(pattern => {
        highlightedCode = highlightedCode.replace(pattern.regex, `<span class="${pattern.class}">$&</span>`);
    });
    
    preview.innerHTML = `<pre><code>${highlightedCode}</code></pre>`;
}

// Add line numbers to appropriate code blocks
function addLineNumbersToCodeBlocks() {
    const codeBlocks = document.querySelectorAll('.code-window .highlight');
    
    codeBlocks.forEach(block => {
        const pre = block.querySelector('pre');
        if (pre && pre.textContent.split('\n').length > 5) {
            const lines = pre.textContent.split('\n');
            const lineNumbers = lines.map((_, index) => index + 1).join('\n');
            
            const lineNumbersEl = document.createElement('div');
            lineNumbersEl.className = 'line-numbers';
            lineNumbersEl.textContent = lineNumbers;
            
            const wrapper = document.createElement('div');
            wrapper.className = 'has-line-numbers';
            
            block.parentNode.insertBefore(wrapper, block);
            wrapper.appendChild(lineNumbersEl);
            wrapper.appendChild(block);
        }
    });
}

// Enhanced copy functionality with better feedback
function enhancedCopyToClipboard(text, button) {
    return navigator.clipboard.writeText(text).then(() => {
        // Create floating success indicator
        const indicator = document.createElement('div');
        indicator.className = 'copy-success-indicator';
        indicator.textContent = 'Copied to clipboard!';
        indicator.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--secondary-color);
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 0.875rem;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
            pointer-events: none;
        `;
        
        document.body.appendChild(indicator);
        
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.parentNode.removeChild(indicator);
            }
        }, 3000);
        
        // Button animation
        button.style.transform = 'scale(0.95)';
        button.style.backgroundColor = 'var(--secondary-color)';
        setTimeout(() => {
            button.style.transform = '';
            button.style.backgroundColor = '';
        }, 200);
    });
}

// Initialize advanced highlighting when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeAdvancedHighlighting();
});

// Add CSS for advanced highlighting features
const advancedHighlightingCSS = `
    .word-highlight {
        background-color: rgba(255, 235, 59, 0.3) !important;
        border-radius: 2px;
        box-shadow: 0 0 0 1px rgba(255, 235, 59, 0.5);
        animation: wordHighlightPulse 0.3s ease;
    }
    
    @keyframes wordHighlightPulse {
        0% { background-color: rgba(255, 235, 59, 0.6); }
        100% { background-color: rgba(255, 235, 59, 0.3); }
    }
    
    .language-badge {
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.8);
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 0.7rem;
        font-family: var(--font-mono);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-left: auto;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .editor-preview {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        background: transparent;
        color: transparent;
        z-index: 1;
    }
    
    .editor-preview .comment { color: #8b949e; }
    .editor-preview .keyword { color: #ff7b72; font-weight: 600; }
    .editor-preview .type { color: #79c0ff; font-weight: 600; }
    .editor-preview .string { color: #a5d6ff; }
    .editor-preview .number { color: #a5d6ff; font-weight: 500; }
    .editor-preview .builtin { color: #ffa657; font-weight: 500; }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;

// Inject the CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = advancedHighlightingCSS;
document.head.appendChild(styleSheet);

// Export functions for use in templates
window.ClypWebsite = {
    copyToClipboard: function(text) {
        return navigator.clipboard.writeText(text);
    },
    toggleTheme: function() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcons();
    }
};

// Initialize page-specific functionality
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTabs);
} else {
    initializeTabs();
}
