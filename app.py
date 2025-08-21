"""
Clyp Website - A modern, beautiful website for the Clyp programming language.
Built with Quart for async performance and modern web standards.
"""

from quart import Blueprint, Response, redirect, render_template, jsonify, request, abort, Quart
from pygments import highlight
from pygments.lexers import get_lexer_by_name
from pygments.formatters import HtmlFormatter
from clyp_lexer import ClypLexer
import mistune
from mistune.plugins.table import table as plugin_table
from mistune.plugins.formatting import strikethrough as plugin_strikethrough
from mistune.plugins.url import url as plugin_url
from pathlib import Path
import re
import json
import time
import aiohttp
from functools import lru_cache

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
greet(str person) returns str {
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
repeat 3 {
    print("Hello from a repeat loop!");
};'''
    },
    'advanced': {
        'title': 'Advanced Features',
        'description': 'Classes, conditionals, and the powerful pipeline operator.',
        'code': '''# Advanced Clyp features
class Counter {
    int count = 0;
    
    increment(self) returns null {
        self.count = self.count + 1;
    };

    get_count(self) returns int {
        return self.count;
    };
};

let c = Counter();
c.increment();
c.increment();
print("Count is: " + toString(c.get_count()));'''
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

    highlighted = re.sub(r'<div class="line-numbers">.*?</div>', '', highlighted, flags=re.DOTALL)
    highlighted = re.sub(r'<span class="language-badge">.*?</span>', '', highlighted, flags=re.DOTALL)
    return highlighted

def render_markdown(content):
    """Render markdown content to HTML with syntax highlighting and table support."""
    class HighlightRenderer(mistune.HTMLRenderer):
        def block_code(self, code, info=''):
            if info:
                # choose ClypLexer for 'clyp', otherwise Pygments lexer
                if info == 'clyp':
                    lexer = ClypLexer()
                else:
                    lexer = get_lexer_by_name(info, stripall=True)
                formatter = HtmlFormatter(
                    style='github-dark',
                    cssclass='highlight',
                    wrapcode=True,
                    linenos=False,
                    noclasses=False
                )
                return highlight(code, lexer, formatter)
            # fallback for code blocks without language info
            return '<pre><code>' + mistune.escape(code) + '</code></pre>'

    renderer = HighlightRenderer()
    # enable tables, strikethrough (~~) and automatic URL linking
    markdown = mistune.create_markdown(
        renderer=renderer,
        plugins=[plugin_table, plugin_strikethrough, plugin_url]
    )
    return markdown(content)

def get_docs():
    """Load all documentation files from the docs directory, excluding README.md."""
    docs_dir = Path('docs')
    docs = []
    if not docs_dir.is_dir():
        return docs
    
    for md_file in sorted(docs_dir.glob('*.md')):
        if md_file.name.lower() == 'readme.md':
            continue  # Skip README.md
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
    return redirect("https://clypdocs.codesft.dev")

@website_bp.route('/api/highlight', methods=['POST'])
async def api_highlight():
    """API endpoint to highlight code dynamically"""
    data = await request.get_json()
    code = data.get('code', '')
    language = data.get('language', 'clyp')
    
    highlighted = highlight_code(code, language)
    return jsonify({'highlighted': highlighted})

@website_bp.route('/whats-happening')
async def whats_happening():
    """What's Happening page"""
    banner = get_current_banner()
    return await render_template('whats_happening.html', banner=banner)

@website_bp.route('/download')
async def download():
    """Download page"""
    return redirect("https://clyp.codesft.dev/#get-started")

@website_bp.route('/download/win')
@website_bp.route('/download/windows')
async def download_win():
    """Download page for Windows"""
    return redirect("https://github.com/clyplang/clypinstaller/releases/latest/download/install.exe")

@lru_cache(maxsize=1)
def _cached_stats():
    # This function is synchronous, so we just cache the last result and timestamp.
    # Real caching for async would use aiocache or similar, but for simplicity, we use lru_cache and time.
    return {'stats': None, 'timestamp': 0}

@website_bp.route('/api/live_stats')
async def api_live_stats():
    """API endpoint to fetch live stats for PyPI and GitHub, with simple caching."""
    import time
    CACHE_SECONDS = 60
    pypi_package = 'clyp'
    github_user = 'clyplang'
    github_repo = 'clyp'
    now = time.time()
    cached = _cached_stats()
    if cached['stats'] and now - cached['timestamp'] < CACHE_SECONDS:
        return jsonify(cached['stats'])
    stats = {
        'pypi_downloads': 'N/A',
        'github_downloads': 'N/A',
        'github_stars': 'N/A',
        'github_commits': 'N/A',
    }
    async with aiohttp.ClientSession() as session:
        # PyPI downloads
        try:
            async with session.get(f'https://pypistats.org/api/packages/{pypi_package}/recent') as resp:
                data = await resp.json()
                stats['pypi_downloads'] = data.get('data', {}).get('last_month', 'N/A')
        except Exception:
            pass
        # GitHub stars
        try:
            async with session.get(f'https://api.github.com/repos/{github_user}/{github_repo}') as resp:
                data = await resp.json()
                stats['github_stars'] = data.get('stargazers_count', 'N/A')
        except Exception:
            pass
        # GitHub commits
        try:
            async with session.get(f'https://api.github.com/repos/{github_user}/{github_repo}/commits?per_page=1') as resp:
                link = resp.headers.get('Link')
                if link:
                    import re
                    match = re.search(r'&page=(\d+)>; rel="last"', link)
                    if match:
                        stats['github_commits'] = int(match.group(1))
        except Exception:
            pass
        # GitHub release downloads
        try:
            async with session.get(f'https://api.github.com/repos/{github_user}/{github_repo}/releases') as resp:
                releases = await resp.json()
                total = 0
                if isinstance(releases, list):
                    for rel in releases:
                        for asset in rel.get('assets', []):
                            total += asset.get('download_count', 0)
                stats['github_downloads'] = total
        except Exception:
            pass
    # Format numbers with commas
    for k in stats:
        if isinstance(stats[k], int):
            stats[k] = f"{stats[k]:,}"
    # Update cache
    _cached_stats.cache_clear()
    _cached_stats.__wrapped__.stats = stats
    _cached_stats.__wrapped__.timestamp = now
    return jsonify(stats)

@website_bp.route('/release/<version>')
async def release_page(version):
    """Release details page for a specific version/tag."""
    github_user = 'clyplang'
    github_repo = 'clyp'
    banner = get_current_banner()
    # Fetch all releases and find the one matching the version/tag
    release_data = None
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(f'https://api.github.com/repos/{github_user}/{github_repo}/releases') as resp:
                releases = await resp.json()
                for rel in releases:
                    # Match by tag_name or name (case-insensitive, ignore v prefix)
                    tag = rel.get('tag_name', '').lstrip('v')
                    name = rel.get('name', '').lstrip('v')
                    if version == tag or version == name:
                        release_data = rel
                        break
        except Exception:
            release_data = None
    if not release_data:
        abort(404, f"Release '{version}' not found.")
    # Determine release type
    def get_release_type(name):
        n = name.lower()
        if 'alpha' in n:
            return 'alpha'
        if 'beta' in n:
            return 'beta'
        if 'rc' in n or 'release candidate' in n:
            return 'rc'
        return 'release'
    rel_type = get_release_type(release_data.get('name', '') or release_data.get('tag_name', ''))
    # Format version for display (add -[tag] if not a plain release)
    base_version = version
    if rel_type != 'release':
        display_version = f"{base_version}-[{rel_type}]"
    else:
        display_version = base_version
    # Find .tar.gz asset and pip command
    tar_gz_url = None
    for asset in release_data.get('assets', []):
        if asset.get('name', '').endswith('.tar.gz'):
            tar_gz_url = asset.get('browser_download_url')
            break
    # Pip install command
    pip_command = None
    if rel_type == 'release':
        pip_command = f"pip install clyp=={base_version}"
    elif tar_gz_url:
        pip_command = f"pip install {tar_gz_url}"
    # Render markdown for description
    description_html = render_markdown(release_data.get('body', '') or '')
    # Format date
    from datetime import datetime
    published_at = release_data.get('published_at')
    release_date = None
    if published_at:
        try:
            release_date = datetime.strptime(published_at, '%Y-%m-%dT%H:%M:%SZ').strftime('%B %d, %Y')
        except Exception:
            release_date = published_at
    return await render_template(
        'release.html',
        version=display_version,
        base_version=base_version,
        rel_type=rel_type,
        release_date=release_date,
        description_html=description_html,
        pip_command=pip_command,
        tar_gz_url=tar_gz_url,
        github_url=release_data.get('html_url'),
        banner=banner
    )

@website_bp.route('/github')
async def github_redirect():
    """Redirect to the GitHub repository."""
    return Response(
        'Redirecting to GitHub...',
        status=302,
        headers={'Location': 'https://github.com/clyplang/clyp'}
    )

app = Quart(__name__)
app.register_blueprint(
    website_bp,
    static_folder='static',
    static_url_path='/static',
    template_folder='templates'
)

if __name__ == '__main__':
    app.run(debug=DEVELOPMENT, host='0.0.0.0', port=5000)
