//import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { CodepipelineStack } from './codepipeline-stack';

export interface DevStageProps extends cdk.StageProps {
}

export class DevStage extends cdk.Stage {
  constructor(scope: cdk.Construct, id: string, props: DevStageProps) {
    super(scope, id, props);

    // Add stack that you want to delivery
    // magicmall codepipeline
    new CodepipelineStack(this, 'magic-pipeline', { project: 'magicmall', appName: 'magic' } );
    new CodepipelineStack(this, 'mmagic-pipeline', { project: 'magicmall', appName: 'mmagic' } );

    // familymall codepipeline
    new CodepipelineStack(this, 'family-pipeline', { project: 'magicmall', appName: 'family' } );
    new CodepipelineStack(this, 'mfamily-pipeline', { project: 'magicmall', appName: 'mfamily' } );

    new CodepipelineStack(this, 'mcmall-pipeline', { project: 'magicmall', appName: 'mcmall' } );
    new CodepipelineStack(this, 'mmcmall-pipeline', { project: 'magicmall', appName: 'mmcmall' } );

    new CodepipelineStack(this, 'staff-pipeline', { project: 'magicmall', appName: 'staff' } );
    new CodepipelineStack(this, 'api-pipeline', { project: 'magicmall', appName: 'api' } );

    new CodepipelineStack(this, 'partner-pipeline', { project: 'magicmall', appName: 'partner' } );
    new CodepipelineStack(this, 'mpartner-pipeline', { project: 'magicmall', appName: 'mpartner' } );
  }
}