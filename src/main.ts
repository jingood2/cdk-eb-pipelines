import { App, Construct, Stack, StackProps } from '@aws-cdk/core';
import { envVars } from './lib/config';
import { InfraPipelineStack } from './lib/infra-pipeline-stack';

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    // define resources here...
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new MyStack(app, 'my-stack-dev', { env: devEnv });
// new MyStack(app, 'my-stack-prod', { env: prodEnv });

new InfraPipelineStack(app, `${envVars.REPO_NAME}-stack`, { env: devEnv } );
