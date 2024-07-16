import { GoogleAuth } from 'google-auth-library';

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

export default async function handler(req, res) {
    try {
        // Extract environment variables
        const { GOOGLE_PRIVATE_KEY, GOOGLE_CLIENT_EMAIL } = process.env;

        if (!GOOGLE_PRIVATE_KEY || !GOOGLE_CLIENT_EMAIL) {
            throw new Error("Missing required environment variables: GOOGLE_PRIVATE_KEY and GOOGLE_CLIENT_EMAIL.");
        }

        // Initialize the GoogleAuth client
        const auth = new GoogleAuth({
            credentials: {
                client_email: GOOGLE_CLIENT_EMAIL,
                private_key: GOOGLE_PRIVATE_KEY,
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

        const client = await auth.getClient();

        // Extract the spreadsheetId and range from the query parameters
        const { spreadsheetId, range } = req.query;
        if (!spreadsheetId || !range) {
            throw new Error("Missing required query parameters: spreadsheetId and range.");
        }
        console.log(`Spreadsheet ID: ${spreadsheetId}`);
        console.log(`Range: ${range}`);

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`;

        // Make the request to Google Sheets API
        const result = await client.request({ url });

        res.status(200).json({ data: result.data });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.error('Error: Requested entity was not found:', error.response.data);
            res.status(404).json({ error: "Requested entity was not found." });
        } else {
            console.error('Error generating access token:', error.message, error.stack);
            res.status(500).json({ error: `Error generating access token: ${error.message}` });
        }
    }
}