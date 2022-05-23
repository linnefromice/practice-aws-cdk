import * as cdk from '@aws-cdk/core';
import { CfnDBClusterParameterGroup, CfnDBParameterGroup, CfnDBSubnetGroup } from '@aws-cdk/aws-rds';
import { CfnSubnet } from '@aws-cdk/aws-ec2';
import { Resource } from './abstract/resource';

export class Rds extends Resource {
  private readonly subnetDb1a: CfnSubnet
  private readonly subnetDb1c: CfnSubnet

  constructor(
    subnetDb1a: CfnSubnet,
    subnetDb1c: CfnSubnet,
  ) {
    super();
    this.subnetDb1a = subnetDb1a;
    this.subnetDb1c = subnetDb1c;
  };

  createResources(scope: cdk.Construct): void {
    this.createSubnetGroup(scope)
    this.createClusterParameterGroup(scope)
    this.createParameterGroup(scope)
  }

  private createSubnetGroup(scope: cdk.Construct): CfnDBSubnetGroup {
    return new CfnDBSubnetGroup(scope, "SubnetGroupRds", {
      dbSubnetGroupDescription: "Subnet Group for RDS",
      subnetIds: [this.subnetDb1a.ref, this.subnetDb1c.ref],
      dbSubnetGroupName: this.createResourceName(scope, "sng-rds")
    })
  }

  private createClusterParameterGroup(scope: cdk.Construct): CfnDBClusterParameterGroup {
    return new CfnDBClusterParameterGroup(scope, "ClusterParameterGroup", {
      description: "Cluster Parameter Group for RDS",
      family: "aurora-mysql5.7",
      parameters: { time_zone: "UTC" }
    })
  }

  private createParameterGroup(scope: cdk.Construct): CfnDBParameterGroup {
    return new CfnDBParameterGroup(scope, "ParameterGroupRds", {
      description: "Parameter Group for RDS",
      family: "aurora-mysql5.7",
    })
  }
}