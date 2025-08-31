import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  return Response.redirect('https://github.com/clyplang/clyp', 302);
};