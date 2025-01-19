import connectToDatabase from './mongodb';

/**
 * Fetch all URLs associated with a specific user.
 * @param {string} userName - The username to search for.
 * @returns {Array} An array of URLs for the given username.
 */
export async function getURLsByUser(userName) {
  const { db } = await connectToDatabase(); // Ensure connection is ready
  const user = await db.collection('UsersLike').findOne(
    { userName: userName },
    { projection: { _id: 0, url: 1 } }
  );
  return user ? user.url : [];
}

/**
 * Check if a specific URL exists in the URL array for a given username.
 * @param {string} userName - The username to search for.
 * @param {string} url - The URL to check.
 * @returns {boolean} True if the URL exists, otherwise false.
 */
export async function checkURLForUser(userName, url) {
  const { db } = await connectToDatabase(); // Ensure connection is ready
  const user = await db.collection('UsersLike').findOne(
    { userName: userName, url: url }
  );
  return !!user;
}

/**
 * Add a new URL to the URL array for a specific user.
 * @param {string} userName - The username to update.
 * @param {string} url - The URL to add.
 * @returns {object} The result of the update operation.
 */
export async function addURLForUser(userName, url) {
  const { db } = await connectToDatabase(); // Ensure connection is ready
  const result = await db.collection('UsersLike').updateOne(
    { userName: userName },
    { $addToSet: { url: url } }
  );
  return result;
}

/**
 * Remove a URL from the URL array for a specific user.
 * @param {string} userName - The username to update.
 * @param {string} url - The URL to remove.
 * @returns {object} The result of the update operation.
 */
export async function removeURLForUser(userName, url) {
  const { db } = await connectToDatabase(); // Ensure connection is ready
  const result = await db.collection('UsersLike').updateOne(
    { userName: userName },
    { $pull: { url: url } }
  );
  return result;
}

/**
 * Create a new JSON document in the UsersLike collection for a given username.
 * @param {string} userName - The username for the new document.
 * @returns {object} The result of the insertion operation.
 */
export async function createNewUserLike(userName) {
  const { db } = await connectToDatabase(); // Ensure connection is ready
  const result = await db.collection('UsersLike').insertOne({
    url: [],
    userName: userName,
  });
  return result;
}

/**
 * Delete user likes from UsersLike collection.
 * @param {string} userName - The username to delete.
 * @returns {object} The result of the delete operation.
 */
export async function deleteFromUsersLike(userName) {
  const { db } = await connectToDatabase(); // Ensure connection is ready
  const result = await db.collection('UsersLike').deleteOne(
    { userName: userName }
  );
  return result;
}
