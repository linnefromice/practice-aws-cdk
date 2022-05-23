import { App } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as Devio from "../../lib/devio-stack"

test("InternetGateway", () => {
  const app = new App();
  const stack = new Devio.DevioStack(app, "DevioStack")
  const template = Template.fromStack(stack)

  template.resourceCountIs("AWS::EC2::InternetGateway", 1)
  template.hasResourceProperties("AWS::EC2::InternetGateway", {
    Tags: [{ "Key": "Name", "Value": "undefined-undefined-igw" }]
  })
  template.resourceCountIs("AWS::EC2::VPCGatewayAttachment", 1)
})