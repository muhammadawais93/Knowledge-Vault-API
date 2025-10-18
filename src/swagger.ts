import path from 'path';
import YAML from 'yamljs';

// Load the OpenAPI specification from a YAML file
export const swaggerDocument = YAML.load(path.join(__dirname, './docs/openapi.yaml'));

// Override server URL based on environment
if (process.env.NODE_ENV === 'production') {
  swaggerDocument.servers = [
    {
      url: 'https://api.knowledgevault.com',
      description: 'Production server',
    },
  ];
} else {
  const port = process.env.PORT || 3000;
  swaggerDocument.servers = [
    {
      url: `http://localhost:${port}`,
      description: 'Development server',
    },
  ];
}
