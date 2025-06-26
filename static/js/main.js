// Main JavaScript for Clyp website
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeTheme();
    initializeNavigation();
    initializeSmoothScrolling();
    initializeCodeHighlighting();
    initializeAnimations();
});

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
    
    // Mobile menu toggle (if implemented)
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
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
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate
    const animatedElements = document.querySelectorAll('.feature-card, .example-card, .step-card, .reference-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = hero.querySelector('.hero-container');
            if (parallax) {
                const speed = scrolled * 0.2;
                parallax.style.transform = `translateY(${speed}px)`;
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
