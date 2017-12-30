# SCEPTER-command-cloud
SCEPTER plugin command to configure cloud services

[![scepter-logo](http://res.cloudinary.com/source-4-society/image/upload/v1514622047/scepter_hzpcqt.png)](https://github.com/source4societyorg/SCEPTER-core)

[![js-standard-style](https://cdn.rawgit.com/standard/standard/master/badge.svg)](http://standardjs.com)
[![Build Status](https://travis-ci.org/source4societyorg/SCEPTER-command-cloud.svg?branch=master)](https://travis-ci.org/source4societyorg/SCEPTER-command-cloud)
[![Serverless](http://public.serverless.com/badges/v1.svg)](http://serverless.com)

# Installation

1. Setup a SCEPTER project by following the instructions from [SCEPTER-Core](https://github.com/source4societyorg/SCEPTER-core).
2. Be sure to recursively install the SCEPTER-Core boilerplates submodules. You can do this by cloning SCEPTER-Core with the --recursive flag or by issuing the `git submodule update --init` command from the project directory.
3. Execute `node bin/scepter.js list:all` to display a list of installed commands to verify this command has been installed.

# Commands

`cloud:configure [<env>]`

This command will perform an `sls config credentials` command with provider, key and secret flags set to those defined in the SCEPTER config credentials file located in `config/credentials.json` of your project directory. See [Serverless Framework: Using AWS Credentials](https://serverless.com/framework/docs/providers/aws/guide/credentials#using-aws-profiles) for an example using AWS, although other provides are supported.
