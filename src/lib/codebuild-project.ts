import * as codebuild from '@aws-cdk/aws-codebuild';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';

export interface CodebuildProjectProps {
  project: string;
  appName: string;
  stage: string;
  versionId: string;
}

export class CodebuildProject extends cdk.Construct {

  public readonly buildProject: codebuild.PipelineProject;

  constructor(scope: cdk.Construct, id: string, props: CodebuildProjectProps) {
    super(scope, id);

    this.buildProject = new codebuild.PipelineProject(this, 'CodeBuildProject', {
      projectName: `${props.appName}-${props.stage}-project`,
      description: 'Build Web Application',
      //buildSpec: codebuild.BuildSpec.fromSourceFilename('../../config/buildspec-ebdeploy.yml'),
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            commands: [
              'echo Installing awscli',
              'curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"',
              'unzip awscliv2.zip',
              './aws/install',
            ],
          },
          build: {
            commands: [
              'echo build started on `date +%s`',
              'ls',
              //'copy *.war ${props.appName}-${props.stage}.war',
              //'export WAR_NAME=${EB_APP_NAME}.war',
              'aws elasticbeanstalk create-application-version --application-name ${EB_APP_NAME} --version-label ${EB_VERSION} --source-bundle S3Bucket=${BUCKET_NAME},S3Key=${WAR_NAME}',
              'aws elasticbeanstalk update-environment --application-name ${EB_APP_NAME} --version-label ${EB_VERSION} --environment-name ${EB_STAGE}',
            ],
          },
          /* post_build: {
             commands: [`eb deploy ${envVars.APP_STAGE_NAME} --staged`],
           },
           */
        },
      }),
      //Build environment to use for the build.
      environment: {
        buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_3,
        computeType: codebuild.ComputeType.SMALL,
        environmentVariables: {
          // you can add more env variables here as per your requirement
          BUCKET_NAME: {
            value: `${props.project}-${props.appName}`,
          },
          EB_APP_NAME: {
            value: `${props.appName}-${props.stage}`,
          },
          EB_STAGE: {
            value: `${props.appName}-${props.stage}`,
          },
          WAR_NAME: {
            value: `${props.appName}.war`,
          },
          EB_VERSION: {
            value: `${props.versionId}`,
          },
        },
      },
      //Indicates whether AWS CodeBuild generates a publicly accessible URL for your project's build badge.
      //badge: true,
      timeout: cdk.Duration.minutes(10),
    });
    this.buildProject.role?.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess-AWSElasticBeanstalk'),
    );
    this.buildProject.role?.addToPrincipalPolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: ['elasticbeanstalk:*',
        'autoscaling:*',
        'elasticloadbalancing:*',
        'rds:*',
        's3:*',
        'ec2:*',
        'cloudwatch:*',
        'logs:*',
        'cloudformation:*'],
    }));

  }
}