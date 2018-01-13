'use strict'

const cloudConfigureCommand = {
  command: 'cloud:configure',
  usage: 'cloud:configure <env> <provider>',
  description: 'Sets the default environment provider to use via serverless',
  callback: callbackFunction
}

function callbackFunction (args, credentials, command, parameters) {
  const environment = args[3]
  const provider = args[4]

  if (typeof environment === 'undefined' || typeof provider === 'undefined') {
    command.printMessage('Usage: ' + this.usage)
    return
  }

  if (typeof credentials.environments[environment] === 'undefined') {
    command.printMessage('The specified environment configuration does not exist')
    return
  }

  if (typeof credentials.environments[environment].provider[provider] === 'undefined') {
    command.printMessage('The specified provider configuration does not exist')
    return
  }

  const configuration = credentials.environments[environment].provider[provider]
  this.environment = environment
  this.exec = global.exec
  let commandString = ''
  switch (provider) {
    case 'aws':
      commandString = 'yarn sls config credentials --provider ' + provider + ' --key ' + configuration.accessKeyId + ' --secret ' + configuration.secretAccessKey + ' -o'
      break
    case 'azure':
      switch (command.parameters.shell) {
        case 'powershell':
          commandString =
            "[System.Environment]::SetEnvironmentVariable('azureSubId', '" + configuration.subscriptionId + "', [System.EnvironmentVariableTarget]::User);" +
            "[System.Environment]::SetEnvironmentVariable('azureServicePrincipalTenantId', '" + configuration.tenantId + "', [System.EnvironmentVariableTarget]::User);" +
            "[System.Environment]::SetEnvironmentVariable('azureServicePrincipalClientId', '" + configuration.clientId + "', [System.EnvironmentVariableTarget]::User);" +
            "[System.Environment]::SetEnvironmentVariable('azureServicePrincipalPassword', '" + configuration.password + "', [System.EnvironmentVariableTarget]::User)"
          break
        case 'bash':
        default:
          commandString = 'export azureSubId=\'' +
            configuration.subscriptionId +
            '\';export azureServicePrincipalTenantId=\'' + configuration.tenantId +
            '\';export azureServicePrincipalClientId=\'' + configuration.clientId +
            '\';export azureServicePrincipalPassword=\'' + configuration.password + '\''
          break
      }
      break
  }

  command.executeCommand(
    commandString,
    'Set deploy configuration to ' + provider + ' for the ' + environment + ' environment. You may need to restart your terminal/IDE for the configuration to take effect.',
    'Setting cloud configuration failed'
  )
}

module.exports = cloudConfigureCommand
