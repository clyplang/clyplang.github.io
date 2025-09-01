# Clyp Website

A modern, lightweight website for the Clyp programming language built with **Astro**, **React**, and **TypeScript**.

*Available at [clyp.codesft.dev](https://clyp.codesft.dev) and [clyplang.github.io](https://clyplang.github.io)*

## Development

### Prerequisites

- Node.js 20+ and npm
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

## Deployment

### Vercel

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

### GitHub Pages (Current)
Already configured, just push changes to main!

### Manual Deployment

1. **Build the site:**
   ```bash
   npm run build
   ```

2. **Deploy the `dist/` folder** to your hosting provider

### Code Examples
Modify `src/utils/clyp-highlighter.ts` to update code examples or syntax highlighting rules.

### Styling
- Main styles: `public/css/main.css`
- Syntax highlighting: `public/css/syntax.css`
- Component styles: Inline in respective `.astro` files

## Contributing

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

## License

This website is part of the Clyp project and follows the same MIT License.
