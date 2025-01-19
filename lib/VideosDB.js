import connectToDatabase from './mongodb';

/**
 * Change the like count of a video by 1 or -1.
 * @param {string} url - The URL of the video.
 * @param {number} action - 1 or -1 to increase or decrease the like count.
 * @returns {Object|null} - Updated video document or null if not found.
 */
export async function changeLikeCount(url, action) {
  const { db } = await connectToDatabase(); // Ensure connection is ready
  const updatedVideo = await db.collection('Videos').findOneAndUpdate(
    { url },
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
  const { db } = await connectToDatabase(); // Ensure connection is ready
  const newVideo = {
    url,
    likeCount: 0,
    difficulty,
    bodyPart,
    title,
  };
  const result = await db.collection('Videos').insertOne(newVideo);
  return result.ops[0];
}

/**
 * Delete a video from the database.
 * @param {string} url - The URL of the video.
 * @returns {Object|null} - Deleted video document or null if not found.
 */
export async function deleteVideo(url) {
  const { db } = await connectToDatabase(); // Ensure connection is ready
  const deletedVideo = await db.collection('Videos').findOneAndDelete(
    { url }
  );
  return deletedVideo.value;
}

/**
 * Check if a video exists by URL and return its JSON.
 * @param {string} url - The URL of the video.
 * @returns {Object|null} - The video document if found, otherwise null.
 */
export async function checkVideoByUrl(url) {
  const { db } = await connectToDatabase(); // Ensure connection is ready
  const video = await db.collection('Videos').findOne({ url });
  return video;
}

/**
 * Get three unique videos, one random video from each difficulty level.
 * @returns {Array<string>} - Array of 3 unique video URLs.
 */
export async function getUniqueVideos() {
  const { db } = await connectToDatabase(); // Ensure connection is ready
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  const promises = difficulties.map(async (difficulty) => {
    const pipeline = [
      { $match: { difficulty } },
      { $sample: { size: 1 } },
      { $project: { _id: 0, url: 1 } },
    ];
    const [result] = await db.collection('Videos').aggregate(pipeline).toArray();
    return result ? result.url : null;
  });

  const videoUrls = await Promise.all(promises);
  return videoUrls.filter(Boolean);
}

/**
 * Get videos sorted by title.
 * @param {string} bodyPart - The body part to filter by.
 * @param {boolean} ascending - Pass true for A-Z, false for Z-A.
 * @returns {Array<Object>} - Array of videos sorted by title.
 */
export async function getVideosSortedByTitle(bodyPart, ascending) {
  const { db } = await connectToDatabase(); // Ensure connection is ready
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
  const { db } = await connectToDatabase(); // Ensure connection is ready
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
  const { db } = await connectToDatabase(); // Ensure connection is ready
  const difficultyOrder = beginnerFirst
    ? ['Beginner', 'Intermediate', 'Advanced']
    : ['Advanced', 'Intermediate', 'Beginner'];

  const videos = await db.collection('Videos')
    .aggregate([
      { $match: { bodyPart } },
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
  const { db } = await connectToDatabase(); // Ensure connection is ready
  const videos = await db.collection('Videos')
    .find({ bodyPart })
    .toArray();
  return videos;
}
