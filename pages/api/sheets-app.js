import { GoogleAuth } from 'google-auth-library';

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const handler = async(req, res) => {
    if (req.method === 'POST') {
        try {
            let { GOOGLE_PRIVATE_KEY, GOOGLE_CLIENT_EMAIL } = process.env;

            if (!GOOGLE_PRIVATE_KEY || !GOOGLE_CLIENT_EMAIL) {
                throw new Error("Missing required environment variables: GOOGLE_PRIVATE_KEY and GOOGLE_CLIENT_EMAIL.");
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
    } else if (req.method === 'GET') {
        try {
            let { GOOGLE_PRIVATE_KEY, GOOGLE_CLIENT_EMAIL } = process.env;

            if (!GOOGLE_PRIVATE_KEY || !GOOGLE_CLIENT_EMAIL) {
                throw new Error("Missing required environment variables: GOOGLE_PRIVATE_KEY and GOOGLE_CLIENT_EMAIL.");
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

            const { spreadsheetId, range } = req.query;
            if (!spreadsheetId || !range) {
                throw new Error("Missing required query parameters: spreadsheetId, range.");
            }
            console.log(`Spreadsheet ID: ${spreadsheetId}`);
            console.log(`Range: ${range}`);

            const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?majorDimension=ROWS`;

            const response = await client.request({
                url,
                method: 'GET',
            });

            res.status(200).json({ data: response.data });
        } catch (error) {
            console.error('Error retrieving data from Google Sheets:', error.message, error.stack);
            res.status(500).json({ error: `Error retrieving data from Google Sheets: ${error.message}` });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};

export default handler;