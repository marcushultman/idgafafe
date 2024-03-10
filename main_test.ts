import {
  assert,
  assertEquals,
  assertExists,
  assertFalse,
} from 'https://deno.land/std@0.218.0/assert/mod.ts';
import { handler } from './main.ts';

Deno.test(async function typesHeaderTest() {
  const res = await handler(new Request('http://dummy/data/index.js'), { quiet: true });
  assertEquals(res.headers.get('x-typescript-types'), 'http://dummy/data/index.d.ts');
  assertExists(res.body);
  await res.body.cancel();
});

Deno.test(async function typesFileTest() {
  const res = await handler(new Request('http://dummy/data/index.d.ts'), { quiet: true });
  const text = await res.text();
  assertFalse(res.headers.has('x-typescript-types'));
  assertFalse(text.includes('foo.js'));
  assert(text.includes('foo.d.ts'));
});
