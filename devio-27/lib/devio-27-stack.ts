import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { SubnetStack } from './subnet-stack';
import { VpcStack } from './vpc-stack';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Devio27Stack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpcStack = new VpcStack(scope, "VpcStack", {
      stackName: "vpc-stack"
    })
    new SubnetStack(scope, "SubnetStack", vpcStack.vpc, {
      stackName: "subnet-stack"
    })
  }
}
