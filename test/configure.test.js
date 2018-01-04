
const cloudConfigureCommand = require('../configure.js')
let mockCommand = {}
test('cloudConfigureCommand calls exec with credentials and handles all possible exit codes for aws provider', (done) => {
  const mockCredentials = { environments: { test: { provider: 'aws', configuration: { accessKeyId: 'test', secretAccessKey: 'notasecret' } } } }

  const mockExecuteCommand = (commandString, successMessage, errorMessage) => {
    expect(commandString).toEqual('yarn sls config credentials --provider ' + mockCredentials.environments['test'].provider + ' --key ' + mockCredentials.environments['test'].configuration.accessKeyId + ' --secret ' + mockCredentials.environments['test'].configuration.secretAccessKey + ' -o')
    expect(successMessage.length).toBeGreaterThan(0)
    expect(errorMessage.length).toBeGreaterThan(0)
    done()
  }

  mockCommand = {
    executeCommand: mockExecuteCommand
  }

  cloudConfigureCommand.callback(['node', 'scriptname', 'something', 'test'], mockCredentials, mockCommand)
})

test('cloudConfigureCommand calls exec with credentials and handles all possible exit codes for azure provider on powershell', (done) => {
  const mockCredentials = { environments: { test: { provider: 'azure',
    configuration: {
      subscriptionId: 'subscriptionIdString',
      appId: 'appIdString',
      displayName: 'displayNameString',
      tenantId: 'tenantIdString',
      clientId: 'clientIdString',
      password: 'passwordString'
    }
  } } }

  const mockExecuteCommand = (commandString, successMessage, errorMessage) => {
    expect(commandString).toEqual(
      "[System.Environment]::SetEnvironmentVariable('azureSubId', '" + mockCredentials.environments.test.configuration.subscriptionId + "', [System.EnvironmentVariableTarget]::User);" +
      "[System.Environment]::SetEnvironmentVariable('azureServicePrincipalTenantId', '" + mockCredentials.environments.test.configuration.tenantId + "', [System.EnvironmentVariableTarget]::User);" +
      "[System.Environment]::SetEnvironmentVariable('azureServicePrincipalClientId', '" + mockCredentials.environments.test.configuration.clientId + "', [System.EnvironmentVariableTarget]::User);" +
      "[System.Environment]::SetEnvironmentVariable('azureServicePrincipalPassword', '" + mockCredentials.environments.test.configuration.password + "', [System.EnvironmentVariableTarget]::User)"
    )
    expect(successMessage.length).toBeGreaterThan(0)
    expect(errorMessage.length).toBeGreaterThan(0)
    done()
  }

  mockCommand = {
    executeCommand: mockExecuteCommand,
    parameters: { shell: 'powershell' }
  }

  cloudConfigureCommand.callback(['node', 'scriptname', 'something', 'test'], mockCredentials, mockCommand)
})

test('cloudConfigureCommand calls exec with credentials and handles all possible exit codes for azure provider on bash', (done) => {
  const mockCredentials = { environments: { test: { provider: 'azure',
    configuration: {
      subscriptionId: 'subscriptionIdString',
      appId: 'appIdString',
      displayName: 'displayNameString',
      tenantId: 'tenantIdString',
      clientId: 'clientIdString',
      password: 'passwordString'
    }
  } } }

  const mockExecuteCommand = (commandString, successMessage, errorMessage) => {
    expect(commandString).toEqual(
      'export azureSubId=\'' +
      mockCredentials.environments.test.configuration.subscriptionId +
      '\';export azureServicePrincipalTenantId=\'' + mockCredentials.environments.test.configuration.tenantId +
      '\';export azureServicePrincipalClientId=\'' + mockCredentials.environments.test.configuration.clientId +
      '\';export azureServicePrincipalPassword=\'' + mockCredentials.environments.test.configuration.password + '\''
    )
    expect(successMessage.length).toBeGreaterThan(0)
    expect(errorMessage.length).toBeGreaterThan(0)
    done()
  }

  mockCommand = {
    executeCommand: mockExecuteCommand,
    parameters: { shell: 'bash' }
  }

  cloudConfigureCommand.callback(['node', 'scriptname', 'something', 'test'], mockCredentials, mockCommand)
})

test('cloudConfigureCommand will default optional argument to dev if not provided', (done) => {
  const mockCredentials = { environments: { dev: { provider: 'aws', configuration: { accessKeyId: 'test', secretAccessKey: 'notasecret' } } } }

  const mockExecuteCommand = (commandString, successMessage, errorMessage) => {
    expect(cloudConfigureCommand.environment).toEqual('dev')
    done()
  }

  mockCommand = {
    executeCommand: mockExecuteCommand
  }

  cloudConfigureCommand.callback(['node', 'scriptname', 'something', undefined], mockCredentials, mockCommand)
})

test('cloudConfigureCommand will throw an error if provider not specified in configuration', () => {
  const mockCredentials = { environments: { dev: { provider: undefined, configuration: { accessKeyId: 'test', secretAccessKey: 'notasecret' } } } }

  mockCommand = {
    executeCommand: undefined
  }

  expect(() => cloudConfigureCommand.callback(['node', 'scriptname', 'something', ''], mockCredentials, mockCommand)).toThrow()
})
