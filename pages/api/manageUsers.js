import { getUsers, updateUserDetails, deleteUser } from '../../lib/UsersDB';
import { getURLsByUser , deleteFromUsersLike } from '../../lib/UsersLikeDB';
import { changeLikeCount} from '../../lib/VideosDB';
import { deleteFromUserSessions } from '../../lib/UserSessionsDB'

/**
 * Receives the user's request and processes it based on the preferred method.
 */
export default async function handler(req, res) {
    setCorsHeaders(res);

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        if (req.method === 'GET') {
            const users = await getUsers();
            return res.status(200).json({ users });
        }

        if (req.method === 'PATCH') {
            const { username } = req.query;
            const updates = JSON.parse(req.body);

            await updateUserDetails(
                username, 
                parseInt(updates.age), 
                parseInt(updates.height),
                parseInt(updates.weight)
            );

            return res.status(200).json({ message: "Changed User Details Successfully" });
        }

        if (req.method === 'DELETE') {
            const { username } = req.query;
            console.log("here", username);
            try {
            // Get all URLs liked by the user
                const userUrls = await getURLsByUser(username);
                console.log("UserURLS");
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
                return res.status(500).json({ message: error });
            }
        }

        res.status(405).json({ error: "Method not allowed" });
    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}