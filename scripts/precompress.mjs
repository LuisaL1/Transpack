// Comprime en el build los archivos de texto de dist/ (.br y .gz al lado de cada
// uno). server/server.mjs entrega la versión que acepte el navegador, así el
// servidor no comprime en cada visita. Se ejecuta al final de `pnpm build`.
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { brotliCompressSync, constants, gzipSync } from "node:zlib";

const DIST = "dist";
const TEXT = /\.(html|js|mjs|css|svg|json|xml|txt|webmanifest)$/;
const files = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p) : [p];
  });

let n = 0;
for (const f of files(DIST)) {
  if (!TEXT.test(f)) continue;
  const data = readFileSync(f);
  // Los archivos muy pequeños no ganan nada
  if (data.length < 1024) continue;
  writeFileSync(
    `${f}.br`,
    brotliCompressSync(data, {
      params: {
        [constants.BROTLI_PARAM_QUALITY]: 11,
        [constants.BROTLI_PARAM_SIZE_HINT]: data.length,
      },
    }),
  );
  writeFileSync(`${f}.gz`, gzipSync(data, { level: 9 }));
  n++;
}
console.log(`Comprimidos ${n} archivos de ${DIST}/ (.br y .gz)`);
