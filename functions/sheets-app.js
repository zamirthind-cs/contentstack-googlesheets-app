import { GoogleAuth } from 'google-auth-library'; // Import the GoogleAuth library for authentication

if (process.env.NODE_ENV !== 'production') { // Check if the environment is not production
    require('dotenv').config(); // Load environment variables from a .env file if in development
}

export async function handler(req, res) { // Define the handler function for the request
    if (req.method === 'POST') { // Handle POST requests
        try {
            let { GOOGLE_PRIVATE_KEY, GOOGLE_CLIENT_EMAIL } = process.env; // Destructure the environment variables

            if (!GOOGLE_PRIVATE_KEY || !GOOGLE_CLIENT_EMAIL) { // Check if either variable is missing
                throw new Error("Missing required environment variables: GOOGLE_PRIVATE_KEY and GOOGLE_CLIENT_EMAIL."); // Throw an error if missing
            }

            // Ensure the private key is correctly formatted
            GOOGLE_PRIVATE_KEY = GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'); // Replace escaped newline characters with actual newlines

            const auth = new GoogleAuth({ // Create a new GoogleAuth instance
                credentials: {
                    client_email: GOOGLE_CLIENT_EMAIL, // Use the client email from the environment variables
                    private_key: GOOGLE_PRIVATE_KEY, // Use the private key from the environment variables
                },
                scopes: ['https://www.googleapis.com/auth/spreadsheets'], // Set the scope to access Google Sheets
            });

            const client = await auth.getClient(); // Get the authenticated client

            const { spreadsheetId, range, values } = req.body; // Destructure the request body to get spreadsheetId, range, and values
            if (!spreadsheetId || !range || !values) { // Check if any of the required parameters are missing
                throw new Error("Missing required body parameters: spreadsheetId, range, values."); // Throw an error if missing
            }
            console.log(`Spreadsheet ID: ${spreadsheetId}`); // Log the spreadsheet ID
            console.log(`Range: ${range}`); // Log the range
            console.log(`Values: ${JSON.stringify(values)}`); // Log the values

            const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`; // Construct the URL for the API request

            const response = await client.request({ // Make the API request
                url, // Use the constructed URL
                method: 'POST', // Use the POST method
                data: {
                    values: values, // Send the values in the request body
                },
            });

            res.status(200).json({ data: response.data }); // Send a 200 response with the API response data
        } catch (error) { // Catch any errors
            console.error('Error writing data to Google Sheets:', error.message, error.stack); // Log the error
            res.status(500).json({ error: `Error writing data to Google Sheets: ${error.message}` }); // Send a 500 response with the error message
        }
    } else if (req.method === 'GET') { // Handle GET requests
        try {
            let { GOOGLE_PRIVATE_KEY, GOOGLE_CLIENT_EMAIL } = process.env; // Destructure the environment variables

            if (!GOOGLE_PRIVATE_KEY || !GOOGLE_CLIENT_EMAIL) { // Check if either variable is missing
                throw new Error("Missing required environment variables: GOOGLE_PRIVATE_KEY and GOOGLE_CLIENT_EMAIL."); // Throw an error if missing
            }

            // Ensure the private key is correctly formatted
            GOOGLE_PRIVATE_KEY = GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'); // Replace escaped newline characters with actual newlines

            const auth = new GoogleAuth({ // Create a new GoogleAuth instance
                credentials: {
                    client_email: GOOGLE_CLIENT_EMAIL, // Use the client email from the environment variables
                    private_key: GOOGLE_PRIVATE_KEY, // Use the private key from the environment variables
                },
                scopes: ['https://www.googleapis.com/auth/spreadsheets'], // Set the scope to access Google Sheets
            });

            const client = await auth.getClient(); // Get the authenticated client

            const { spreadsheetId, range } = req.query; // Destructure the query parameters to get spreadsheetId and range
            if (!spreadsheetId || !range) { // Check if any of the required parameters are missing
                throw new Error("Missing required query parameters: spreadsheetId, range."); // Throw an error if missing
            }
            console.log(`Spreadsheet ID: ${spreadsheetId}`); // Log the spreadsheet ID
            console.log(`Range: ${range}`); // Log the range

            const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?majorDimension=ROWS`; // Construct the URL for the API request

            const response = await client.request({ // Make the API request
                url, // Use the constructed URL
                method: 'GET', // Use the GET method
            });

            res.status(200).json({ data: response.data }); // Send a 200 response with the API response data
        } catch (error) { // Catch any errors
            console.error('Error retrieving data from Google Sheets:', error.message, error.stack); // Log the error
            res.status(500).json({ error: `Error retrieving data from Google Sheets: ${error.message}` }); // Send a 500 response with the error message
        }
    } else { // Handle other methods
        res.status(405).json({ error: 'Method not allowed' }); // Return a 405 error for methods other than POST or GET
    }
}