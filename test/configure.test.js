const cloudConfigureCommand = require('../configure.js')
test('cloudConfigureCommand calls exec with credentials and handles all possible exit codes', (done)=>{
  let callCount = 0;
  const mockCredentials = { environments: { test: { provider: 'test', configuration: { accessKeyId: 'test', secretAccessKey: 'notasecret' } } } }

  const mockExec = (commandString) => {
    expect(commandString).toEqual('yarn sls config credentials --provider ' + mockCredentials.environments['test'].provider + ' --key ' + mockCredentials.environments['test'].configuration.accessKeyId + ' --secret ' + mockCredentials.environments['test'].configuration.secretAccessKey + ' -o')
    return mockProcess
  }

  const checkIfDone = (count) => count === 6 ? done() : null;

  const mockOn = (event, callback) => {
    callback(callCount > 3 ? 1 : 0);
    callCount++;
    checkIfDone(callCount)
  }

  const mockProcess = {
    stderr: { on: mockOn },
    stdout: { on: mockOn },
    on: mockOn
  }

  global.exec = mockExec

  cloudConfigureCommand.callback(['node', 'scriptname', 'something', 'test'], mockCredentials)
  cloudConfigureCommand.callback(['node', 'scriptname', 'something', 'test'], mockCredentials)
})

test('cloudConfigureCommand will default optional argument to dev if not provided', (done)=>{
  const mockCredentials = { environments: { dev: { provider: 'test', configuration: { accessKeyId: 'test', secretAccessKey: 'notasecret' } } } }

  const mockExec = (commandString) => {
    expect(cloudConfigureCommand.environment).toEqual('dev')
    return mockProcess
  }

  const mockOn = (event, callback) => {
    done()
  }

  const mockProcess = {
    stderr: { on: mockOn },
    stdout: { on: mockOn },
    on: mockOn
  }

  global.exec = mockExec
  
  cloudConfigureCommand.callback(['node', 'scriptname', 'something', undefined], mockCredentials)
})
