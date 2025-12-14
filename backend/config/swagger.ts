import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ShortItFast API',
            version: '1.0.0',
            description: 'Simple REST API for URL shortening. Perfect for integrating into your projects.',
            contact: {
                name: 'API Support',
                url: 'https://github.com/Crisiszzz07',
            },
        },
        servers: [
            {
                url: 'http://localhost:3001',
                description: 'Local development server',
            },
            {
                url: 'https://your-production-domain.com',
                description: 'Production server',
            },
        ],
        tags: [
            {
                name: 'URL Shortener',
                description: 'Endpoints for URL shortening operations',
            },
        ],
    },
    apis: ['./backend/**/*.ts'], // Directorio de los archivos
};

export const swaggerSpec = swaggerJsdoc(options);
