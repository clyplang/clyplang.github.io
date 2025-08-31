import type { APIRoute } from 'astro';
import { highlightClyp } from '../../utils/clyp-highlighter';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { code, language = 'clyp' } = body;
    
    if (!code) {
      return new Response(JSON.stringify({ error: 'Code is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // For now, we only support Clyp highlighting
    // In the future, we could add support for other languages
    const highlighted = language === 'clyp' ? highlightClyp(code) : `<pre><code>${code}</code></pre>`;
    
    return new Response(JSON.stringify({ highlighted }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Highlight API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};