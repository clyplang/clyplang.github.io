import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  return Response.redirect('https://clypdocs.codesft.dev', 302);
};