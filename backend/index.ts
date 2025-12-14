//ARCHIVO DE PRUEBA, FUNCIONA POR TERMINAL

import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { PORT } from "./utils/config";
import * as database from "./data/database";
import { expressApp } from "./express-app";
import { swaggerSpec } from "./config/swagger";

const startserver = async () => {
    const app = express();

    // Habilita CORS y el parseo de JSON PRIMERO
    app.use(cors());
    app.use(express.json());

    // Sirve la especificación de OpenAPI como JSON para consumo por parte de la interfaz de usuario
    app.get('/api/openapi.json', (req, res) => {
        res.json(swaggerSpec);
    });

    // Personaliza el CSS de Swagger UI para darle un aspecto moderno 
    //TODO: Verificar el diseño de este awrchivo y pasarlo a frontend si es posible, actualmente, el diseño tiene ciertos erroes
    const customCss = `
        /* Hide default Swagger branding */
        .swagger-ui .topbar { display: none !important; }
        
        /* Modern font stack */
        .swagger-ui {
            font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
        }
        
        /* Container - centered with max-width */
        .swagger-ui .wrapper {
            max-width: 1200px !important;
            margin: 0 auto !important;
            padding: 40px 20px !important;
        }
        
        /* Clean white background */
        body {
            background: #ffffff !important;
        }
        
        .swagger-ui {
            background: #ffffff !important;
        }
        
        /* Info section styling */
        .swagger-ui .info {
            margin: 30px 0 !important;
        }
        
        .swagger-ui .info .title {
            color: #6d28d9 !important;
            font-size: 2.5rem !important;
            font-weight: 700 !important;
            margin-bottom: 16px !important;
        }
        
        .swagger-ui .info .description {
            color: #1f2937 !important;
            font-size: 1.125rem !important;
            line-height: 1.75 !important;
            font-weight: 400 !important;
        }
        
        .swagger-ui .info p,
        .swagger-ui .info li {
            color: #374151 !important;
        }
        
        .swagger-ui .info a {
            color: #6d28d9 !important;
            font-weight: 600 !important;
        }
        
        /* Server selection */
        .swagger-ui .scheme-container {
            background: #f9fafb !important;
            border: 1px solid #e5e7eb !important;
            border-radius: 12px !important;
            padding: 20px !important;
            margin: 20px 0 !important;
            box-shadow: none !important;
        }
        
        /* Tag sections */
        .swagger-ui .opblock-tag {
            background: linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%) !important;
            color: white !important;
            border: none !important;
            border-radius: 12px !important;
            padding: 16px 24px !important;
            margin: 30px 0 20px 0 !important;
            font-size: 1.25rem !important;
            font-weight: 600 !important;
            box-shadow: 0 4px 6px -1px rgba(109, 40, 217, 0.2) !important;
        }
        
        .swagger-ui .opblock-tag:hover {
            background: linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%) !important;
        }
        
        /* Endpoint blocks - modern rounded design */
        .swagger-ui .opblock {
            border: 2px solid #e5e7eb !important;
            border-radius: 12px !important;
            margin: 16px 0 !important;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1) !important;
            background: #ffffff !important;
            overflow: hidden !important;
        }
        
        .swagger-ui .opblock:hover {
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
        }
        
        /* HTTP method badges - Purple theme */
        .swagger-ui .opblock-summary-method {
            background: #6d28d9 !important;
            color: white !important;
            border-radius: 8px !important;
            font-weight: 600 !important;
            min-width: 80px !important;
            text-align: center !important;
        }
        
        .swagger-ui .opblock.opblock-post .opblock-summary-method {
            background: #6d28d9 !important;
        }
        
        .swagger-ui .opblock.opblock-get .opblock-summary-method {
            background: #8b5cf6 !important;
        }
        
        .swagger-ui .opblock.opblock-put .opblock-summary-method {
            background: #a78bfa !important;
        }
        
        .swagger-ui .opblock.opblock-delete .opblock-summary-method {
            background: #c084fc !important;
        }
        
        /* Endpoint summary */
        .swagger-ui .opblock-summary-path {
            color: #111827 !important;
            font-weight: 600 !important;
            font-family: 'Monaco', 'Courier New', monospace !important;
            font-size: 0.95rem !important;
        }
        
        .swagger-ui .opblock-summary-description {
            color: #374151 !important;
            font-weight: 500 !important;
        }
        
        .swagger-ui .opblock-description-wrapper p {
            color: #1f2937 !important;
            font-size: 0.95rem !important;
            line-height: 1.6 !important;
        }
        
        /* Try it out button - Purple */
        .swagger-ui .btn.try-out__btn {
            background: #6d28d9 !important;
            color: white !important;
            border: none !important;
            border-radius: 8px !important;
            padding: 10px 20px !important;
            font-weight: 600 !important;
            transition: all 0.2s ease !important;
        }
        
        .swagger-ui .btn.try-out__btn:hover {
            background: #5b21b6 !important;
            box-shadow: 0 4px 12px rgba(109, 40, 217, 0.3) !important;
            transform: translateY(-1px) !important;
        }
        
        /* Execute button - Purple gradient */
        .swagger-ui .btn.execute {
            background: linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%) !important;
            color: white !important;
            border: none !important;
            border-radius: 8px !important;
            padding: 12px 32px !important;
            font-weight: 600 !important;
            font-size: 1rem !important;
            transition: all 0.2s ease !important;
        }
        
        .swagger-ui .btn.execute:hover {
            background: linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%) !important;
            box-shadow: 0 8px 16px rgba(109, 40, 217, 0.3) !important;
            transform: translateY(-2px) !important;
        }
        
        /* Cancel button */
        .swagger-ui .btn.cancel {
            background: #6b7280 !important;
            color: white !important;
            border: none !important;
            border-radius: 8px !important;
            padding: 10px 20px !important;
        }
        
        .swagger-ui .btn.cancel:hover {
            background: #4b5563 !important;
        }
        
        /* Authorize button - Purple */
        .swagger-ui .btn.authorize {
            background: #6d28d9 !important;
            color: white !important;
            border: none !important;
            border-radius: 8px !important;
            padding: 8px 16px !important;
            font-weight: 600 !important;
        }
        
        .swagger-ui .btn.authorize:hover {
            background: #5b21b6 !important;
        }
        
        /* Hide authorize button if not needed */
        .swagger-ui .auth-wrapper { display: none !important; }
        
        /* Parameters section */
        .swagger-ui .parameters-col_description {
            color: #1f2937 !important;
            font-weight: 400 !important;
        }
        
        .swagger-ui .parameter__name {
            color: #111827 !important;
            font-weight: 600 !important;
        }
        
        .swagger-ui .parameter__type {
            color: #6d28d9 !important;
            font-weight: 500 !important;
        }
        
        .swagger-ui table thead tr th {
            color: #111827 !important;
            font-weight: 700 !important;
            border-bottom: 2px solid #e5e7eb !important;
            font-size: 0.875rem !important;
        }
        
        .swagger-ui table tbody tr td {
            color: #374151 !important;
            font-size: 0.875rem !important;
        }
        
        /* Input fields */
        .swagger-ui input[type=text],
        .swagger-ui input[type=password],
        .swagger-ui input[type=email],
        .swagger-ui textarea,
        .swagger-ui select {
            border: 2px solid #e5e7eb !important;
            border-radius: 8px !important;
            padding: 10px 12px !important;
            font-size: 0.875rem !important;
            transition: border-color 0.2s ease !important;
        }
        
        .swagger-ui input[type=text]:focus,
        .swagger-ui textarea:focus,
        .swagger-ui select:focus {
            border-color: #6d28d9 !important;
            outline: none !important;
            box-shadow: 0 0 0 3px rgba(109, 40, 217, 0.1) !important;
        }
        
        /* Response section */
        .swagger-ui .responses-wrapper {
            margin-top: 20px !important;
        }
        
        .swagger-ui .response-col_status {
            color: #6d28d9 !important;
            font-weight: 700 !important;
        }
        
        .swagger-ui .response-col_description {
            color: #1f2937 !important;
            font-weight: 500 !important;
        }
        
        .swagger-ui .response-col_description p {
            color: #374151 !important;
        }
        
        /* Code blocks */
        .swagger-ui .highlight-code {
            background: #1f2937 !important;
            border-radius: 8px !important;
            padding: 16px !important;
        }
        
        .swagger-ui .microlight {
            color: #e5e7eb !important;
        }
        
        /* Models section - cleaner look */
        .swagger-ui .model-box {
            background: #f9fafb !important;
            border: 1px solid #e5e7eb !important;
            border-radius: 8px !important;
            padding: 16px !important;
        }
        
        .swagger-ui .model-title {
            color: #1f2937 !important;
            font-weight: 600 !important;
        }
        
        .swagger-ui .model {
            color: #4b5563 !important;
        }
        
        /* Hide schemas section if not needed */
        .swagger-ui .models { display: none !important; }
        
        /* Download button */
        .swagger-ui .download-contents {
            background: #6d28d9 !important;
            color: white !important;
            border-radius: 8px !important;
            padding: 8px 16px !important;
        }
        
        /* Links */
        .swagger-ui a {
            color: #6d28d9 !important;
            text-decoration: none !important;
        }
        
        .swagger-ui a:hover {
            color: #5b21b6 !important;
            text-decoration: underline !important;
        }
        
        /* Loading animation */
        .swagger-ui .loading-container {
            color: #6d28d9 !important;
        }
    `;

    // Swagger UI setup con un tema moderno
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        customCss,
        customSiteTitle: 'ShortItFast API Docs',
        customfavIcon: '/favicon.svg',
        swaggerOptions: {
            persistAuthorization: true,
            displayRequestDuration: true,
            filter: true,
            syntaxHighlight: {
                theme: 'monokai'
            }
        },
        customJs: '/swagger-custom.js',
    }));

    // custom JavaScript para Swagger UI
    app.get('/swagger-custom.js', (req, res) => {
        res.type('application/javascript');
        res.send(`
            // Wait for Swagger UI to load
            window.addEventListener('load', function() {
                setTimeout(function() {
                    const infoContainer = document.querySelector('.information-container');
                    if (infoContainer) {
                        // Make the ::after pseudo-element clickable by adding a real button
                        const docsButton = document.createElement('a');
                        docsButton.href = '/docs';
                        docsButton.className = 'custom-docs-button';
                        docsButton.innerHTML = '📚 View Full Documentation →';
                        docsButton.style.cssText = \`
                            display: block;
                            background: #84cc16;
                            color: white;
                            padding: 12px 24px;
                            border-radius: 12px;
                            margin: -12px auto 24px auto;
                            width: fit-content;
                            font-weight: 600;
                            box-shadow: 0 4px 6px -1px rgba(132, 204, 22, 0.3);
                            cursor: pointer;
                            transition: all 0.2s;
                            text-decoration: none;
                            font-family: sans-serif;
                        \`;
                        
                        docsButton.addEventListener('mouseenter', function() {
                            this.style.background = '#65a30d';
                            this.style.boxShadow = '0 0 20px rgba(132, 204, 22, 0.5)';
                            this.style.transform = 'translateY(-2px)';
                        });
                        
                        docsButton.addEventListener('mouseleave', function() {
                            this.style.background = '#84cc16';
                            this.style.boxShadow = '0 4px 6px -1px rgba(132, 204, 22, 0.3)';
                            this.style.transform = 'translateY(0)';
                        });
                        
                        infoContainer.insertBefore(docsButton, infoContainer.firstChild.nextSibling);
                    }
                }, 500);
            });
        `);
    });

    await expressApp(app, database.pool);


    app.listen(PORT, () => {
        console.log(`listening on port ${PORT}`);
        console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
    })
        .on("error", (err) => {
            console.error("Error starting server:", err);
            process.exit(1);
        });
};

startserver();