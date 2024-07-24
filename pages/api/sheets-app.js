import { GoogleAuth } from 'google-auth-library';

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

export default async function handler(req, res) {
    if (req.method === 'POST' || req.method === 'GET') {
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

            // Adjust to your specific parameters for spreadsheetId and range
            const { spreadsheetId, range = "CSdata!A1:H" } = req.query;
            if (!spreadsheetId) {
                throw new Error("Missing required query parameter: spreadsheetId.");
            }
            console.log(`Spreadsheet ID: ${spreadsheetId}`);
            console.log(`Range: ${range}`);

            // Read data from the specified range
            const readUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?majorDimension=ROWS`;
            const readResponse = await client.request({ url: readUrl });

            res.status(200).json({ data: readResponse.data });
        } catch (error) {
            console.error('Error accessing Google Sheets:', error.message, error.stack);
            res.status(500).json({ error: `Error accessing Google Sheets: ${error.message}` });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}