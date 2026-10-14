import * as cdk from "aws-cdk-lib";
import { Match, Template } from "aws-cdk-lib/assertions";
import { describe, it } from "vitest";
import { GithubDeployStack } from "./github-deploy-stack";

const synth = (subjectPrefix?: string) =>
  Template.fromStack(
    new GithubDeployStack(new cdk.App(), "Test-github", { repository: "owner/repo", subjectPrefix }),
  );

const trustedSubjects = (subjects: string[]) => ({
  AssumeRolePolicyDocument: Match.objectLike({
    Statement: [
      Match.objectLike({
        Condition: Match.objectLike({
          StringLike: { "token.actions.githubusercontent.com:sub": subjects },
        }),
      }),
    ],
  }),
});

describe("GithubDeployStack", () => {
  it("trusts only main and environments of the repository", () => {
    synth().hasResourceProperties(
      "AWS::IAM::Role",
      trustedSubjects(["repo:owner/repo:ref:refs/heads/main", "repo:owner/repo:environment:*"]),
    );
  });

  it("also trusts the immutable subject prefix when given", () => {
    synth("repo:owner@1/repo@2").hasResourceProperties(
      "AWS::IAM::Role",
      trustedSubjects([
        "repo:owner/repo:ref:refs/heads/main",
        "repo:owner/repo:environment:*",
        "repo:owner@1/repo@2:ref:refs/heads/main",
        "repo:owner@1/repo@2:environment:*",
      ]),
    );
  });
});
