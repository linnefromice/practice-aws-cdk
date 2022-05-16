// import * as cdk from 'aws-cdk-lib';
// import { Template } from 'aws-cdk-lib/assertions';
import * as cdk from '@aws-cdk/core';
import * as Devio from '../lib/devio-stack';
import { expect, countResources, haveResource } from '@aws-cdk/assert';

// example test. To run these tests, uncomment this file along with the
// example resource in lib/devio-stack.ts
// test('SQS Queue Created', () => {
//   const app = new cdk.App();
//     // WHEN
//   const stack = new Devio.DevioStack(app, 'MyTestStack');
//     // THEN
//   const template = Template.fromStack(stack);

//   template.hasResourceProperties('AWS::SQS::Queue', {
//     VisibilityTimeout: 300
//   });
// });

test("Vpc", () => {
  const app = new cdk.App({
    context: {
      'systemName': 'starwars',
      'envType': 'prd'
    }
  });
  const stack = new Devio.DevioStack(app, "DevioStack");

  expect(stack).to(countResources("AWS::EC2::VPC", 1))
  expect(stack).to(haveResource("AWS::EC2::VPC", {
    CidrBlock: "10.0.0.0/16",
    Tags: [{ "Key": "Name", "Value": "starwars-prd-vpc" }]
  }))
})
