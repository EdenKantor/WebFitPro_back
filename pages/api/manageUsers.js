import { getUsers, updateUserDetails, deleteUser } from '../../lib/UsersDB';
import { getURLsByUser , deleteFromUsersLike } from '../../lib/UsersLikeDB';
import { changeLikeCount} from '../../lib/VideosDB';
import { deleteFromUserSessions } from '../../lib/UserSessionsDB'

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
            return await handlePATCHRequest(req, res);
        case 'DELETE':
            return await handleDELETERequest(req, res);    
        default:
            return res.status(405).json({ message: 'Method not allowed' })  
    }
}

/**
 * Handles GET requests and retrieves the list of users.
 */
async function handleGETRequest(req, res) {
    try {
        const users = await getUsers();
        return res.status(200).json({ users });
    } catch (error) {
        return handleError(error, res);
    }
}

/**
 * Handles PATCH requests to update user details based on the provided parameters.
 */
async function handlePATCHRequest(req, res) {
    try {
        const { username } = req.query;
        const updates = JSON.parse(req.body);

        await updateUserDetails(
            username, 
            parseInt(updates.age), 
            parseInt(updates.height),
            parseInt(updates.weight)
        );

        return res.status(200).json({ message: "Changed User Details Successfully" });
    } catch (error) {
        return handleError(error, res);
    }
}

/**
 * Handles DELETE requests to completely remove a user and their related data.
 */
async function handleDELETERequest(req, res) {
    const { username } = req.query;
    try {
      // Get all URLs liked by the user
      const userUrls = await getURLsByUser(username);
      // Update like count for each video
      for (const url of userUrls) {
          await changeLikeCount(url, -1);
      }
      const result1 = await deleteFromUserSessions(username);
      if (!result1) {
          return res.status(404).json({ message: 'Delete User session failed' });
      }
      const result2 = await deleteFromUsersLike(username);
      if (!result2) {
          return res.status(404).json({ message: 'Delete User like failed' });
      }
      const result3 = await deleteUser(username);
      if (!result3) {
          return res.status(404).json({ message: 'Delete User failed' });
      }
      return res.status(200).json({ message: "Delete user completlly succesful" });
    } catch (error) {
        return handleError(error, res);
    }
}


/**
 * Sets the CORS headers.
 */
function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

/**
 * Handles errors in the application.
 */
function handleError(error, res) {
    console.error('Internal server error:', error);
    return res.status(500).json({ message: 'Internal server error' });
}
