import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import type { Construct } from "constructs";

export interface GithubDeployStackProps extends cdk.StackProps {
  /** "owner/repo" allowed to assume the deploy role. */
  repository: string;
  /**
   * Repositories created since GitHub's immutable OIDC subjects use "repo:owner@id/repo@id" instead
   * of "repo:owner/repo". Get it with
   * `gh api repos/<owner>/<repo>/actions/oidc/customization/sub --jq .sub_claim_prefix`.
   */
  subjectPrefix?: string;
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

    // Only the main branch and the repository's environments may deploy.
    const prefixes = [`repo:${props.repository}`, ...(props.subjectPrefix ? [props.subjectPrefix] : [])];
    const subjects = prefixes.flatMap((prefix) => [
      `${prefix}:ref:refs/heads/main`,
      `${prefix}:environment:*`,
    ]);

    const role = new iam.Role(this, "DeployRole", {
      roleName: "seven-github-deploy",
      maxSessionDuration: cdk.Duration.hours(1),
      assumedBy: new iam.WebIdentityPrincipal(provider.openIdConnectProviderArn, {
        StringEquals: { "token.actions.githubusercontent.com:aud": "sts.amazonaws.com" },
        StringLike: { "token.actions.githubusercontent.com:sub": subjects },
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
