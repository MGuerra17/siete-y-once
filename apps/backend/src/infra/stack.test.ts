import * as cdk from "aws-cdk-lib";
import { Match, Template } from "aws-cdk-lib/assertions";
import { describe, expect, it } from "vitest";
import { SevenStack, type Stage } from "./stack";

const synth = (stage: Stage) =>
  Template.fromStack(new SevenStack(new cdk.App(), `Test-${stage}`, { stage }));

describe("SevenStack", () => {
  const template = synth("dev");

  it("expires game and connection records through TTL", () => {
    template.resourcePropertiesCountIs(
      "AWS::DynamoDB::Table",
      { TimeToLiveSpecification: { AttributeName: "expiresAt", Enabled: true } },
      2,
    );
  });

  it("runs every handler on Node 22 arm64 with JSON logs", () => {
    template.resourcePropertiesCountIs(
      "AWS::Lambda::Function",
      {
        Runtime: "nodejs22.x",
        Architectures: ["arm64"],
        LoggingConfig: Match.objectLike({ LogFormat: "JSON" }),
      },
      3,
    );
  });

  it("throttles the WebSocket stage", () => {
    template.hasResourceProperties("AWS::ApiGatewayV2::Stage", {
      DefaultRouteSettings: Match.objectLike({ ThrottlingRateLimit: 50, ThrottlingBurstLimit: 100 }),
    });
  });

  it("protects production tables from deletion", () => {
    const tables = synth("prod").findResources("AWS::DynamoDB::Table");
    for (const table of Object.values(tables)) {
      expect(table.DeletionPolicy).toBe("Retain");
      expect(table.Properties.DeletionProtectionEnabled).toBe(true);
    }
  });
});
