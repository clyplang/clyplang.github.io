"""
Clyp Website - A modern, beautiful website for the Clyp programming language.
Built with Quart for async performance and modern web standards.
"""

from quart import Blueprint, render_template, jsonify, request, abort
from pygments import highlight
from pygments.lexers import get_lexer_by_name
from pygments.formatters import HtmlFormatter
from clyp_lexer import ClypLexer
import mistune
from pathlib import Path

# Create blueprint for the main website
website_bp = Blueprint('website', __name__, url_prefix='/clyp')

# Sample Clyp code examples
EXAMPLES = {
    'hello_world': {
        'title': 'Hello World',
        'description': 'A simple greeting program showing variable declaration and function definition.',
        'code': '''# A simple "Hello, World!" program in Clyp
str name = "World";
print("Hello, " + name + "!");

# Define a function to greet someone
function greet(str person) returns str {
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
    
    function increment(self) returns null {
        self.count = self.count + 1;
    };
    
    function get_count(self) returns int {
        return self.count;
    };
};

let c = Counter();
c.increment();
c.increment();
print("Count is: " + toString(c.get_count()));

# Pipeline operator example
function double(int n) returns int {
    return n * 2;
};

function add_five(int n) returns int {
    return n + 5;
};

let initial_value = 10;
# Pipeline passes value left to right
let final_value = initial_value |> double |> add_five;
print("Pipeline result: " + toString(final_value));'''
    }
}

def highlight_code(code, language='clyp'):
    """Highlight code using Pygments with enhanced formatting"""
    try:
        # Use our custom Clyp lexer for .clyp files, fallback to Python
        if language == 'clyp':
            lexer = ClypLexer()
        else:
            lexer = get_lexer_by_name(language)
        
        # Enhanced formatter with better styling
        formatter = HtmlFormatter(
            style='github-dark',
            cssclass='highlight',
            wrapcode=True,
            linenos=False,
            noclasses=False
        )
        return highlight(code, lexer, formatter)
    except Exception:
        # Final fallback to text if language not supported
        lexer = get_lexer_by_name('text')
        formatter = HtmlFormatter(
            style='github-dark',
            cssclass='highlight',
            wrapcode=True,
            linenos=False,
            noclasses=False
        )
        return highlight(code, lexer, formatter)

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
    docs_dir = Path('website/docs')
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

@website_bp.route('/')
async def index():
    """Main landing page with syntax highlighting"""
    highlighted_examples = {}
    for key, example in EXAMPLES.items():
        highlighted_examples[key] = {
            **example,
            'highlighted_code': highlight_code(example['code'], 'clyp')
        }
    return await render_template('index.html', examples=highlighted_examples)

@website_bp.route('/examples')
async def examples():
    """Examples page with syntax highlighting"""
    highlighted_examples = {}
    for key, example in EXAMPLES.items():
        highlighted_examples[key] = {
            **example,
            'highlighted_code': highlight_code(example['code'], 'clyp')
        }
    return await render_template('examples.html', examples=highlighted_examples)

@website_bp.route('/docs/')
@website_bp.route('/docs/<slug>')
async def docs(slug=None):
    """Documentation page, rendered from Markdown files in the docs folder."""
    all_docs = get_docs()
    
    if not all_docs:
        pygments_css = HtmlFormatter(style='github-dark').get_style_defs('.highlight')
        no_docs_html = render_markdown("### No Documentation Found\n\nPlease add `.md` files to the `website/docs` directory.")
        return await render_template('docs.html', docs_nav=[], current_doc_html=no_docs_html, current_doc_title="Not Found", current_slug=None, pygments_css=pygments_css)

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
        pygments_css=pygments_css
    )

@website_bp.route('/api/highlight', methods=['POST'])
async def api_highlight():
    """API endpoint to highlight code dynamically"""
    data = await request.get_json()
    code = data.get('code', '')
    language = data.get('language', 'clyp')
    
    highlighted = highlight_code(code, language)
    return jsonify({'highlighted': highlighted})

if __name__ == '__main__':
    from quart import Quart
    app = Quart(__name__)
    app.register_blueprint(website_bp, url_prefix='/') 

    app.run(debug=True, port=5000)