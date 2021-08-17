import swaggerJSDoc, { Options, SwaggerDefinition } from 'swagger-jsdoc';

const def: SwaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'Repair Order Tracker API',
    version: '1.0.0',
    description: 'Handles database access for the Repair Order Tracker App. (http://www.repairordertracker.com)',
  },
  servers: [
    {
      url: 'http://localhost:2000/api',
      description: 'local dev server',
    }
  ],
  tags: [
    {
      name: 'User',
      description: 'User Operations'
    },
    {
      name: 'PayPeriods',
      description: 'PayPeriod Operations'
    },
    {
      name: 'RepairOrders',
      description: 'RepairOrder Operations'
    },
    {
      name: 'Techs',
      description: 'Tech Operations'
    },
    {
      name: 'Jobs',
      description: 'Job Operations'
    }
  ],
  components: {
    parameters: {
      
    }
  }
};

const options: Options = {
  def,
  apis: ['./src/main/routes/*.ts'],
};

export default swaggerJSDoc(options);