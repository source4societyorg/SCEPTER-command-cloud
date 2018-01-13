
const cloudConfigureCommand = require('../configure.js')
const immutable = require('immutable')
let mockCommand = {}
const mockPrintMessage = () => 'test'
test('cloudConfigureCommand calls exec with credentials and handles all possible exit codes for aws provider', (done) => {
  const mockCredentials = immutable.fromJS({ environments: { test: { provider: { aws: { accessKeyId: 'test', secretAccessKey: 'notasecret' } } } } })
  const mockExecuteCommand = (commandString, successMessage, errorMessage) => {
    expect(commandString).toEqual('yarn sls config credentials --provider aws --key ' + mockCredentials.getIn(['environments', 'test', 'provider', 'aws', 'accessKeyId']) + ' --secret ' + mockCredentials.getIn(['environments', 'test', 'provider', 'aws', 'secretAccessKey']) + ' -o')
    expect(successMessage.length).toBeGreaterThan(0)
    expect(errorMessage.length).toBeGreaterThan(0)
    done()
  }

  mockCommand = {
    executeCommand: mockExecuteCommand,
    printMessage: mockPrintMessage
  }

  cloudConfigureCommand.callback([undefined, undefined, undefined, 'test', 'aws'], mockCredentials, mockCommand)
})

test('cloudConfigureCommand calls exec with credentials and handles all possible exit codes for azure provider on powershell', (done) => {
  const mockCredentials = immutable.fromJS({ environments: { test: { provider: { azure: {
    subscriptionId: 'subscriptionIdString',
    appId: 'appIdString',
    displayName: 'displayNameString',
    tenantId: 'tenantIdString',
    clientId: 'clientIdString',
    password: 'passwordString'
  }
  } } } })

  const mockExecuteCommand = (commandString, successMessage, errorMessage) => {
    expect(commandString).toEqual(
      "[System.Environment]::SetEnvironmentVariable('azureSubId', '" + mockCredentials.getIn(['environments', 'test', 'provider', 'azure', 'subscriptionId']) + "', [System.EnvironmentVariableTarget]::User);" +
      "[System.Environment]::SetEnvironmentVariable('azureServicePrincipalTenantId', '" + mockCredentials.getIn(['environments', 'test', 'provider', 'azure', 'tenantId']) + "', [System.EnvironmentVariableTarget]::User);" +
      "[System.Environment]::SetEnvironmentVariable('azureServicePrincipalClientId', '" + mockCredentials.getIn(['environments', 'test', 'provider', 'azure', 'clientId']) + "', [System.EnvironmentVariableTarget]::User);" +
      "[System.Environment]::SetEnvironmentVariable('azureServicePrincipalPassword', '" + mockCredentials.getIn(['environments', 'test', 'provider', 'azure', 'password']) + "', [System.EnvironmentVariableTarget]::User)"
    )
    expect(successMessage.length).toBeGreaterThan(0)
    expect(errorMessage.length).toBeGreaterThan(0)
    done()
  }

  mockCommand = {
    executeCommand: mockExecuteCommand,
    parameters: { shell: 'powershell' },
    printMessage: mockPrintMessage
  }

  cloudConfigureCommand.callback([undefined, undefined, undefined, 'test', 'azure'], mockCredentials, mockCommand)
})

test('cloudConfigureCommand calls exec with credentials and handles all possible exit codes for azure provider on bash', (done) => {
  const mockCredentials = immutable.fromJS({ environments: { test: { provider: { azure: {
    subscriptionId: 'subscriptionIdString',
    appId: 'appIdString',
    displayName: 'displayNameString',
    tenantId: 'tenantIdString',
    clientId: 'clientIdString',
    password: 'passwordString'
  }
  } } } })

  const mockExecuteCommand = (commandString, successMessage, errorMessage) => {
    expect(commandString).toEqual(
      'export azureSubId=\'' +
      mockCredentials.getIn(['environments', 'test', 'provider', 'azure', 'subscriptionId']) +
      '\';export azureServicePrincipalTenantId=\'' + mockCredentials.getIn(['environments', 'test', 'provider', 'azure', 'tenantId']) +
      '\';export azureServicePrincipalClientId=\'' + mockCredentials.getIn(['environments', 'test', 'provider', 'azure', 'clientId']) +
      '\';export azureServicePrincipalPassword=\'' + mockCredentials.getIn(['environments', 'test', 'provider', 'azure', 'password']) + '\''
    )
    expect(successMessage.length).toBeGreaterThan(0)
    expect(errorMessage.length).toBeGreaterThan(0)
    done()
  }

  mockCommand = {
    executeCommand: mockExecuteCommand,
    parameters: { shell: 'bash' },
    printMessage: mockPrintMessage
  }

  cloudConfigureCommand.callback([undefined, undefined, undefined, 'test', 'azure'], mockCredentials, mockCommand)
})

test('cloudConfigureCommand will print usage if provider not specified in configuration', (done) => {
  const mockCredentials = immutable.fromJS({ environments: { test: { provider: { aws: { accessKeyId: 'test', secretAccessKey: 'notasecret' } } } } })

  mockCommand = {
    executeCommand: undefined,
    printMessage: (message) => {
      expect(message).toEqual('Usage: ' + cloudConfigureCommand.usage)
      done()
    }
  }

  cloudConfigureCommand.callback([undefined, undefined, undefined, 'test', undefined], mockCredentials, mockCommand)
})

test('cloudConfigureCommand will print usage if environment is not specified in credentials', (done) => {
  const mockCredentials = immutable.fromJS({ environments: { } })

  mockCommand = {
    executeCommand: undefined,
    printMessage: (message) => {
      expect(message).toEqual('The specified environment configuration does not exist')
      done()
    }
  }

  cloudConfigureCommand.callback([undefined, undefined, undefined, 'test', 'test'], mockCredentials, mockCommand)
})

test('cloudConfigureCommand will print usage if provider is not specified in credentials', (done) => {
  const mockCredentials = immutable.fromJS({ environments: { test: { provider: { } } } })

  mockCommand = {
    executeCommand: undefined,
    printMessage: (message) => {
      expect(message).toEqual('The specified provider configuration does not exist')
      done()
    }
  }

  cloudConfigureCommand.callback([undefined, undefined, undefined, 'test', 'test'], mockCredentials, mockCommand)
})
