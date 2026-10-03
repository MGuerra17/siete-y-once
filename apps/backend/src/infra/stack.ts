import * as path from "node:path";
import * as cdk from "aws-cdk-lib";
import * as apigwv2 from "aws-cdk-lib/aws-apigatewayv2";
import { WebSocketLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as cloudwatch from "aws-cdk-lib/aws-cloudwatch";
import * as cwActions from "aws-cdk-lib/aws-cloudwatch-actions";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as nodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as logs from "aws-cdk-lib/aws-logs";
import * as sns from "aws-cdk-lib/aws-sns";
import * as subscriptions from "aws-cdk-lib/aws-sns-subscriptions";
import type { Construct } from "constructs";
import { SHORT_CODE_INDEX } from "../lib/tables";

export type Stage = "dev" | "prod";

export interface SevenStackProps extends cdk.StackProps {
  stage: Stage;
  /** Optional e-mail subscribed to the alarm topic. */
  alarmEmail?: string;
}

export class SevenStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: SevenStackProps) {
    super(scope, id, props);
    const isProd = props.stage === "prod";

    // -------------------------------------------------------------------------
    // Storage: both tables hold short-lived data and expire through TTL.
    // -------------------------------------------------------------------------
    const tableDefaults = {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      timeToLiveAttribute: "expiresAt",
      removalPolicy: isProd ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
      deletionProtection: isProd,
    } satisfies Partial<dynamodb.TableProps>;

    const gamesTable = new dynamodb.Table(this, "Games", {
      ...tableDefaults,
      partitionKey: { name: "gameId", type: dynamodb.AttributeType.STRING },
    });
    gamesTable.addGlobalSecondaryIndex({
      indexName: SHORT_CODE_INDEX,
      partitionKey: { name: "shortCode", type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.INCLUDE,
      nonKeyAttributes: ["status"],
    });

    const connectionsTable = new dynamodb.Table(this, "Connections", {
      ...tableDefaults,
      partitionKey: { name: "connectionId", type: dynamodb.AttributeType.STRING },
    });

    // -------------------------------------------------------------------------
    // Lambdas
    // -------------------------------------------------------------------------
    const createHandler = (name: string, entry: string) => {
      const fn = new nodejs.NodejsFunction(this, name, {
        entry: path.join(__dirname, "../handlers", entry),
        runtime: lambda.Runtime.NODEJS_22_X,
        architecture: lambda.Architecture.ARM_64,
        // More memory also means more CPU: it cuts cold starts and p99 latency for pennies.
        memorySize: 1024,
        timeout: cdk.Duration.seconds(10),
        loggingFormat: lambda.LoggingFormat.JSON,
        logGroup: new logs.LogGroup(this, `${name}Logs`, {
          retention: logs.RetentionDays.ONE_MONTH,
          removalPolicy: cdk.RemovalPolicy.DESTROY,
        }),
        environment: {
          GAMES_TABLE: gamesTable.tableName,
          CONNECTIONS_TABLE: connectionsTable.tableName,
          NODE_OPTIONS: "--enable-source-maps",
        },
        bundling: { minify: true, sourceMap: true, target: "node22" },
      });
      gamesTable.grantReadWriteData(fn);
      connectionsTable.grantReadWriteData(fn);
      return fn;
    };

    const connectFn = createHandler("ConnectHandler", "connect.ts");
    const disconnectFn = createHandler("DisconnectHandler", "disconnect.ts");
    const messageFn = createHandler("MessageHandler", "message.ts");

    // -------------------------------------------------------------------------
    // WebSocket API
    // -------------------------------------------------------------------------
    const api = new apigwv2.WebSocketApi(this, "WebSocketApi", {
      apiName: `seven-${props.stage}`,
      connectRouteOptions: { integration: new WebSocketLambdaIntegration("Connect", connectFn) },
      disconnectRouteOptions: {
        integration: new WebSocketLambdaIntegration("Disconnect", disconnectFn),
      },
      defaultRouteOptions: { integration: new WebSocketLambdaIntegration("Message", messageFn) },
    });

    const stage = new apigwv2.WebSocketStage(this, "Stage", {
      webSocketApi: api,
      stageName: props.stage,
      autoDeploy: true,
      throttle: { rateLimit: 50, burstLimit: 100 },
    });

    for (const fn of [disconnectFn, messageFn]) {
      api.grantManageConnections(fn);
    }

    // -------------------------------------------------------------------------
    // Alarms
    // -------------------------------------------------------------------------
    const alarmTopic = new sns.Topic(this, "AlarmTopic");
    if (props.alarmEmail) {
      alarmTopic.addSubscription(new subscriptions.EmailSubscription(props.alarmEmail));
    }

    for (const fn of [connectFn, disconnectFn, messageFn]) {
      const alarm = fn
        .metricErrors({ period: cdk.Duration.minutes(5) })
        .createAlarm(this, `${fn.node.id}Errors`, {
          threshold: 1,
          evaluationPeriods: 1,
          treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
          alarmDescription: `${fn.node.id} is throwing errors`,
        });
      alarm.addAlarmAction(new cwActions.SnsAction(alarmTopic));
    }

    new cdk.CfnOutput(this, "WebSocketUrl", {
      value: stage.url,
      description: "Set as EXPO_PUBLIC_WS_URL in the mobile app",
    });
  }
}
