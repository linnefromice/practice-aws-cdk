import * as cdk from '@aws-cdk/core';
import { CfnDBCluster, CfnDBClusterParameterGroup, CfnDBInstance, CfnDBParameterGroup, CfnDBSubnetGroup } from '@aws-cdk/aws-rds';
import { CfnSecurityGroup, CfnSubnet } from '@aws-cdk/aws-ec2';
import { Resource } from './abstract/resource';
import { CfnSecret } from '@aws-cdk/aws-secretsmanager';
import { OSecretKey, SecretsManager } from './secretsManager';
import { CfnRole } from '@aws-cdk/aws-iam';

interface InstanceInfo {
  readonly id: string
  readonly availabilityZone: string
  readonly preferredMaintenanceWindow: string
  readonly resourceName: string
  readonly assign: (instance: CfnDBInstance) => void
}

export class Rds extends Resource {
  public dbCluster: CfnDBCluster
  public dbInstance1a: CfnDBInstance;
  public dbInstance1c: CfnDBInstance;

  private readonly subnetDb1a: CfnSubnet
  private readonly subnetDb1c: CfnSubnet
  private readonly securityGroupRds: CfnSecurityGroup
  private readonly secretRdsCluster: CfnSecret
  private readonly iamRoleRds: CfnRole
  private readonly instances: InstanceInfo[] = [
      {
      id: 'RdsDbInstance1a',
      availabilityZone: 'ap-northeast-1a',
      preferredMaintenanceWindow: 'sun:20:00-sun:20:30',
      resourceName: 'rds-instance-1a',
      assign: instance => this.dbInstance1a = instance
    },
    {
      id: 'RdsDbInstance1c',
      availabilityZone: 'ap-northeast-1c',
      preferredMaintenanceWindow: 'sun:20:30-sun:21:00',
      resourceName: 'rds-instance-1c',
      assign: instance => this.dbInstance1c = instance
    }
  ]

  private static readonly engine = 'aurora-mysql';
  private static readonly databaseName = 'devio';
  private static readonly dbInstanceClass = 'db.r5.large';

  constructor(
    subnetDb1a: CfnSubnet,
    subnetDb1c: CfnSubnet,
    securityGroupRds: CfnSecurityGroup,
    secretRdsCluster: CfnSecret,
    iamRoleRds: CfnRole
  ) {
    super();
    this.subnetDb1a = subnetDb1a;
    this.subnetDb1c = subnetDb1c;
    this.securityGroupRds = securityGroupRds;
    this.secretRdsCluster = secretRdsCluster;
    this.iamRoleRds = iamRoleRds;
  };

  createResources(scope: cdk.Construct): void {
    const subnetGroup = this.createSubnetGroup(scope)
    const clusterParameterGroup = this.createClusterParameterGroup(scope)
    const parameterGroup = this.createParameterGroup(scope)
    this.dbCluster = this.createCluster(scope, subnetGroup, clusterParameterGroup)

    for (const instanceInfo of this.instances) {
      const instance = this.createInstance(scope, instanceInfo, this.dbCluster, subnetGroup, parameterGroup)
      instanceInfo.assign(instance)
    }
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

  private createCluster(scope: cdk.Construct, subnetGroup: CfnDBSubnetGroup, clusterParameterGroup: CfnDBClusterParameterGroup): CfnDBCluster {
    return new CfnDBCluster(scope, "RdsDbCluster", {
      engine: "aurora-mysql",
      backupRetentionPeriod: 7,
      databaseName: Rds.databaseName,
      dbClusterIdentifier: this.createResourceName(scope, "rds-cluster"),
      dbClusterParameterGroupName: clusterParameterGroup.ref,
      dbSubnetGroupName: subnetGroup.ref,
      enableCloudwatchLogsExports: ["error"],
      engineMode: "provisioned",
      engineVersion: "5.7.mysql_aurora.2.10.0",
      masterUserPassword: SecretsManager.getDynamicReference(this.secretRdsCluster, OSecretKey.MasterUserPassword),
      masterUsername: SecretsManager.getDynamicReference(this.secretRdsCluster, OSecretKey.MasterUsername),
      port: 3306,
      preferredBackupWindow: "19:00-19:30",
      preferredMaintenanceWindow: "sun:19:30-sun:20:00",
      storageEncrypted: true,
      vpcSecurityGroupIds: [this.securityGroupRds.attrGroupId]
    })
  }

  private createInstance(scope: cdk.Construct, instanceInfo: InstanceInfo, cluster: CfnDBCluster, subnetGroup: CfnDBSubnetGroup, parameterGroup: CfnDBParameterGroup): CfnDBInstance {
    return new CfnDBInstance(scope, instanceInfo.id, {
      dbInstanceClass: Rds.dbInstanceClass,
      autoMinorVersionUpgrade: false,
      availabilityZone: instanceInfo.availabilityZone,
      dbClusterIdentifier: cluster.ref,
      dbInstanceIdentifier: this.createResourceName(scope, instanceInfo.resourceName),
      dbParameterGroupName: parameterGroup.ref,
      dbSubnetGroupName: subnetGroup.ref,
      enablePerformanceInsights: true,
      engine: Rds.engine,
      monitoringInterval: 60,
      monitoringRoleArn: this.iamRoleRds.attrArn,
      performanceInsightsRetentionPeriod: 7,
      preferredMaintenanceWindow: instanceInfo.preferredMaintenanceWindow,
    });
}
}