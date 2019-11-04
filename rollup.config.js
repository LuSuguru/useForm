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
    file: path.resolve(__dirname, './build/index.js'),
    format: 'iife',
    name: 'useForm',
    globals:{
      react:'react'
    }
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

const external = ['react']

const esConfig = {
  input,
  output: output.es,
  plugins: [...plugins],
  external
}

const iifeConfig = {
  input,
  output: output.iife,
  plugins: [...plugins, uglify()],
  external
}

module.exports = { esConfig, iifeConfig }