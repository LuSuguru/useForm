const path = require('path')
const typescript = require('rollup-plugin-typescript')
const nodeResolve = require('rollup-plugin-node-resolve')
const common = require('rollup-plugin-commonjs')
const json = require('rollup-plugin-json')
const { uglify } = require('rollup-plugin-uglify')

const input = path.resolve(__dirname, './src/index.ts')
const output = {
  es: {
    file: path.resolve(__dirname, './es/index.js'),
    format: 'es'
  },
  iife: {
    file: path.resolve(__dirname, './build/wx-login.js'),
    format: 'iife',
    name: 'WxLogin'
  }
}

const plugins = [
  json(),
  nodeResolve({
    browser: true
  }),
  common(),
  typescript({
    lib: ['es2017', 'dom'],
    target: 'es5',
    include: 'src/**/*'
  })
]

const esConfig = {
  input,
  output: output.es,
  plugins: [...plugins]
}

const iifeConfig = {
  input,
  output: output.iife,
  plugins: [...plugins, uglify()]
}

module.exports = { esConfig, iifeConfig }