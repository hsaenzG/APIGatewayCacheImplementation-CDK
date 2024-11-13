import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class TestCacheApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);  

    // Create an API Gateway REST API
    const api = new apigateway.RestApi(this, 'MyApi', {
      restApiName: 'Service API',
      description: 'This service serves important data.'
    });

    // Define resources
    const resource1 = api.root.addResource('resource1');
    const resource2 = api.root.addResource('resource2');

    // Define mock integration with a static response for GET /resource1
    const mockIntegration1 = new apigateway.MockIntegration({
      integrationResponses: [{
        statusCode: '200',
        responseTemplates: {
          'application/json': JSON.stringify({ message: 'This is mock data for GET /resource1' })
        }
      }],
      requestTemplates: { 'application/json': '{"statusCode": 200}' }
    });

    // Add method with mock integration and specify a method response
    resource1.addMethod('GET', mockIntegration1, { 
      authorizationType: apigateway.AuthorizationType.NONE,
      methodResponses: [{ statusCode: '200' }]  // Define the 200 OK response for the method
    });

    // Define mock integration with a static response for POST /resource2
    const mockIntegration2 = new apigateway.MockIntegration({
      integrationResponses: [{
        statusCode: '200',
        responseTemplates: {
          'application/json': JSON.stringify({ message: 'This is mock data for POST /resource2' })
        }
      }],
      requestTemplates: { 'application/json': '{"statusCode": 200}' }
    });

    // Add method with mock integration and specify a method response
    resource2.addMethod('GET', mockIntegration2, { 
      authorizationType: apigateway.AuthorizationType.NONE,
      methodResponses: [{ statusCode: '200' }]  // Define the 200 OK response for the method
    });

    // Add method options with caching options
    new apigateway.Stage(this, 'dev', {
      deployment: new apigateway.Deployment(this, 'MyDeployment', {
        api: api
      }),
      stageName: 'dev',
      methodOptions: {
        [`${resource1.path}/GET`]: {
          cachingEnabled: true,
          cacheTtl: cdk.Duration.minutes(5)
        },
        [`${resource2.path}/GET`]: {
          cachingEnabled: false
        }
      }
    });
  }    
}
