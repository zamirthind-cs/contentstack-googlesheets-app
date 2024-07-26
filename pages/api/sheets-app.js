import { GoogleAuth } from 'google-auth-library';

// Load environment variables from .env file if in development
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

export default async function handler(req, res) {
    // Ensure the request method is POST
    if (req.method === 'POST') {
        try {
            // Destructure the environment variables
            let { GOOGLE_PRIVATE_KEY, GOOGLE_CLIENT_EMAIL } = process.env;

            // Check if either variable is missing
            if (!GOOGLE_PRIVATE_KEY || !GOOGLE_CLIENT_EMAIL) {
                throw new Error("Missing required environment variables: GOOGLE_PRIVATE_KEY and GOOGLE_CLIENT_EMAIL.");
            }

            // Ensure the private key is correctly formatted
            GOOGLE_PRIVATE_KEY = GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

            // Create a new GoogleAuth instance
            const auth = new GoogleAuth({
                credentials: {
                    client_email: GOOGLE_CLIENT_EMAIL, // Use the client email from the environment variables
                    private_key: GOOGLE_PRIVATE_KEY, // Use the private key from the environment variables
                },
                scopes: ['https://www.googleapis.com/auth/spreadsheets'], // Set the scope to access Google Sheets
            });

            // Get the authenticated client
            const client = await auth.getClient();

            // Extract the request body to get spreadsheetId, range, and values
            const { spreadsheetId, range, values } = req.body;

            // Check if any of the required parameters are missing
            if (!spreadsheetId || !range || !values) {
                throw new Error("Missing required body parameters: spreadsheetId, range, values.");
            }

            // Log the parameters for debugging purposes
            console.log(`Spreadsheet ID: ${spreadsheetId}`);
            console.log(`Range: ${range}`);
            console.log(`Values: ${JSON.stringify(values)}`);

            // Construct the URL for the Google Sheets API request
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

            // Send a POST request to the Google Sheets API with the provided data
            const response = await client.request({
                url,
                method: 'POST',
                data: {
                    values: values, // Send the values in the request body
                },
            });

            // Send a 200 response with the API response data
            res.status(200).json({ data: response.data });
        } catch (error) {
            // Catch any errors, log them, and send a 500 response with the error message
            console.error('Error writing data to Google Sheets:', error.message, error.stack);
            res.status(500).json({ error: `Error writing data to Google Sheets: ${error.message}` });
        }
    } else {
        // Return a 405 error for methods other than POST
        res.status(405).json({ error: 'Method not allowed' });
    }
}