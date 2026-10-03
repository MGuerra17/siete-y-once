import * as cdk from "aws-cdk-lib";
import { SevenStack, type Stage } from "./stack";

const app = new cdk.App();

const stage = (app.node.tryGetContext("stage") ?? "dev") as Stage;
if (stage !== "dev" && stage !== "prod") {
  throw new Error(`Unknown stage "${stage}". Use -c stage=dev|prod`);
}

new SevenStack(app, `Seven-${stage}`, {
  stage,
  alarmEmail: app.node.tryGetContext("alarmEmail"),
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION ?? "us-east-1",
  },
});

cdk.Tags.of(app).add("project", "seven");
cdk.Tags.of(app).add("stage", stage);
