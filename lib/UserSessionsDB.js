import connectToDatabase from './mongodb';

/**
 * Create a new user session with default values.
 * @param {string} userName - The username of the user.
 * @returns {Object} - The result of the insertion operation.
 */
export async function createUserSession(userName) {
  const { db } = await connectToDatabase(); // Ensure connection is ready
  const userSession = await db.collection('UserSessions').insertOne({
    userName,
    videos: [],
    checks: [false,false,false],
    completesessions: 0,
    openedsessions: 0,
    finished: true,
  });
  return userSession;
}

/**
 * Return a single user session without the `_id` field based on the username.
 * @param {string} userName - The username of the user.
 * @returns {Object|null} - The user session document or null if not found.
 */
export async function getUserSessionByUserName(userName) {
  const { db } = await connectToDatabase(); // Ensure connection is ready
  const userSession = await db.collection('UserSessions').findOne(
    { userName },
    { projection: { _id: 0 } }
  );
  return userSession;
}

/**
 * Update the array of videos for a user session.
 * @param {string} userName - The username of the user.
 * @param {Array<string>} videos - The new array of video URLs.
 * @returns {Object|null} - The updated user session document or null if not found.
 */
export async function updateVideos(userName, videos) {
  const { db } = await connectToDatabase(); // Ensure connection is ready
  const updatedSession = await db.collection('UserSessions').findOneAndUpdate(
    { userName },
    { $set: { videos } },
    { returnDocument: 'after', projection: { _id: 0 } }
  );
  return updatedSession.value;
}

/**
 * Update the `finished` status of a user session.
 * @param {string} userName - The username of the user.
 * @param {boolean} isFinished - The new finished status.
 * @returns {Object|null} - The updated user session document or null if not found.
 */
export async function updateFinishedStatus(userName, isFinished) {
  const { db } = await connectToDatabase(); // Ensure connection is ready
  const updatedSession = await db.collection('UserSessions').findOneAndUpdate(
    { userName },
    { $set: { finished: isFinished } },
    { returnDocument: 'after', projection: { _id: 0 } }
  );
  return updatedSession.value;
}

/**
 * Update a specific index in the checks array for a user session.
 * @param {string} userName - The username of the user.
 * @param {boolean} checkValue - The new boolean value to set.
 * @param {number} index - The index in the checks array to update.
 * @returns {Object|null} - The updated user session document or null if not found.
 */
export async function updateChecks(userName, checkValue, index) {
  const { db } = await connectToDatabase(); // Ensure connection is ready
  const updatedSession = await db.collection('UserSessions').findOneAndUpdate(
    { userName },
    { $set: { [`checks.${index}`]: checkValue } },
    { returnDocument: 'after', projection: { _id: 0 } }
  );
  return updatedSession.value;
}

/**
 * Reset the `checks` array for a user session.
 * @param {string} userName - The username of the user.
 * @returns {Object|null} - The updated user session document or null if not found.
 */
export async function updateAllChecks(userName) {
  const { db } = await connectToDatabase(); // Ensure connection is ready
  const updatedSession = await db.collection('UserSessions').findOneAndUpdate(
    { userName },
    { $set: { checks: [false,false,false] } },
    { returnDocument: 'after', projection: { _id: 0 } }
  );
  return updatedSession.value;
}

/**
 * Increase the completed session count by 1 for a user session.
 * @param {string} userName - The username of the user.
 * @returns {Object|null} - The updated user session document or null if not found.
 */
export async function incrementCompleteSessions(userName) {
  const { db } = await connectToDatabase(); // Ensure connection is ready
  const updatedSession = await db.collection('UserSessions').findOneAndUpdate(
    { userName },
    { $inc: { completesessions: 1 } },
    { returnDocument: 'after', projection: { _id: 0 } }
  );
  return updatedSession.value;
}

/**
 * Increase the opened session count by 1 for a user session.
 * @param {string} userName - The username of the user.
 * @returns {Object|null} - The updated user session document or null if not found.
 */
export async function incrementOpenedSessions(userName) {
  const { db } = await connectToDatabase(); // Ensure connection is ready
  const updatedSession = await db.collection('UserSessions').findOneAndUpdate(
    { userName },
    { $inc: { openedsessions: 1 } },
    { returnDocument: 'after', projection: { _id: 0 } }
  );
  return updatedSession.value;
}

/**
 * Delete a user session from the UserSessions collection.
 * @param {string} userName - The username of the user.
 * @returns {object} The result of the delete operation.
 */
export async function deleteFromUserSessions(userName) {
  const { db } = await connectToDatabase(); // Ensure connection is ready
  const result = await db.collection('UserSessions').deleteOne({ userName });
  return result;
}
