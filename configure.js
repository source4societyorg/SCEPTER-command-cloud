'use strict'

const cloudConfigureCommand = {
  command: 'cloud:configure',
  usage: 'cloud:configure [<env>]',
  description: 'Sets the default cloud service provider configuration to use via serverless',
  callback: callbackFunction
}

function callbackFunction (args, credentials, command, parameters) {
  const environment = args[3] || 'dev'
  const provider = credentials.environments[environment].provider
  const configuration = credentials.environments[environment].configuration
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
    default:
      throw new Error('Provider not specified in credentials.json')
  }

  command.executeCommand(
    commandString,
    'Set deploy configuration to ' + provider + ' for the ' + environment + ' environment. You may need to restart your terminal/IDE for the configuration to take effect.',
    'Setting cloud configuration failed'
  )
}

module.exports = cloudConfigureCommand
