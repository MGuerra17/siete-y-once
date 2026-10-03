import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import type { Construct } from "constructs";

export interface GithubDeployStackProps extends cdk.StackProps {
  /** "owner/repo" allowed to assume the deploy role. */
  repository: string;
}

/**
 * Lets GitHub Actions deploy with short-lived OIDC credentials instead of stored AWS keys.
 * The role can only assume the CDK bootstrap roles, which carry the actual deploy permissions.
 */
export class GithubDeployStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: GithubDeployStackProps) {
    super(scope, id, props);

    const provider = new iam.OpenIdConnectProvider(this, "GithubProvider", {
      url: "https://token.actions.githubusercontent.com",
      clientIds: ["sts.amazonaws.com"],
    });

    const role = new iam.Role(this, "DeployRole", {
      roleName: "seven-github-deploy",
      maxSessionDuration: cdk.Duration.hours(1),
      assumedBy: new iam.WebIdentityPrincipal(provider.openIdConnectProviderArn, {
        StringEquals: { "token.actions.githubusercontent.com:aud": "sts.amazonaws.com" },
        StringLike: {
          "token.actions.githubusercontent.com:sub": [
            `repo:${props.repository}:ref:refs/heads/main`,
            `repo:${props.repository}:environment:*`,
          ],
        },
      }),
    });

    role.addToPolicy(
      new iam.PolicyStatement({
        actions: ["sts:AssumeRole"],
        resources: [`arn:aws:iam::${this.account}:role/cdk-hnb659fds-*-role-${this.account}-*`],
      }),
    );

    new cdk.CfnOutput(this, "DeployRoleArn", {
      value: role.roleArn,
      description: "Set as the AWS_DEPLOY_ROLE_ARN repository variable",
    });
  }
}
