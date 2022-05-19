import * as cdk from '@aws-cdk/core';
import { CfnLoadBalancer, CfnTargetGroup, CfnListener } from '@aws-cdk/aws-elasticloadbalancingv2';
import { CfnVPC, CfnSubnet, CfnSecurityGroup, CfnInstance, Port } from '@aws-cdk/aws-ec2';
import { Resource } from './abstract/resource';

export class Alb extends Resource {
  public loadBalancer: CfnLoadBalancer

  private readonly vpc: CfnVPC
  private readonly subnetPublic1a: CfnSubnet
  private readonly subnetPublic1c: CfnSubnet
  private readonly securityGroupAlb: CfnSecurityGroup
  private readonly ec2Instance1a: CfnInstance
  private readonly ec2Instance1c: CfnInstance

  constructor(
    vpc: CfnVPC,
    subnetPublic1a: CfnSubnet,
    subnetPublic1c: CfnSubnet,
    securityGroupAlb: CfnSecurityGroup,
    ec2Instance1a: CfnInstance,
    ec2Instance1c: CfnInstance
  ) {
      super();
      this.vpc = vpc;
      this.subnetPublic1a = subnetPublic1a;
      this.subnetPublic1c = subnetPublic1c;
      this.securityGroupAlb = securityGroupAlb;
      this.ec2Instance1a = ec2Instance1a;
      this.ec2Instance1c = ec2Instance1c;
  }

  createResources(scope: cdk.Construct): void {
    this.loadBalancer = this.createLoadBalancer(scope)
    const targetGroup = this.createTargetGroup(scope)
    this.createListener(scope, this.loadBalancer, targetGroup)
  }

  createLoadBalancer(scope: cdk.Construct): CfnLoadBalancer {
    return new CfnLoadBalancer(scope, "Alb", {
      ipAddressType: "ipv4",
      name: this.createResourceName(scope, "alb"),
      scheme: "internet-facing",
      securityGroups: [this.securityGroupAlb.attrGroupId],
      subnets: [this.subnetPublic1a.ref, this.subnetPublic1c.ref],
      type: "application"
    })
  }

  createTargetGroup(scope: cdk.Construct) {
    return new CfnTargetGroup(scope, "AlbTargetGroup", {
      name: this.createResourceName(scope, "tg"),
      port: 80,
      protocol: "HTTP",
      targetType: "instance",
      targets: [
        { id: this.ec2Instance1a.ref },
        { id: this.ec2Instance1c.ref }
      ],
      vpcId: this.vpc.ref
    })
  }

  createListener(scope: cdk.Construct, loadBalancer: CfnLoadBalancer, targetGroup: CfnTargetGroup) {
    new CfnListener(scope, "AlbListener", {
      defaultActions: [{
        type: "forward",
        forwardConfig: {
          targetGroups: [{
            targetGroupArn: targetGroup.ref,
            weight: 1
          }]
        }
      }],
      loadBalancerArn: loadBalancer.ref,
      port: 80,
      protocol: "HTTP"
    })
  }
}