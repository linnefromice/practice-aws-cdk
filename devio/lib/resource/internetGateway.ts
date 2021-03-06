import { Construct } from 'constructs';
import { CfnInternetGateway, CfnVPC, CfnVPCGatewayAttachment } from "aws-cdk-lib/aws-ec2"
import { Resource } from "./abstract/resource"

export class InternetGateway extends Resource {
  public igw: CfnInternetGateway;
  
  private readonly vpc: CfnVPC

  constructor(vpc: CfnVPC) {
    super()
    this.vpc = vpc;
  }

  createResources(scope: Construct): void {
    this.igw = new CfnInternetGateway(scope, "InternetGateway", {
      tags: [{ key: "Name", value: this.createResourceName(scope, "igw")}]
    });

    // 割り当て
    new CfnVPCGatewayAttachment(scope, "VpcGatewayAttachment", {
      vpcId: this.vpc.ref,
      internetGatewayId: this.igw.ref
    });
  }  
}