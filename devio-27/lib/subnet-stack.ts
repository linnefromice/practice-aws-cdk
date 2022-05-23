import { Stack, StackProps } from "aws-cdk-lib"
import { CfnSubnet, CfnVPC } from "aws-cdk-lib/aws-ec2"
import { ServicePrincipal } from "aws-cdk-lib/aws-iam"
import { Construct } from "constructs"

export class SubnetStack extends Stack {
  constructor(scope: Construct, id: string, vpc: CfnVPC, props?: StackProps) {
    super(scope, id, props)

    new CfnSubnet(this, "Subnet", {
      cidrBlock: "10.0.1.0/24",
      vpcId: vpc.ref
    })
  }
}