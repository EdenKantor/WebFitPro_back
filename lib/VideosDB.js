import connectToDatabase from './mongodb';

const { db } = await connectToDatabase();

/**
 * change the like count of a video by 1 or -1.
 * @param {string} url - The URL of the video.
 * @param {Number} action - 1 or -1 if we wanted to increase or decrease
 * @returns {Object} - Updated video document or null if not found.
 */
export async function changeLikeCount(url, action) {
  const updatedVideo = await db.collection('Videos').findOneAndUpdate(
    { url: url },
    { $inc: { likeCount: action } },
    { returnDocument: 'after' }
  );
  return updatedVideo.value;
}

/**
 * Add a new video to the database.
 * @param {string} url - The URL of the video.
 * @param {string} difficulty - The difficulty level of the video.
 * @param {string} bodyPart - The body part targeted by the video.
 * @param {string} title - The title of the video.
 * @returns {Object} - The inserted video document.
 */
export async function addNewVideo(url, difficulty, bodyPart, title) {
  const newVideo = {
    url: url,
    likeCount: 0,
    difficulty: difficulty,
    bodyPart: bodyPart,
    title: title,
  };

  const result = await db.collection('Videos').insertOne(newVideo);
  return result.ops[0];
}

/**
 * Delete a video from the database.
 * @param {string} url - The URL of the video.
 * @returns {Object} - Deleted video document or null if not found.
 */
export async function deleteVideo(url) {
  const deletedVideo = await db.collection('Videos').findOneAndDelete(
    { url: url }
  );
  return deletedVideo.value;
}

/**
 * Check if a video exists by URL and return its JSON.
 * @param {string} url - The URL of the video.
 * @returns {Object} - The video document if found, otherwise null.
 */
export async function checkVideoByUrl(url) {
  const video = await db.collection('Videos').findOne({ url: url });
  return video;
}

/**
 * Get three unique videos, one random video from each difficulty level.
 * @returns {Array<string>} - Array of 3 unique video URLs.
 */
export async function getUniqueVideos() {
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  const promises = difficulties.map(async (difficulty) => {
    const pipeline = [
      { $match: { difficulty } }, // Match the specific difficulty level
      { $sample: { size: 1 } }, // Randomly select one document
      { $project: { _id: 0, url: 1 } }, // Keep only the URL field
    ];

    const [result] = await db.collection('Videos').aggregate(pipeline).toArray();
    return result ? result.url : null;
  });

  const videoUrls = await Promise.all(promises);

  return videoUrls.filter(Boolean); // Filter out any nulls in case a difficulty has no videos
}

/**
 * Get videos sorted by title.
 * @param {string} bodyPart - The body part to filter by.
 * @param {boolean} ascending - Pass true for A-Z, false for Z-A.
 * @returns {Array<Object>} - Array of videos sorted by title.
 */
export async function getVideosSortedByTitle(bodyPart, ascending) {
  const sortOrder = ascending ? 1 : -1;
  const videos = await db.collection('Videos')
    .find({ bodyPart })
    .sort({ title: sortOrder })
    .toArray();
  return videos;
}


/**
 * Get videos sorted by like count.
 * @param {string} bodyPart - The body part to filter by.
 * @param {boolean} highestFirst - Pass true for highest to lowest, false for lowest to highest.
 * @returns {Array<Object>} - Array of videos sorted by like count.
 */
export async function getVideosSortedByLikeCount(bodyPart, highestFirst) {
  const sortOrder = highestFirst ? -1 : 1;
  const videos = await db.collection('Videos')
    .find({ bodyPart })
    .sort({ likeCount: sortOrder })
    .toArray();
  return videos;
}


/**
 * Get videos sorted by difficulty.
 * @param {string} bodyPart - The body part to filter by.
 * @param {boolean} beginnerFirst - Pass true for Beginner -> Intermediate -> Advanced,
 *                                  false for Advanced -> Intermediate -> Beginner.
 * @returns {Array<Object>} - Array of videos sorted by difficulty.
 */
export async function getVideosSortedByDifficulty(bodyPart, beginnerFirst) {
  const difficultyOrder = beginnerFirst
    ? ['Beginner', 'Intermediate', 'Advanced']
    : ['Advanced', 'Intermediate', 'Beginner'];

  const videos = await db.collection('Videos')
    .aggregate([
      { $match: { bodyPart } }, // Filter by body part
      {
        $addFields: {
          difficultyOrder: {
            $indexOfArray: [difficultyOrder, '$difficulty'],
          },
        },
      },
      { $sort: { difficultyOrder: 1 } },
      { $project: { difficultyOrder: 0 } },
    ])
    .toArray();

  return videos;
}


/**
 * Get videos related to a specific body part.
 * @param {string} bodyPart - The body part to filter by.
 * @returns {Array<Object>} - Array of videos related to the body part.
 */
export async function getVideosByBodyPart(bodyPart) {
  const videos = await db.collection('Videos')
    .find({ bodyPart: bodyPart })
    .toArray();
  return videos;
}


