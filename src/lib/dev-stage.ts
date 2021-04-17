//import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { CodepipelineStack } from './codepipeline-stack';

export interface DevStageProps extends cdk.StageProps {
}

export class DevStage extends cdk.Stage {
  constructor(scope: cdk.Construct, id: string, props: DevStageProps) {
    super(scope, id, props);

    // Add stack that you want to delivery
    new CodepipelineStack(this, 'familymall', { project: 'magicmall', appName: 'familymall' } );

    new CodepipelineStack(this, 'mfamilymall', { project: 'magicmall', appName: 'mfamilymall' } );

  }
}