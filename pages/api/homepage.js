import {getRandomQuote } from '../../lib/QuotesDB';

/**
 * Receives the user's request and processes it based on the preferred method.
 */
export default async function handler(req, res) {
    setCorsHeaders(res);

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    //handle GET request
    if (!isGetMethod(req)) {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    
    try {
        const quote = await getRandomQuote();
        if (!quote) {
            return res.status(404).json({ message: 'failed to get quote' });
        }
        return res.status(200).json({quote});
    } catch (error) {
        return handleError(error, res);
    }
    
}    

// Function to set CORS headers
function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Function to check if the request method is GET
function isGetMethod(req) {
    return req.method === 'GET';
}

// Function to handle errors
function handleError(error, res) {
    console.error('Internal server error:', error);
    return res.status(500).json({ message: 'Internal server error', error });
}    