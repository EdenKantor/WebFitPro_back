import { getUserByUsername, addNewUser, deleteUser } from '../../lib/UsersDB';
import { createNewUserLike } from '../../lib/UsersLikeDB';
import { createUserSession } from '../../lib/UserSessionsDB';

/**
 * Receives the user's request and processes it based on the preferred method.
 */
export default async function handler(req, res) {
    setCorsHeaders(res);
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    //Handles POST request
    if (!isPostMethod(req)) {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { userName, age, gender, height, password, weight } = req.body;

    if (!userName || !age || !gender || !height || !password || !weight) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if the user already exists
        const userExists = await getUserByUsername(userName);
        if (userExists) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Add new user
        const result = await addNewUser(userName, age, gender, height, password, weight);
        if (result.acknowledged) {
            const resultOfUserLike = await createNewUserLike(userName);
            if(!resultOfUserLike.acknowledged){
                result = await deleteUser(userName);
                return res.status(500).json({ message: 'Failed to cretae user_like object' });
            }
            await createUserSession(userName);
            return res.status(200).json({ message: 'User registered successfully' });
        } else {
            return res.status(500).json({ message: 'Failed to register user' });
        }
    } catch (error) {
        return handleError(error, res);
    }
}

// Function to set CORS headers
function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Function to check if the request method is POST
function isPostMethod(req) {
    return req.method === 'POST';
}

// Function to handle errors
function handleError(error, res) {
    console.error('Internal server error:', error);
    return res.status(500).json({ message: 'Internal server error', error });
}
