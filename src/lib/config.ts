import * as chalk from 'chalk';

export const envVars = {
  REGION: process.env.REGION || 'ap-northeast-2',
  PROJECT_NAME: 'magicmall',
  APP_NAME: process.env.APP_NAME || 'myapp',
  REPO_OWNER: process.env.REPO_OWNER || 'jingood2',
  REPO_NAME: process.env.REPO_NAME || 'magicmall-eb-codepipeline-stack',
  BUILD_BRANCH: process.env.BUILD_BRANCH || 'main',
  DEV_STAGE_ENV: {
    VPC_ID: 'vpc-07db512afbc65d743',
    PUB_SUBNET_ID: 'subnet-02e9c39807e853e29,subnet-03ed230c41c168b8c',
    PRI_SUBNET_ID: 'subnet-0c82e48557abf2f9d,subnet-084521c508b6fe543',
  },
  PROD_STAGE_ENV: {
    VPC_ID: 'vpc-07a6df880ea491c9b',
    PUB_SUBNET_ID: 'subnet-0acc388f4c3ff2a70,subnet-068db502c289996b6',
    PRI_SUBNET_ID: 'subnet-010f8e5648b45477d,subnet-08827edc7c99e8887',
  },
  EB_PLATFORM_STACK: '64bit Amazon Linux 2 v4.1.7 running Tomcat 8.5 Corretto 8',
};

export const EB_INSTANCE_TYPE = {
  PROD_B2C: 0,
  PROD_B2B: 1,
  DEV_ALL: 2,
};

export function validateEnvVariables() {
  for (let variable in envVars) {
    if (!envVars[variable as keyof typeof envVars]) {
      throw Error(
        chalk.red(`[app]: Environment variable ${variable} is not defined!`),
      );
    }
  }
}