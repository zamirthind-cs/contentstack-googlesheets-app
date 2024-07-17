// This file is for deployment in Contentstack Launch.
import { GoogleAuth } from 'google-auth-library';

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

export async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        let { GOOGLE_PRIVATE_KEY, GOOGLE_CLIENT_EMAIL } = process.env;

        if (!GOOGLE_PRIVATE_KEY || !GOOGLE_CLIENT_EMAIL) {
            throw new Error("Missing required environment variables: GOOGLE_PRIVATE_KEY and GOOGLE_CLIENT_EMAIL.");
        }

        // Ensure the private key is correctly formatted
        GOOGLE_PRIVATE_KEY = GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

        const auth = new GoogleAuth({
            credentials: {
                client_email: GOOGLE_CLIENT_EMAIL,
                private_key: GOOGLE_PRIVATE_KEY,
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const client = await auth.getClient();

        const { spreadsheetId, range, values } = req.body;
        if (!spreadsheetId || !range || !values) {
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

        res.status(200).json({ data: response.data });
    } catch (error) {
        console.error('Error writing data to Google Sheets:', error.message, error.stack);
        res.status(500).json({ error: `Error writing data to Google Sheets: ${error.message}` });
    }
}