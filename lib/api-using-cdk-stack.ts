import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class ApiUsingCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // Dynamo table
    const myDnamoTable = new Table(this, "MyDynamoTable", {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {name: "id", type: AttributeType.STRING},
      tableName: "MyDynamoTable"
    });

    //Lambda function
    const myLambdaFunction = new Function(this, "MyLambdaFunction", {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset("lambda"),
      handler: "app.handler",
      environment:{
        MY_DYNAMO_TABLE: myDnamoTable.tableName        
      }
    });

    //Grant permission for lambda to write and read dymano table
    myDnamoTable.grantReadWriteData(myLambdaFunction);

    //APIGateway
    const myApiGateway = new RestApi(this, "MyApiGateway");

    //Integrate Lambda with apigateway
    const myLambdaApiGatewayIntegration = new LambdaIntegration(myLambdaFunction);

    myApiGateway.root.resourceForPath("myroute").addMethod("GET", myLambdaApiGatewayIntegration);

    new CfnOutput(this, "HTTP API URL", {
      value: myApiGateway.url ?? "Something went wrong with the deploy",
    });

  }
}
