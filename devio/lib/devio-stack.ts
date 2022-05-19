import * as cdk from '@aws-cdk/core';
import { Vpc } from './resource/vpc';
import { Subnet } from './resource/subnet';
import { InternetGateway } from './resource/internetGateway';
import { ElasticIp } from './resource/elasticIp';
import { NatGateway } from './resource/natGateway';
import { RouteTable } from './resource/routeTable';
import { NetworkAcl } from './resource/networkAcl';
import { IamRole } from './resource/iamRole';
import { SecurityGroup } from './resource/securityGroup';
import { Ec2 } from './resource/ec2';
import { Alb } from './resource/alb';
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
    // elastic ip
    const eip = new ElasticIp()
    eip.createResources(this)
    // nat gateway
    const ngw = new NatGateway(
      subnet.public1a,
      subnet.public1c,
      eip.eip1a,
      eip.eip1c
    )
    ngw.createResources(this)
    // route table
    const routeTable = new RouteTable(
      vpc.vpc,
      subnet.public1a,
      subnet.public1c,
      subnet.app1a,
      subnet.app1c,
      subnet.db1a,
      subnet.db1c,
      igw.igw,
      ngw.ngw1a,
      ngw.ngw1c,
    )
    routeTable.createResources(this)
    // network acl
    const networkAcl = new NetworkAcl(
      vpc.vpc,
      subnet.public1a,
      subnet.public1c,
      subnet.app1a,
      subnet.app1c,
      subnet.db1a,
      subnet.db1c
    );
    networkAcl.createResources(this);
    // iam role
    const iamRole = new IamRole()
    iamRole.createResources(this)
    // security group
    const securityGroup = new SecurityGroup(vpc.vpc)
    securityGroup.createResources(this)
    // ec2
    const ec2 = new Ec2(
      subnet.app1a,
      subnet.app1c,
      iamRole.instanceProfileEc2,
      securityGroup.ec2
    )
    ec2.createResources(this)
    // alb
    const alb = new Alb(
      vpc.vpc,
      subnet.public1a,
      subnet.public1c,
      securityGroup.alb,
      ec2.instance1a,
      ec2.instance1c
    );
    alb.createResources(this);
  }
}
