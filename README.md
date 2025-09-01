# Clyp Website

A modern, lightweight website for the Clyp programming language built with **Astro**, **React**, and **TypeScript**.

*Available at [clyp.codesft.dev](https://clyp.codesft.dev)*

## 🚀 Architecture

This site has been modernized from Python/Quart to Astro for better performance and developer experience:

- **Astro**: Static site generation with server-side rendering
- **React**: Interactive components for tabs, live stats, and dynamic content
- **TypeScript**: Type safety and better developer experience
- **Custom Clyp Highlighter**: JavaScript implementation of syntax highlighting
- **Vercel**: Serverless deployment with edge functions

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── CodeExamples.tsx # Interactive code examples with tabs
│   └── LiveStats.tsx    # Live GitHub/PyPI statistics
├── layouts/
│   └── Layout.astro     # Main site layout
├── pages/
│   ├── api/             # API endpoints
│   │   ├── live_stats.ts
│   │   ├── highlight.ts
│   │   └── *.ts
│   ├── index.astro      # Homepage
│   ├── examples.astro   # Examples page
│   └── *.astro          # Other pages
├── styles/              # CSS stylesheets
├── utils/
│   └── clyp-highlighter.ts # Custom syntax highlighter
public/                  # Static assets
├── css/                 # Stylesheets
├── js/                  # Client-side JavaScript
└── banner.json          # Site banner configuration
```

## 🛠️ Development

### Prerequisites

- Node.js 18+ and npm
- Git

### Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/CodeSoftGit/clypsite.git
   cd clypsite
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

## 🎨 Features

### Interactive Components
- **Tab-based code examples** with syntax highlighting
- **Live statistics** from GitHub and PyPI APIs
- **Responsive design** for all screen sizes
- **Dark/light theme** toggle

### Custom Clyp Syntax Highlighting
The site includes a custom JavaScript implementation of Clyp syntax highlighting that supports:
- Keywords (`function`, `class`, `returns`, etc.)
- Type annotations (`int`, `str`, `list`, etc.)
- Built-in functions (`print`, `len`, `chunk`, etc.)
- Comments and strings
- Numbers and operators

### API Endpoints
- `/api/live_stats` - GitHub/PyPI statistics
- `/api/highlight` - Code highlighting service
- `/api/docs` - Redirect to documentation
- `/api/github` - Redirect to GitHub repository

## 🚀 Deployment

### Vercel (Recommended)

The site is configured for seamless Vercel deployment:

1. **Connect to Vercel:**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Build settings:**
   - Framework: Astro
   - Build command: `npm run build`
   - Output directory: `dist`

3. **Environment variables:** None required for basic functionality

### Manual Deployment

1. **Build the site:**
   ```bash
   npm run build
   ```

2. **Deploy the `dist/` folder** to your hosting provider

## 🔧 Configuration

### Banner Messages
Edit `public/banner.json` to configure rotating banner messages:

```json
[
  {
    "text": "🚀 Clyp 2.0 is here! Check it out and get started today.",
    "link": "https://clypdocs.codesft.dev/",
    "link_text": "View Documentation"
  }
]
```

### Code Examples
Modify `src/utils/clyp-highlighter.ts` to update code examples or syntax highlighting rules.

### Styling
- Main styles: `public/css/main.css`
- Syntax highlighting: `public/css/syntax.css`
- Component styles: Inline in respective `.astro` files

## 📊 Performance

The new Astro-based architecture provides significant improvements:

- **Lightweight**: Minimal JavaScript bundle size
- **Fast loading**: Static generation with selective hydration
- **SEO-friendly**: Server-side rendering for all pages
- **Edge deployment**: Serverless functions on Vercel

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test locally: `npm run dev`
5. Build to verify: `npm run build`
6. Submit a pull request

### Code Style

- Use TypeScript for all new code
- Follow existing component patterns
- Maintain responsive design principles
- Test on multiple screen sizes

## 📄 License

This website is part of the Clyp project and follows the same MIT License.

## 🔗 Links

- **Clyp Language:** [GitHub](https://github.com/clyplang/clyp)
- **Documentation:** [clypdocs.codesft.dev](https://clypdocs.codesft.dev)
- **Package:** [PyPI](https://pypi.org/project/clyp/)
- **Website:** [clyp.codesft.dev](https://clyp.codesft.dev)
