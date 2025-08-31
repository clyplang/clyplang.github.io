import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  return Response.redirect('https://clyp.codesft.dev/#get-started', 302);
};