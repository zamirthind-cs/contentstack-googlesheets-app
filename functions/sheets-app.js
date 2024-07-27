import { GoogleAuth } from 'google-auth-library';

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const handler = async(req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    try {
        console.log("Request method:", req.method);
        console.log("Request query:", req.query);
        console.log("Request body:", req.body);

        let { GOOGLE_PRIVATE_KEY, GOOGLE_CLIENT_EMAIL } = process.env;

        // Check if environment variables are set
        if (!GOOGLE_PRIVATE_KEY || !GOOGLE_CLIENT_EMAIL) {
            console.error("Environment variables not set correctly.");
            throw new Error("Missing required environment variables: GOOGLE_PRIVATE_KEY and GOOGLE_CLIENT_EMAIL.");
        }

        console.log("Environment variables are set.");

        // Ensure the private key is correctly formatted
        if (GOOGLE_PRIVATE_KEY.startsWith('"') && GOOGLE_PRIVATE_KEY.endsWith('"')) {
            GOOGLE_PRIVATE_KEY = GOOGLE_PRIVATE_KEY.slice(1, -1);
        }
        GOOGLE_PRIVATE_KEY = GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

        const auth = new GoogleAuth({
            credentials: {
                client_email: GOOGLE_CLIENT_EMAIL,
                private_key: GOOGLE_PRIVATE_KEY,
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const client = await auth.getClient();

        if (req.method === 'POST') {
            const { spreadsheetId, range, values } = req.body;

            if (!spreadsheetId || !range || !values) {
                console.error("Missing required body parameters.");
                throw new Error("Missing required body parameters: spreadsheetId, range, values.");
            }

            console.log(`Spreadsheet ID: ${spreadsheetId}`);
            console.log(`Range: ${range}`);
            console.log(`Values: ${JSON.stringify(values)}`);

            const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

            const response = await client.request({
                url,
                method: 'POST',
                data: {
                    values: values,
                },
            });

            console.log("POST request successful:", response.data);
            res.status(200).json({ data: response.data });
        } else if (req.method === 'GET') {
            const { spreadsheetId, range } = req.query;

            if (!spreadsheetId || !range) {
                console.error("Missing required query parameters.");
                throw new Error("Missing required query parameters: spreadsheetId, range.");
            }

            console.log(`Spreadsheet ID: ${spreadsheetId}`);
            console.log(`Range: ${range}`);

            const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?majorDimension=ROWS`;

            const response = await client.request({
                url,
                method: 'GET',
            });

            console.log("GET request successful:", response.data);
            res.status(200).json({ data: response.data });
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error(`Error processing request: ${error.message}`, error.stack);
        res.status(500).json({ error: `Error processing request: ${error.message}` });
    }
};

export default handler;