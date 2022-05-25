#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkworkshopStack } from '../lib/cdkworkshop-stack';

const app = new cdk.App();
new CdkworkshopStack(app, 'CdkworkshopStack');
