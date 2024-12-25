import assert from 'node:assert';
import { parse as parseCjs, init as initCjsParser } from 'cjs-module-lexer';
// @ts-expect-error the types of es-module-lexer are wrong.
// The types field in the exports property in package.json point to a *.d.ts
// file that is in pure esm format so ts thinks that this package is esm only
// despite it being compiled to both esm and cjs
import { parse as parseEs } from 'es-module-lexer';
import MagicString from 'magic-string';
import type { LoaderContext } from '@rspack/core';

export default async function loader(
  this: LoaderContext<any>,
  source: string,
  map: any,
  meta: any
) {
  const callback = this.async();

  try {
    const magicString = new MagicString(source);

    // Trying to parse as ES module
    try {
      // Do NOT remove await here. The types are wrong! It has to be awaited,
      // otherwise it will return a Promise<Promise<...>> when wasm isn't loaded.
      const parseResult = await parseEs(source);
      const namedExportsOrder = (parseResult[1] || [])
        .map((e) => source.substring(e.s, e.e))
        .filter((e) => e !== 'default');

      assert(
        namedExportsOrder.length > 0,
        'No named exports found. Very likely that this is not a ES module.'
      );

      magicString.append(
        `;export const __namedExportsOrder = ${JSON.stringify(
          namedExportsOrder
        )};`
      );
      // Try to parse as CJS module
    } catch {
      await initCjsParser();
      const namedExportsOrder = (parseCjs(source).exports || []).filter(
        (e: string) => e !== 'default' && e !== '__esModule'
      );

      assert(
        namedExportsOrder.length > 0,
        'No named exports found. Very likely that this is not a CJS module.'
      );

      magicString.append(
        `;module.exports.__namedExportsOrder = ${JSON.stringify(
          namedExportsOrder
        )};`
      );
    }

    const generatedMap = magicString.generateMap({ hires: true });

    return callback(null, magicString.toString(), generatedMap, meta);
  } catch (err) {
    return callback(null, source, map, meta);
  }
}
