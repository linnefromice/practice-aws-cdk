import * as cdk from '@aws-cdk/core';
import { CfnSubnet, CfnVPC } from '@aws-cdk/aws-ec2';
import { Vpc } from './vpc';
import { Subnet } from './subnet';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class DevioStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'DevioQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    // vpc
    const vpc = new Vpc()
    vpc.createResouces(this)
    // subnet
    const subnet = new Subnet(vpc.vpc)
    subnet.createResources(this)
  }
}
