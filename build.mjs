/**
 * build.mjs — Gera o site em docs/ (pasta publicada pelo GitHub Pages).
 *
 *   npm install && npm run build
 *
 * Saída: docs/index.html, docs/assets/app.js, docs/assets/app.css e o conteúdo de public/.
 * Todos os caminhos são relativos, então o site funciona em
 * https://higorlucas125.github.io/xai.github.io/ e em qualquer servidor local.
 */
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
// Permite rodar o build com um esbuild instalado em outro lugar (ESBUILD_PATH)
const esbuild = await import(process.env.ESBUILD_PATH ?? require.resolve('esbuild'))

const SAIDA = 'docs'
rmSync(SAIDA, { recursive: true, force: true })
mkdirSync(`${SAIDA}/assets`, { recursive: true })

await esbuild.build({
  entryPoints: { app: 'src/main.jsx' },
  bundle: true,
  minify: true,
  format: 'esm',
  target: ['es2020'],
  jsx: 'automatic',
  outdir: `${SAIDA}/assets`,
  nodePaths: process.env.NODE_PATH ? process.env.NODE_PATH.split(':') : [],
  define: { 'process.env.NODE_ENV': '"production"' },
  legalComments: 'none',
  logLevel: 'warning',
})

cpSync('public', SAIDA, { recursive: true })
writeFileSync(`${SAIDA}/.nojekyll`, '')
writeFileSync(`${SAIDA}/index.html`, `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>XAI na defumação de mortadela — previsão de quebra</title>
    <meta name="description" content="Simulador da quebra na defumação de mortadela com Random Forest e explicações (XAI). O modelo roda no navegador." />
    <meta name="theme-color" content="#0D0F14" />
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%230D0F14'/><text x='16' y='22' font-size='16' text-anchor='middle' fill='%23F59E0B' font-family='monospace'>%25</text></svg>" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="./assets/app.css" />
  </head>
  <body>
    <div id="root"></div>
    <noscript>Este site precisa de JavaScript para executar o modelo.</noscript>
    <script type="module" src="./assets/app.js"></script>
  </body>
</html>
`)
console.log('Site gerado em docs/')
