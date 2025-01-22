import { getUserByUsername, updateUserDetails } from '../../lib/UsersDB';
import {  getUserSessionByUserName } from '../../lib/UserSessionsDB';

/**
 * Receives the user's request and processes it based on the preferred method.
 */
export default async function handler(req, res) {
    setCorsHeaders(res);
    
    switch(req.method){
        case 'OPTIONS':
            return res.status(200).end();
        case 'GET':
            return await handleGETRequest(req, res);
        case 'PATCH':
            return handlePatchRequest(req, res);
            default:
            return res.status(405).json({ message: 'Method not allowed' })  
    }
}

/**
 * Handles GET requests based on the 'action' query parameter.
 */
async function handleGETRequest(req, res) {
    const { action } = req.query; 
    if (!action) {
        return res.status(400).json({ message: 'Action for GET are required' });
    }
    try {
        switch (action) {
            case 'getUserData':
                return getUserData(req,res);
            case 'getUserSessionsData':
                return getUserSessionsData(req,res);
            default:
                return res.status(400).json({ message: 'Invalid action for GET' });
        }

    } catch (error) {
    return handleError(error, res);
  }  
}

/**
 * Retrieves user data based on the provided username.
 * Gets userName from the query parameters.
 * Returns the user data if the user exists.
 */
async function getUserData(req, res) {
    const { userName } = req.query;
    if (!userName) {
        return res.status(400).json({ message: 'Username is required' });
    }

    try {
        const user = await getUserByUsername(userName);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ user });
    } catch (error) {
        return handleError(error, res);
    }
}

/**
 * Updates user details based on the provided information.
 * Gets userName, age, height, and weight from the request body.
 * Updates the user details if the user exists.
 */
async function handlePatchRequest(req, res) {
    const { userName, age, height, weight } = req.body;
    if (!userName || age == null || height == null || weight == null) {
        return res.status(400).json({ message: 'Username, age, height, and weight are required' });
    }

    try {
        const result = await updateUserDetails(userName, age, height, weight);
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'User details updated successfully' });
    } catch (error) {
        return handleError(error, res);
    }
}

/**
 * Retrieves session data for a user based on their username.
 * Gets userName from the query parameters.
 * Returns the user session data if the user exists.
 */
async function getUserSessionsData(req, res) {
    const { userName } = req.query;
    if (!userName) {
        return res.status(400).json({ message: 'Username is required' });
    }

    try {
        const user = await getUserSessionByUserName(userName);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ user });
    } catch (error) {
        return handleError(error, res);
    }
}


// Function to set CORS headers
function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}


// Function to handle errors
function handleError(error, res) {
    console.error('Internal server error:', error);
    return res.status(500).json({ message: 'Internal server error', error });
}
