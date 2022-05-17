import * as cdk from '@aws-cdk/core';
import { Vpc } from './resource/vpc';
import { Subnet } from './resource/subnet';
import { InternetGateway } from './resource/internetGateway';
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
    vpc.createResources(this)
    // subnet
    const subnet = new Subnet(vpc.vpc)
    subnet.createResources(this)
    // internet gateway
    const igw = new InternetGateway(vpc.vpc)
    igw.createResources(this)
  }
}
