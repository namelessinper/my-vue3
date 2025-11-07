import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import esbuild from 'esbuild'
import { createRequire } from 'node:module'

const {
  values: { format },
  positionals,
} = parseArgs({
  allowPositionals: true,
  options: {
    format: {
      type: 'string',
      short: 'f',
      default: 'esm',
    },
  },
})

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const require = createRequire(import.meta.url)

const target = positionals.length ? positionals[0] : 'vue'

const entry = resolve(__dirname, `../packges/${target}/src/index.ts`)
const outfile = resolve(
  __dirname,
  `../packges/${target}/dist/${target}.${format}.js`
)
const pkg = require(`../packges/${target}/package.json`)
console.log(pkg)
esbuild
  .context({
    entryPoints: [entry],
    outfile,
    format, //打包格式 cjs iife esm
    platform: format === 'cjs' ? 'node' : 'browser',
    sourcemap: true,
    bundle: true, //把所有文件打包到一个文件
  })
  .then(ctx => {
    ctx.watch()
  })
