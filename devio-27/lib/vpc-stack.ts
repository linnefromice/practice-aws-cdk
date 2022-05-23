import { Stack, StackProps } from "aws-cdk-lib"
import { CfnVPC } from "aws-cdk-lib/aws-ec2"
import { Construct } from "constructs"

export class VpcStack extends Stack {
  public readonly vpc: CfnVPC

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)
    this.vpc = new CfnVPC(this, "Vpc", {
      cidrBlock: "10.0.0.0/16"
    })
  }
}
