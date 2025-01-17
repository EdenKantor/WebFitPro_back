import { getPendingUsers, registerUser } from '../../lib/UsersDB';

/**
 * Receives the user's request and processes it based on the method.
 */
export default async function handler(req, res) {
    setCorsHeaders(res);

    switch (req.method) {
        case 'OPTIONS':
            return res.status(200).end();
        case 'GET':
            return await handleGETRequest(req, res);
        case 'PATCH':
            return await handlePATCHRequest(req, res);
        default:
            return res.status(405).json({ message: 'Method not allowed' });
    }
}

/**
 * Handles GET requests to fetch pending users.
 */
async function handleGETRequest(req, res) {
    try {
        const users = await getPendingUsers();
        return res.status(200).json({ users });
    } catch (error) {
        return handleError(error, res);
    }
}

/**
 * Handles PATCH requests to update user registration status.
 */
async function handlePATCHRequest(req, res) {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    try {
        await registerUser(username);
        return res.status(200).json({ message: "Changed Status isRegistered Successfully" });
    } catch (error) {
        return handleError(error, res);
    }
}

/**
 * Sets the CORS headers.
 */
function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

/**
 * Handles errors in the application.
 */
function handleError(error, res) {
    console.error('Internal server error:', error);
    return res.status(500).json({ message: 'Internal server error' });
}
