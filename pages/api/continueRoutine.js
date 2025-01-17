import {getUserSessionByUserName, incrementOpenedSessions, updateVideos
    ,updateFinishedStatus, updateChecks, incrementCompleteSessions, updateAllChecks
} from '../../lib/UserSessionsDB'
import {getUniqueVideos, checkVideoByUrl, changeLikeCount} from '../../lib/VideosDB'
import {checkURLForUser, addURLForUser, removeURLForUser} from '../../lib/UsersLikeDB'

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
        default:
            return res.status(405).json({ message: 'Method not allowed' })  
    }
}


/**
 * Handles GET requests based on the 'action' query parameter.
 *
 */
async function handleGETRequest(req, res) {
    const { action } = req.query; 
    if (!action) {
        return res.status(400).json({ message: 'Action for GET are required' });
    }
    try {
        switch (action) {
            case 'getInitalUserSessionData':
                return getInitalUserSessionData(req,res);
            case 'getDoneVideoArray':
                return getDoneVideoArray(req,res);
            default:
                return res.status(400).json({ message: 'Invalid action for GET' });
        }

    } catch (error) {
    return handleError(error, res);
  }  
}


/**
 * Handles PATCH requests based on the 'action' body parameter.
 */
async function handlePATCHRequest(req, res) {
    const { action } = req.body; 
    if (!action) {
        return res.status(400).json({ message: 'Action for PATCH are required' });
    }
    try {
        switch (action) {
            case 'patchDone':
                return patchDone(req,res);
            case 'patchLikes':
                return patchLikes(req,res);
        }

    } catch (error) {
    return handleError(error, res);
  }  
}


/**
 * By getting userName retrieves session data JSON for a user.
 */
async function getInitalUserSessionData(req, res) {
    try {
        const { userName } = req.query;
        // Validate the input
        if (!userName) {
            return res.status(400).json({ message: 'userName is missing' });
        }

        // Retrieve user session data
        const userSessionsJSON = await getRelevantData(userName);
        if (!userSessionsJSON) {
            return res.status(404).json({ message: 'User session not found for this user' });
        }

        // Retrieve detailed video information
        const videosOfSession = userSessionsJSON.videos;
        userSessionsJSON.videos = await getVideos(videosOfSession);

        // Retrieve like status for videos
        userSessionsJSON.likes = await getLikes(userName, videosOfSession);

        return res.status(200).json(userSessionsJSON);

    } catch (error) {
        return handleError(error, res);
    }
}


/**
 * get userName and the boolean array represent the checks the user
 * have checked a exercise he has done
 */
async function getDoneVideoArray(req, res) {
    try {
    const { userName} = req.query;
    if(!userName){
        return res.status(400).json({message: 'userName or videosChecks are missing'});
    }

    //get the array of done to check if user finished all the exercise
    const userSessionJSON = await getUserSessionByUserName(userName);
    const videosChecks = userSessionJSON.checks;

    let counterChecks = 0;

    //count how many challenges the user checked he finished
    for (let i = 0; i < 3; i++) {
        if (videosChecks[i]) {
            counterChecks++;
        } 
    }

    //scenerio the user finished all his challanges
    if(counterChecks==3){
        await incrementCompleteSessions(userName);
        await updateFinishedStatus(userName,true);
    }

    return res.status(200).json({counterChecks});

    } catch (error) {
        return handleError(error, res);
    }
}

/**
 * Retrieves session data for a user, initializing a new session if necessary.
 */
async function getRelevantData(userName) {
    try {
        let userSession = await getUserSessionByUserName(userName);

        if (!userSession) {
            console.error('No user session found for:', userName);
            return null;
        }

        // Handle case where the session is complete
        if (userSession.finished) {
            const newVideos = await getUniqueVideos();

            await updateVideos(userName, newVideos),
            await updateAllChecks(userName),
            await updateFinishedStatus(userName, false),
            await incrementOpenedSessions(userName)
    

            // Retrieve the updated session
            userSession = await getUserSessionByUserName(userName);
        }

        return userSession;

    } catch (error) {
        return handleError(error, res);
    }
}

/**
 * Retrieves detailed video information for a given list of video URLs.
 */
async function getVideos(videos) {
    try {
        const videoDetails = await Promise.all(
            videos.map(async (url) => {
                const video = await checkVideoByUrl(url);
                if (!video) {
                    throw new Error(`Video not found for URL: ${url}`);
                }
                return video;
            })
        );

        return videoDetails;

    } catch (error) {
        return handleError(error, res);
    }
}


/**
 * Retrieves like statuses for the user's videos in his session.
 */
async function getLikes(userName, videos) {
    try {
        const likes = await Promise.all(
            videos.map((url) => checkURLForUser(userName, url))
        );
        return likes;

    } catch (error) {
        return handleError(error, res);
    }
}



/**
 * get userName, url of exercise, and boolean which indicates
 * if the like action is like (true) or unlike(false)
 */
async function patchLikes(req, res) {
    try {
    const { userName, url, likeAction } = req.body;
    if(!userName || !url){
        return res.status(400).json({message: 'one of the component are missing'});
    }
    //check if the url already exist in the user likes before
    let exist = await checkURLForUser(userName,url); 

    //if the user has liked the video
    if (likeAction && !exist){
        await addURLForUser(userName,url);
        await changeLikeCount(url, 1);
    }
    //if the user unliked the video
    else if(!likeAction && exist){ 
        await removeURLForUser(userName,url);
        await changeLikeCount(url, -1);
    }

    return res.status(200).json({message: 'Update checks complete'});
 

    } catch (error) {
        return handleError(error, res);
    }
}

/**
 * get userName, index of the exercise in the videos array, and boolean which indicates
 * if the done action is pressed (true) or not(false)
 */
async function patchDone(req, res) {
    try {
    const { userName, index, doneAction } = req.body;
    if(!userName){
        return res.status(400).json({message: 'one of the component are missing'});
    }
    
    await updateChecks(userName, doneAction, index);
   
    return res.status(200).json({message: 'Update done complete'});
 

    } catch (error) {
        return handleError(error, res);
    }
}


// Function to set CORS headers
function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}


// Function to handle errors
function handleError(error, res) {
    console.error('Internal server error:', error);
    return res.status(500).json({ message: 'Internal server error', error });
}
