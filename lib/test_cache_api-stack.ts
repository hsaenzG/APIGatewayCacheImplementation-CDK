import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class TestCacheApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);  

 // Crear un API Gateway REST API
 const api = new apigateway.RestApi(this, 'MyApi', {
  restApiName: 'Service API',
  description: 'This service serves important data.'
});
// Definir recursos
const resource1 = api.root.addResource('resource1');
const resource2 = api.root.addResource('resource2');
// Definir métodos para los recursos
const method1 = resource1.addMethod('GET');  // Cambia según el método HTTP necesario
const method2 = resource2.addMethod('POST'); // Cambia según el método HTTP necesario
// Añadir opciones de método con opciones de caching
new apigateway.Stage(this, 'dev', {
  deployment: new apigateway.Deployment(this, 'MyDeployment', {
    api: api
  }),
  stageName: 'dev',
  methodOptions: {
    [`${resource1.path}/${method1.httpMethod}`]: {
      cachingEnabled: true,
      cacheTtl: cdk.Duration.minutes(5)
    },
    [`${resource2.path}/${method2.httpMethod}`]: {
      cachingEnabled: false
    }
  }
});
}    

  }


