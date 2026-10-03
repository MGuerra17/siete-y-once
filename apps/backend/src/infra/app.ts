import * as cdk from "aws-cdk-lib";
import { GithubDeployStack } from "./github-deploy-stack";
import { SevenStack, type Stage } from "./stack";

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION ?? "us-east-1",
};

const stage = (app.node.tryGetContext("stage") ?? "dev") as Stage;
if (stage !== "dev" && stage !== "prod") {
  throw new Error(`Unknown stage "${stage}". Use -c stage=dev|prod`);
}

new SevenStack(app, `Seven-${stage}`, {
  stage,
  alarmEmail: app.node.tryGetContext("alarmEmail"),
  env,
});

// One-time setup for CI deploys: `cdk deploy Seven-github -c githubRepo=owner/repo`.
const githubRepo: string | undefined = app.node.tryGetContext("githubRepo");
if (githubRepo) {
  new GithubDeployStack(app, "Seven-github", { repository: githubRepo, env });
}

cdk.Tags.of(app).add("project", "seven");
cdk.Tags.of(app).add("stage", stage);
