import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as Lambda from "aws-cdk-lib/aws-lambda"
import * as Apigw from "aws-cdk-lib/aws-apigateway"
import { HitCounter } from './hitcounter';
import { TableViewer } from 'cdk-dynamo-table-viewer';

export class CdkworkshopStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // define an AWS lambda resource
    const hello = new Lambda.Function(this, "HelloHandler", {
      runtime: Lambda.Runtime.NODEJS_14_X,
      code: Lambda.Code.fromAsset("lambda"),
      handler: "hello.handler"
    })

    const helloWithCounter = new HitCounter(this, "HelloHitCounter", {
      downstream: hello
    })

    new Apigw.LambdaRestApi(this, "Endpoint", {
      handler: helloWithCounter.handler
    })

    new TableViewer(this, "ViewHitCounter", {
      title: "Hello Hits",
      table: helloWithCounter.table
    })
  }
}
