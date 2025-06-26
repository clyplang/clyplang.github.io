"""
Clyp Website - A modern, beautiful website for the Clyp programming language.
Built with Quart for async performance and modern web standards.
"""

from quart import Blueprint, render_template, jsonify, request, abort, Quart
from pygments import highlight
from pygments.lexers import get_lexer_by_name
from pygments.formatters import HtmlFormatter
from clyp_lexer import ClypLexer
import mistune
from pathlib import Path
import re
import json
import time

DEVELOPMENT = False  # Set to False in production

# Create blueprint for the main website
website_bp = Blueprint('website', __name__)

# Sample Clyp code examples
EXAMPLES = {
    'hello_world': {
        'title': 'Hello World',
        'description': 'A simple greeting program showing variable declaration and function definition.',
        'code': '''# A simple "Hello, World!" program in Clyp
str name = "World";
print("Hello, " + name + "!");

# Define a function to greet someone
def greet(str person) returns str {
    return "Greetings, " + person + "!";
};

# Call the function and print the result
print(greet("Clyp Developer"));'''
    },
    'data_structures': {
        'title': 'Data Structures',
        'description': 'Working with lists, chunking, and flattening operations.',
        'code': '''# Working with data structures in Clyp
list[int] numbers = [1, 2, 3, 4, 5, 6];
print("Original list:");
print(numbers);

# Get chunks of the list
list[list[int]] chunks = chunk(numbers, 2);
print("List chunked into size 2:");
print(chunks);

# Flatten the list back
list[int] flattened = flatten(chunks);
print("Flattened list:");
print(flattened);

# Repeat loop for iteration
repeat [3] times {
    print("Hello from a repeat loop!");
};'''
    },
    'advanced': {
        'title': 'Advanced Features',
        'description': 'Classes, conditionals, and the powerful pipeline operator.',
        'code': '''# Advanced Clyp features
class Counter {
    int count = 0;
    
    def increment(self) returns null {
        self.count = self.count + 1;
    };
    
    def get_count(self) returns int {
        return self.count;
    };
};

let c = Counter();
c.increment();
c.increment();
print("Count is: " + toString(c.get_count()));

# Pipeline operator example
def double(int n) returns int {
    return n * 2;
};

def add_five(int n) returns int {
    return n + 5;
};

let initial_value = 10;
# Pipeline passes value left to right
let final_value = initial_value |> double |> add_five;
print("Pipeline result: " + toString(final_value));'''
    }
}

def highlight_code(code, language='clyp'):
    """Highlight code using Pygments with enhanced formatting, removing line-numbers and language-badge."""
    try:
        # Use our custom Clyp lexer for .clyp files, fallback to Python
        if language == 'clyp':
            lexer = ClypLexer()
        else:
            lexer = get_lexer_by_name(language)

        formatter = HtmlFormatter(
            style='github-dark',
            cssclass='highlight',
            wrapcode=True,
            linenos=False,
            noclasses=False
        )
        highlighted = highlight(code, lexer, formatter)
    except Exception:
        lexer = get_lexer_by_name('text')
        formatter = HtmlFormatter(
            style='github-dark',
            cssclass='highlight',
            wrapcode=True,
            linenos=False,
            noclasses=False
        )
        highlighted = highlight(code, lexer, formatter)

    # Remove <div class="line-numbers">...</div> and <span class="language-badge">...</span>
    highlighted = re.sub(r'<div class="line-numbers">.*?</div>', '', highlighted, flags=re.DOTALL)
    print("Highlighted code:", highlighted)  # Debugging line
    highlighted = re.sub(r'<span class="language-badge">.*?</span>', '', highlighted, flags=re.DOTALL)
    print("Highlighted code after removing badges:", highlighted)  # Debugging line
    return highlighted

def render_markdown(content):
    """Render markdown content to HTML with syntax highlighting."""
    class HighlightRenderer(mistune.HTMLRenderer):
        def block_code(self, code, info=''):
            if info:
                if info == 'clyp':
                    lexer = ClypLexer()
                else:
                    lexer = get_lexer_by_name(info, stripall=True)
                formatter = HtmlFormatter(style='github-dark', cssclass='highlight', wrapcode=True)
                return highlight(code, lexer, formatter)
            return '<pre><code>' + mistune.escape(code) + '</code></pre>'

    renderer = HighlightRenderer()
    markdown = mistune.create_markdown(renderer=renderer)
    return markdown(content)

def get_docs():
    """Load all documentation files from the docs directory."""
    docs_dir = Path('docs')
    docs = []
    if not docs_dir.is_dir():
        return docs
    
    for md_file in sorted(docs_dir.glob('*.md')):
        content = md_file.read_text(encoding='utf-8')
        # Extract title from the first line: # Title
        first_line = content.split('\n', 1)[0]
        title = md_file.stem
        if first_line.startswith('# '):
            title = first_line[2:].strip()
        
        # From '01-introduction' to 'introduction'
        slug = md_file.stem
        if '-' in slug and slug.split('-', 1)[0].isdigit():
            slug = slug.split('-', 1)[1]

        docs.append({
            'slug': slug,
            'title': title,
            'content': content
        })
    return docs

def load_banners():
    """Load banners from banner.json if present."""
    try:
        with open('banner.json', encoding='utf-8') as f:
            banners = json.load(f)
            return [b for b in banners if b.get('text')]
    except Exception:
        return []

def get_current_banner():
    """Return a single banner, alternating every 30 seconds."""
    banners = load_banners()
    if not banners:
        return None
    # Alternate based on current time (30s interval)
    idx = int(time.time() // 30) % len(banners)
    return banners[idx]

@website_bp.route('/')
async def index():
    """Main landing page with syntax highlighting"""
    highlighted_examples = {}
    for key, example in EXAMPLES.items():
        highlighted_examples[key] = {
            **example,
            'highlighted_code': highlight_code(example['code'], 'clyp')
        }
    banner = get_current_banner()
    return await render_template('index.html', examples=highlighted_examples, banner=banner)

@website_bp.route('/examples')
async def examples():
    """Examples page with syntax highlighting"""
    highlighted_examples = {}
    for key, example in EXAMPLES.items():
        highlighted_examples[key] = {
            **example,
            'highlighted_code': highlight_code(example['code'], 'clyp')
        }
    banner = get_current_banner()
    return await render_template('examples.html', examples=highlighted_examples, banner=banner)

@website_bp.route('/docs/')
@website_bp.route('/docs/<slug>')
async def docs(slug=None):
    """Documentation page, rendered from Markdown files in the docs folder."""
    all_docs = get_docs()
    banner = get_current_banner()
    if not all_docs:
        pygments_css = HtmlFormatter(style='github-dark').get_style_defs('.highlight')
        no_docs_html = render_markdown("### No Documentation Found\n\nPlease add `.md` files to the `website/docs` directory.")
        return await render_template('docs.html', docs_nav=[], current_doc_html=no_docs_html, current_doc_title="Not Found", current_slug=None, pygments_css=pygments_css, banner=banner)

    if slug is None:
        # Default to the first document
        current_doc = all_docs[0]
    else:
        current_doc = next((doc for doc in all_docs if doc['slug'] == slug), None)

    if current_doc is None:
        abort(404, "Documentation page not found")

    rendered_docs = render_markdown(current_doc['content'])
    docs_nav = [{'slug': doc['slug'], 'title': doc['title']} for doc in all_docs]
    pygments_css = HtmlFormatter(style='github-dark').get_style_defs('.highlight')
    return await render_template(
        'docs.html', 
        docs_nav=docs_nav, 
        current_doc_html=rendered_docs, 
        current_doc_title=current_doc['title'],
        current_slug=current_doc['slug'],
        pygments_css=pygments_css,
        banner=banner
    )

@website_bp.route('/api/highlight', methods=['POST'])
async def api_highlight():
    """API endpoint to highlight code dynamically"""
    data = await request.get_json()
    code = data.get('code', '')
    language = data.get('language', 'clyp')
    
    highlighted = highlight_code(code, language)
    return jsonify({'highlighted': highlighted})


if DEVELOPMENT:
    static_url_path = '/static'
else:
    static_url_path = '/clyp/static'

app = Quart(__name__)
app.register_blueprint(
    website_bp,
    static_folder='static',
    static_url_path=static_url_path,
    template_folder='templates'
)