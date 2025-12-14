import { Express } from "express";
import express from "express";
import cors from "cors";
import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";
import { referenceTable } from "./utils/referenceTable";
import { BASE_URL } from "./utils/config";

export const expressApp = async (app: Express, pool: Pool) => {

    //middlewares
    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ extended: true, limit: '1mb' }));
    app.use(cors({ origin: "*" }));
    app.use(express.static(__dirname + '/public'))

    /**
     * @openapi
     * /shortitfast/{hashValue}:
     *   get:
     *     tags:
     *       - URL Shortener
     *     summary: Redirect to original URL
     *     description: Redirects the user to the original long URL associated with the provided hash value
     *     parameters:
     *       - in: path
     *         name: hashValue
     *         required: true
     *         schema:
     *           type: string
     *         description: The unique hash identifier for the shortened URL
     *         example: abc123XYZ
     *     responses:
     *       302:
     *         description: Successfully redirects to the original URL
     *         headers:
     *           Location:
     *             schema:
     *               type: string
     *             description: The original long URL
     *       404:
     *         description: URL not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: false
     *                 message:
     *                   type: string
     *                   example: URL not found
     */
    // APIs
    app.get('/shortitfast/:hashValue', (req, res) => {
        const shortUrl = `${BASE_URL}/shortitfast/${req.params.hashValue}`;
        //  Encontrar la URL original correspondiente a esta URL corta en la base de datos
        pool.query('SELECT * FROM Container WHERE shortUrl=$1', [shortUrl], (err, result) => {
            if (err) console.log(err);
            else {
                if (result.rows.length > 0) {
                    const ogUrl = result.rows[0].longurl;
                    // Redireccciona a la nueva URL
                    res.redirect(ogUrl);
                } else {
                    res.status(404).json({
                        "success": false,
                        "message": "URL not found"
                    });
                }
            }
        })
    })

    /**
     * @openapi
     * /shortitfast/postUrl:
     *   post:
     *     tags:
     *       - URL Shortener
     *     summary: Create a new shortened URL
     *     description: Generates a short URL for the provided long URL. If the URL already exists, returns the existing short URL.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - url
     *             properties:
     *               url:
     *                 type: string
     *                 format: uri
     *                 description: The long URL to be shortened
     *                 example: https://example.com/very/long/url/that/needs/shortening
     *     responses:
     *       200:
     *         description: URL successfully shortened or already exists
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Inserted the new URL
     *                 shortUrl:
     *                   type: string
     *                   example: https://shortitfast.com/shortitfast/abc123XYZ
     *                 longUrl:
     *                   type: string
     *                   example: https://example.com/very/long/url/that/needs/shortening
     *       400:
     *         description: Bad request - URL is missing or invalid
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: URL is required
     *       500:
     *         description: Internal server error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: Database error
     */
    app.post('/shortitfast/postUrl', (req, res) => {
        const ogUrl = req.body.url;

        // Verificar si una URL corta correspondiente a esta URL ya existe
        pool.query(`SELECT * FROM Container WHERE longUrl=$1`, [ogUrl], (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json({ error: "Database error" });
            } else {
                if (result.rows.length === 0) {
                    // signfica que la URL no está en la DB

                    // generar la URL corta para esta URL de entrada

                    // Paso-1: Generar un ID único para la nueva entrada de URL
                    const uuid = uuidv4();
                    var numericID = 1;
                    for (let i = 0; i < uuid.length; i++) {
                        let ch = uuid[i];
                        let val = ch.charCodeAt(0);
                        if (val >= 48 && val <= 57) {
                            numericID += (val - 48);
                        } else if (val >= 65 && val <= 90) {
                            numericID += (val - 65 + 11);
                        } else if (val >= 97 && val <= 122) {
                            numericID += (val - 97 + 73);
                        }
                    }
                    const salt = Math.ceil(Math.random() * 100) * 23 * 7;
                    numericID = numericID * salt;

                    // Paso - 2: Conversión Base 62
                    var genHashVal = "";
                    let dummyId = numericID;

                    while (dummyId > 0) {
                        const rem = dummyId % 62;
                        genHashVal += referenceTable[rem];
                        dummyId = Math.floor(dummyId / 62);
                    }
                    // se ha generado el hashValue corto
                    const hashValue = genHashVal;

                    // Paso-3: Generar tu propia URL corta a partir de este valor hash
                    var shortUrl = `${BASE_URL}/shortitfast/${hashValue}`;

                    // Paso-4: Guardar esta URL corta con la URL original en la DB
                    pool.query("INSERT INTO Container (longUrl, shortUrl) VALUES ($1, $2)", [ogUrl, shortUrl], (err, result) => {
                        if (err) { console.log(err) }
                        else { console.log(result) }
                    })

                    res.status(200).json({
                        "message": "Inserted the new URL",
                        "shortUrl": shortUrl,
                        "longUrl": ogUrl
                    })
                } else {
                    res.status(200).json({
                        "message": "URL already shortified!",
                        "shortUrl": result.rows[0].shorturl,
                        "longUrl": ogUrl
                    })
                }
            }
        })
    })
};
