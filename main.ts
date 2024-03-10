import { serveDir, ServeDirOptions } from 'https://deno.land/std@0.219.1/http/file_server.ts';

const ENCODE = new TextEncoder();

export async function handler(req: Request, opts?: ServeDirOptions) {
  const { pathname } = new URL(req.url);
  const res = await serveDir(req, opts);

  if (res.ok && res.body && pathname.endsWith('.d.ts')) {
    const text = await res.text();
    const bytes = ENCODE.encode(text.replaceAll('.js', '.d.ts'));
    res.headers.set('content-type', 'application/typescript');
    res.headers.set('content-length', bytes.byteLength.toString());
    return new Response(bytes, res);
  }

  if (res.ok && pathname.endsWith('.js')) {
    const types = new URL(pathname.slice(0, -3) + '.d.ts', req.url).toString();
    res.headers.set('x-typescript-types', types);
  }

  return res;
}

if (import.meta.main) {
  Deno.serve((req) => handler(req));
}
