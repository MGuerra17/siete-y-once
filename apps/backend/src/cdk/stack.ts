import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigatewayv2 from "aws-cdk-lib/aws-apigatewayv2";
import * as integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as path from "path";

export class SevenElevenStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // -------------------------------------------------------------------------
    // DynamoDB
    // -------------------------------------------------------------------------
    const gamesTable = new dynamodb.Table(this, "Games", {
      partitionKey: { name: "gameId", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    gamesTable.addGlobalSecondaryIndex({
      indexName: "shortCode-index",
      partitionKey: { name: "shortCode", type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    const connectionsTable = new dynamodb.Table(this, "Connections", {
      partitionKey: { name: "connectionId", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    connectionsTable.addGlobalSecondaryIndex({
      indexName: "gameId-index",
      partitionKey: { name: "gameId", type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // -------------------------------------------------------------------------
    // Lambda: Connect
    // -------------------------------------------------------------------------
    const connectHandler = new lambdaNodejs.NodejsFunction(this, "ConnectHandler", {
      entry: path.join(__dirname, "../functions/connect/handler.ts"),
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_20_X,
      timeout: cdk.Duration.seconds(10),
      environment: {
        CONNECTIONS_TABLE: connectionsTable.tableName,
      },
      bundling: {
        minify: true,
        sourceMap: true,
        externalModules: ["aws-sdk"],
        forceDockerBundling: false,
      },
    });
    connectionsTable.grantReadWriteData(connectHandler);

    // -------------------------------------------------------------------------
    // Lambda: Disconnect
    // -------------------------------------------------------------------------
    const disconnectHandler = new lambdaNodejs.NodejsFunction(this, "DisconnectHandler", {
      entry: path.join(__dirname, "../functions/disconnect/handler.ts"),
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_20_X,
      timeout: cdk.Duration.seconds(10),
      environment: {
        CONNECTIONS_TABLE: connectionsTable.tableName,
        GAMES_TABLE: gamesTable.tableName,
      },
      bundling: {
        minify: true,
        sourceMap: true,
        externalModules: ["aws-sdk"],
        forceDockerBundling: false,
      },
    });
    connectionsTable.grantReadWriteData(disconnectHandler);
    gamesTable.grantReadWriteData(disconnectHandler);

    // -------------------------------------------------------------------------
    // Lambda: Default (message router)
    // -------------------------------------------------------------------------
    const defaultHandler = new lambdaNodejs.NodejsFunction(this, "DefaultHandler", {
      entry: path.join(__dirname, "../functions/default/handler.ts"),
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_20_X,
      timeout: cdk.Duration.seconds(30),
      environment: {
        CONNECTIONS_TABLE: connectionsTable.tableName,
        GAMES_TABLE: gamesTable.tableName,
      },
      bundling: {
        minify: true,
        sourceMap: true,
        externalModules: ["aws-sdk"],
        forceDockerBundling: false,
      },
    });
    connectionsTable.grantReadWriteData(defaultHandler);
    gamesTable.grantReadWriteData(defaultHandler);

    // -------------------------------------------------------------------------
    // API Gateway WebSocket
    // -------------------------------------------------------------------------
    const webSocketApi = new apigatewayv2.WebSocketApi(this, "SevenElevenWsApi", {
      connectRouteOptions: {
        integration: new integrations.WebSocketLambdaIntegration(
          "ConnectIntegration",
          connectHandler
        ),
      },
      disconnectRouteOptions: {
        integration: new integrations.WebSocketLambdaIntegration(
          "DisconnectIntegration",
          disconnectHandler
        ),
      },
      defaultRouteOptions: {
        integration: new integrations.WebSocketLambdaIntegration(
          "DefaultIntegration",
          defaultHandler
        ),
      },
    });

    const stage = new apigatewayv2.WebSocketStage(this, "ProdStage", {
      webSocketApi,
      stageName: "prod",
      autoDeploy: true,
    });

    // Grant default handler permission to post to connections
    const connectionsArn = cdk.Stack.of(this).formatArn({
      service: "execute-api",
      resource: `${webSocketApi.apiId}/${stage.stageName}/POST/@connections/*`,
    });
    defaultHandler.addToRolePolicy(
      new cdk.aws_iam.PolicyStatement({
        effect: cdk.aws_iam.Effect.ALLOW,
        actions: ["execute-api:ManageConnections"],
        resources: [connectionsArn],
      })
    );
    disconnectHandler.addToRolePolicy(
      new cdk.aws_iam.PolicyStatement({
        effect: cdk.aws_iam.Effect.ALLOW,
        actions: ["execute-api:ManageConnections"],
        resources: [connectionsArn],
      })
    );

    new cdk.CfnOutput(this, "WebSocketUrl", {
      value: `${webSocketApi.apiEndpoint}/${stage.stageName}`,
      description: "WebSocket API URL",
    });
  }
}
