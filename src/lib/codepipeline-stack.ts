import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
//import { envVars } from '../config';
import { CodebuildProject } from './codebuild-project';
import { envVars } from './config';
import * as moment from 'moment';

export interface CodepipelineStackProps extends cdk.StackProps {
  project: string;
  appName: string;
  stage?: string;
}

export class CodepipelineStack extends cdk.Stack {

  constructor(scope: cdk.Construct, id: string, props: CodepipelineStackProps) {
    super(scope, id, props);

    // ToDo : apply s3 bucket lifecycle
    /* var bucket = s3.Bucket.fromBucketName(this, 'BucketByName', `${props.project}-${props.appName}`);
    if (bucket.bucketName === undefined) {
      bucket = new s3.Bucket(this, 'Bucket', { bucketName: `${props.project}-${props.appName}`, versioned: true });
    } */
    const bucket = new s3.Bucket(this, 'Bucket', { bucketName: `${props.project}-${props.appName}`, versioned: true });

    /**
     * 1. Create CodePipeline
     */
    const pipeline = new codepipeline.Pipeline(this, 'Codepipeline');

    /**
      * 1.1 Add Source Stage to pipeline
      */
    const sourceStage = pipeline.addStage({
      stageName: 'Source',
    });

    const sourceOutput = new codepipeline.Artifact('Source');

    const sourceAction = new codepipeline_actions.S3SourceAction({
      actionName: 'S3',
      //bucket: s3.Bucket.fromBucketName(this, 'Bucket', `${props.project}-${props.appName}`),
      bucket: bucket,
      output: sourceOutput,
      bucketKey: `${props.appName}.war`,
      trigger: codepipeline_actions.S3Trigger.POLL,
    });

    const BUILD_VERSION = moment().format();

    /* const sourceAction = new codepipeline_actions.GitHubSourceAction({
      actionName: 'Source',
      owner: envVars.REPO_OWNER,
      repo: envVars.REPO_NAME,
      oauthToken: cdk.SecretValue.secretsManager('atcl/jingood2/github-token'),
      output: sourceOutput,
      branch: envVars.BUILD_BRANCH, // default: 'master'
      trigger: codepipeline_actions.GitHubTrigger.WEBHOOK, // default: 'WEBHOOK', 'NONE' is also possible for no Source trigger
    }); */

    /**
      * 1.2 Add Source Action to Source Stage
      */
    sourceStage.addAction(sourceAction);

    const devProject = new CodebuildProject(this, 'DeployDev', {
      project: props.project,
      appName: props.appName,
      stage: 'dev',
      versionId: BUILD_VERSION,
    }) ;

    const buildStage = pipeline.addStage({
      stageName: 'DeployDev',
    });
    const buildAction = new codepipeline_actions.CodeBuildAction({
      actionName: 'Deploy',
      input: sourceOutput,
      project: devProject.buildProject,
      type: codepipeline_actions.CodeBuildActionType.BUILD,
    });

    buildStage.addAction(buildAction);
    const approvalStage = pipeline.addStage({
      stageName: 'Approval',
    });

    approvalStage.addAction(new codepipeline_actions.ManualApprovalAction({
      actionName: 'ManualApproval',
      notifyEmails: envVars.APPROVAL_NOTI_EMAILS,
    }));

    const deployProdStage = pipeline.addStage({
      stageName: 'DeployOnProd',
    });

    const prodProject = new CodebuildProject(this, 'DeployProd', {
      project: props.project,
      appName: props.appName,
      stage: 'prod',
      versionId: BUILD_VERSION,
    } ) ;

    const prodAction = new codepipeline_actions.CodeBuildAction({
      actionName: 'Deploy',
      input: sourceOutput,
      project: prodProject.buildProject,
      type: codepipeline_actions.CodeBuildActionType.BUILD,
    });
    deployProdStage.addAction(prodAction);

    // CloudZ Tags
    cdk.Tags.of(this).add('cz-project', 'magicmall' );
    cdk.Tags.of(this).add('cz-org', 'skmg');
    cdk.Tags.of(this).add('cz-customer', 'LeeSungik' );
    cdk.Tags.of(this).add('cz-ext1', ' ' );
    cdk.Tags.of(this).add('cz-ext2', ' ' );
    cdk.Tags.of(this).add('cz-ext3', ' ' );

  }
}

