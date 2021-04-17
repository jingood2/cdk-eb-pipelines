import * as codecommit from '@aws-cdk/aws-codecommit';
import { Artifact } from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import * as cdk from '@aws-cdk/core';
import { CdkPipeline, SimpleSynthAction } from '@aws-cdk/pipelines';
import { envVars } from './config';
import { DevStage } from './dev-stage';
//import { ProdStage } from './prod-stage';

export interface InfraPipelineStackProps extends cdk.StackProps {

}

export class InfraPipelineStack extends cdk.Stack {

  pipeline: CdkPipeline;
  sourceArtifact: Artifact;
  cloudAssemblyArtifact: Artifact;
  sourceAction: codepipeline_actions.CodeCommitSourceAction;


  constructor(scope: cdk.Construct, id: string, props: InfraPipelineStackProps) {
    super(scope, id, props);

    this.sourceArtifact = new Artifact();
    this.cloudAssemblyArtifact = new Artifact();

    const repo = new codecommit.Repository(this, 'Repo', {
      repositoryName: envVars.REPO_NAME,
      description: 'cdk infra delivery pipeline repository',
    });

    this.sourceAction = new codepipeline_actions.CodeCommitSourceAction({
      actionName: 'codecommit',
      output: this.sourceArtifact,
      branch: 'main',
      trigger: codepipeline_actions.CodeCommitTrigger.EVENTS,
      repository: repo,
    });

    this.pipeline = new CdkPipeline(this, 'pipeline', {
      pipelineName: `${envVars.REPO_NAME}-pipeline`,
      cloudAssemblyArtifact: this.cloudAssemblyArtifact,
      sourceAction: this.sourceAction,
      synthAction: SimpleSynthAction.standardYarnSynth({
        sourceArtifact: this.sourceArtifact,
        cloudAssemblyArtifact: this.cloudAssemblyArtifact,
        installCommand: 'yarn install --frozen-lockfile && yarn projen',
        buildCommand: 'yarn build',
      }),
    });

    /* const devVpc = ec2.Vpc.fromLookup(this, 'DEVVPC', {
      vpcId: envVars.DEV_STAGE_ENV.VPC_ID,
    });
    */

    this.pipeline.addApplicationStage(new DevStage(this, 'dev', {
      env: { account: '955697143463', region: 'ap-northeast-2' },
    }));

    /*
    devStage.addActions(new codepipeline_actions.ManualApprovalAction({
      actionName: 'ManualApproval',
      runOrder: devStage.nextSequentialRunOrder(),
    }));

    const prodVpc = ec2.Vpc.fromLookup(this, 'PRODVPC', {
      vpcId: envVars.PROD_STAGE_ENV.VPC_ID,
    });

    this.pipeline.addApplicationStage(new ProdStage(this, 'prod', {
      vpc: prodVpc, env: { account: '955697143463', region: 'ap-northeast-2' },
    })); */
  }
}