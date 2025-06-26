# Clyp Website

A modern, beautiful website for the Clyp programming language built with Quart.
*Available at [codesoft.is-a.dev/clyp](https://codesoft.is-a.dev/clyp)*

## Styling

- Main styles: `static/css/main.css`
- Syntax highlighting: `static/css/syntax.css`
- Custom colors and variables are defined in CSS custom properties

## JavaScript

- Main functionality: `static/js/main.js`
- Includes code copying, animations, and interactive features

## Development

The website uses:

- **Quart**: Async Python web framework
- **Jinja2**: Template engine
- **Pygments**: Syntax highlighting
- **Mistune**: Markdown rendering
- **Modern CSS**: Custom properties, Grid, Flexbox
- **Vanilla JavaScript**: No external dependencies

## Deployment

For production deployment:

1. Set environment variables:

   ```bash
   export QUART_ENV=production
   ```

2. Use a production WSGI server like Hypercorn:

   ```bash
   pip install hypercorn
   hypercorn app:app --bind 0.0.0.0:8000
   ```

## Contributing

1. Make changes to the code
2. Test locally
3. Submit a pull request

## License

This website is part of the Clyp project and follows the same MIT License.
