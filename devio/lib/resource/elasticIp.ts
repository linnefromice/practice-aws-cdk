import * as cdk from "@aws-cdk/core"
import { CfnEIP, CfnVPC } from "@aws-cdk/aws-ec2"
import { Resource } from "./abstract/resource"

interface ResourceInfo {
  readonly id: string
  readonly resourceName: string
  readonly assign: (eip: CfnEIP) => void
}

export class ElasticIp extends Resource {
  public eip1a: CfnEIP
  public eip1c: CfnEIP

  private readonly resourceInfos: ResourceInfo[] = [
    {
      id: "ElasticIpNgw1a",
      resourceName: "eip-ngw-1a",
      assign: eip => this.eip1a = eip
    },
    {
      id: "ElasticIpNgw1c",
      resourceName: "eip-ngw-1c",
      assign: eip => this.eip1c = eip
    }
  ]

  constructor() {
    super()
  }

  createResources(scope: cdk.Construct): void {
    for (const resourceInfo of this.resourceInfos) {
      const eip = this.createElasticIp(scope, resourceInfo)
      resourceInfo.assign(eip)
    }
  }

  private createElasticIp(scope: cdk.Construct, resourceInfo: ResourceInfo): CfnEIP {
    return new CfnEIP(scope, resourceInfo.id, {
      domain: "vpc",
      tags: [{ key: "Name", value: this.createResourceName(scope, resourceInfo.resourceName) }]
    })
  }
}