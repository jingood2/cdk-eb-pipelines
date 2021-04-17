import { App, Construct, Stack, StackProps } from '@aws-cdk/core';
import { envVars, validateEnvVariables } from './lib/config';
import { InfraPipelineStack } from './lib/infra-pipeline-stack';

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    // define resources here...
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT || process.env.CDK_DEPLOY_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION || process.env.CDK_DEPLOY_ACCOUNT,
};

validateEnvVariables();
const app = new App();

new InfraPipelineStack(app, `${envVars.REPO_NAME}-stack`, { env: devEnv } );
