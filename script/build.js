const rollup = require('rollup')
const compose = require('koa-compose')
const ora = require('ora')
const configMap = require('../rollup.config')
const { logger } = require('./util')
const { argv } = require('yargs')

function compileTask(configList) {
  const taskList = Object.keys(configList).map(name => wrapTask(configList[name], name))

  compose(taskList)().then(function () {
    logger('全部成功', { status: 'SUCCESS' })
  }).catch(function (err) {
    console.log(err)
  })
}

function wrapTask(config, name) {
  const inputOptions = config
  const outputOptions = config.output

  return async function (ctx, next) {
    const bundle = await rollup.rollup(inputOptions)

    const spinner = ora(logger(`开始编译 ${name}模块`))
    spinner.start()

    await bundle.generate(outputOptions)
    await bundle.write(outputOptions)

    spinner.stop()
    logger(`编译成功 ${name}模块`, { status: 'SUCCESS' })

    await next()
  }
}

function watchTask(config) {
  const watcher = rollup.watch({
    ...config,
    watch: {
      include: 'src/**'
    }
  })
  watcher.on('event', ({ code, error }) => {
    switch (code) {
      case 'START':
        logger('监听到文件变化')
        break
      case 'END':
        logger('完成构建', { status: 'SUCCESS' })
        break
      case 'ERROR':
        logger('构建时遇到错误', { status: 'WARN' })
        break
      case 'FATAL':
        logger(error, { status: 'ERROR' })
    }
  })
}

if (argv.watch) {
  watchTask(configMap.esConfig)
} else {
  compileTask(configMap)
}


