import {getUserByUsername } from '../../lib/UsersDB';

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

      const { username, password } = req.query;
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }

      try {
        const user = await getUserByUsername(username);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        // Handle user authentication and role verification
        return await handleUserAuthentication(user, password, res);
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

/**
 * Authenticates a user based on the provided username and password.
 * Gets user object and password.
 * Returns the user object if the password is valid, or an error message if not.
 */
async function handleUserAuthentication(user, password, res) {  

    const isPasswordValid = password === user.password;
    if ( isPasswordValid) {
        return res.status(200).json({user});

    } else {
        // Invalid password
        return res.status(401).json({ message: 'Incorrect password' });
    }
}

// Function to handle errors
function handleError(error, res) {
    console.error('Internal server error:', error);
    return res.status(500).json({ message: 'Internal server error', error });
}