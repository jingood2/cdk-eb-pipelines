import * as chalk from 'chalk';

export const envVars = {
  REGION: process.env.REGION || 'ap-northeast-2',
  PROJECT_NAME: 'magicmall',
  APP_NAME: process.env.APP_NAME || 'myapp',
  REPO_OWNER: process.env.REPO_OWNER || 'jingood2',
  REPO_NAME: process.env.REPO_NAME || 'magicmall-eb-codepipeline-stack',
  BUILD_BRANCH: process.env.BUILD_BRANCH || 'main',
  APPROVAL_NOTI_EMAILS: [
    'TSS_TYSP4098@tongyang.co.kr', 'TSS_TYSP4059@tongyang.co.kr', 'TSS_TYSP4070@tongyang.co.kr',
  ],
  DEV_STAGE_ENV: {
  },
  PROD_STAGE_ENV: {
  },
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