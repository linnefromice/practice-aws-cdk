import { expect, countResources, haveResource, anything } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Devio from '../../lib/devio-stack';

test("Rds", () => {
  const app = new cdk.App()
  const stack = new Devio.DevioStack(app, "DevioStack")

  expect(stack).to(countResources('AWS::RDS::DBSubnetGroup', 1));
  expect(stack).to(haveResource('AWS::RDS::DBSubnetGroup', {
    DBSubnetGroupDescription: 'Subnet Group for RDS',
    SubnetIds: anything(),
    DBSubnetGroupName: 'undefined-undefined-sng-rds'
  }));
})