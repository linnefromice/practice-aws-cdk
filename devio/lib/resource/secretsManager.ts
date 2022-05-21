import * as cdk from '@aws-cdk/core';
import { CfnSecret } from '@aws-cdk/aws-secretsmanager';
import { Resource } from './abstract/resource';

export const OSecretKey = {
  MasterUsername: "MasterUsername",
  MasterUserPassword: "MasterUserPassword"
} as const;
type SecretKey = keyof typeof OSecretKey

interface ResourceInfo {
  readonly id: string
  readonly description: string
  readonly generateSecretString: CfnSecret.GenerateSecretStringProperty
  readonly resourceName: string
  readonly assign: (secret: CfnSecret) => void
}

export class SecretsManager extends Resource {
  public rdsCluster: CfnSecret

  private static readonly rdsClusterMasterUsername = "admin"
  private readonly resources: ResourceInfo[] = [{
    id: "SecretRdsCluster",
    description: "for RDS cluster",
    generateSecretString: {
      excludeCharacters: '"@/\\\'',
      generateStringKey: OSecretKey.MasterUserPassword,
      passwordLength: 16,
      secretStringTemplate: `{"${OSecretKey.MasterUsername}": "${SecretsManager.rdsClusterMasterUsername}"}`
    },
    resourceName: "secrets-rds-cluster",
    assign: secret => this.rdsCluster = secret
  }]

  constructor() {
    super()
  }
 
  createResources(scope: cdk.Construct): void {
    for (const resourceInfo of this.resources) {
      const secret = this.createSecret(scope, resourceInfo);
      resourceInfo.assign(secret);
    }
  }

  public static getDynamicReference(secret: CfnSecret, secretKey: SecretKey): string {
    return `{{resolve:secretsmanager:${secret.ref}:SecretString:${secretKey}}}`
  }

  private createSecret(scope: cdk.Construct, resourceInfo: ResourceInfo): CfnSecret {
    return new CfnSecret(scope, resourceInfo.id, {
      description: resourceInfo.description,
      generateSecretString: resourceInfo.generateSecretString,
      name: this.createResourceName(scope, resourceInfo.resourceName)
    })
  }
}

