'use strict'
const { exec } = require('child_process')

global.exec = exec

const cloudConfigureCommand = {
  command: 'cloud:configure',
  usage: 'cloud:configure [<env>]',
  description: 'Sets the default cloud service provider configuration to use via serverless',
  callback: callbackFunction
}

function callbackFunction (args, credentials) {
  const environment = args[3] || 'dev'
  const provider = credentials.environments[environment].provider
  const configuration = credentials.environments[environment].configuration
  this.environment = environment
  this.exec = global.exec
  const process = cloudConfigureCommand.exec('yarn sls config credentials --provider ' + provider + ' --key ' + configuration.accessKeyId + ' --secret ' + configuration.secretAccessKey + ' -o')

  process.stderr.on('data', function (data) {
    console.log(data)
  })

  process.stdout.on('data', function (data) {
    console.log(data)
  })

  process.on('exit', function (code, signal) {
    if (code === 0) {
      console.log('Set deploy configuration to ' + provider + ' for the ' + environment + ' environment.')
    } else {
      console.log('Command exited with non-zero exit code')
    }
  })
}

module.exports = cloudConfigureCommand
