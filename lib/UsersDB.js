import connectToDatabase from './mongodb';

/**
 * Get a user by username.
 * @param {string} userName - The username to search for.
 * @returns {object|null} The user object without `_id`, or null if not found.
 */
export async function getUserByUsername(userName) {
  const { db } = await connectToDatabase(); // Ensure connection is ready
  const user = await db.collection('Users').findOne(
    { userName: userName },
    { projection: { _id: 0 } }
  );
  return user;
}

/**
 * Add a new user to the database.
 * @param {string} userName 
 * @param {number} age 
 * @param {string} gender 
 * @param {number} height 
 * @param {string} password 
 * @param {number} weight 
 * @returns {object} The result of the insertion operation.
 */
export async function addNewUser(userName, age, gender, height, password, weight) {
  const { db } = await connectToDatabase(); // Ensure connection is ready
  const user = await db.collection('Users').insertOne({
    userName,
    age,
    gender,
    height,
    isAdmin: "N",
    isRegistered: "N",
    password,
    weight,
  });
  return user;
}

/**
 * Update age, height, and weight for a specific user.
 * @param {string} userName
 * @param {number} age
 * @param {number} height
 * @param {number} weight
 * @returns {object} The result of the update operation.
 */
export async function updateUserDetails(userName, age, height, weight) {
  const { db } = await connectToDatabase(); // Ensure connection is ready
  const result = await db.collection('Users').updateOne(
    { userName: userName },
    { $set: { age, height, weight } }
  );
  return result;
}

/**
 * Delete a user by username.
 * @param {string} userName
 * @returns {object} The result of the delete operation.
 */
export async function deleteUser(userName) {
  const { db } = await connectToDatabase(); // Ensure connection is ready
  const result = await db.collection('Users').deleteOne({ userName: userName });
  return result;
}

/**
 * Set the isRegistered status to "Y" for a specific user.
 * @param {string} userName
 * @returns {object} The result of the update operation.
 */
export async function registerUser(userName) {
  const { db } = await connectToDatabase(); // Ensure connection is ready
  const result = await db.collection('Users').updateOne(
    { userName: userName },
    { $set: { isRegistered: "Y" } }
  );
  return result;
}

/**
 * Get all users with isRegistered="N".
 * @returns {Array} Array of pending users.
 */
export async function getPendingUsers() {
  const { db } = await connectToDatabase(); // Ensure connection is ready
  const users = await db.collection('Users').find(
    { isRegistered: "N" },
    { projection: { userName: 1, isRegistered: 1, _id: 0 } }
  ).toArray();
  return users;
}

/**
 * Get all users.
 * @returns {Array} Array of all users.
 */
export async function getUsers() {
  const { db } = await connectToDatabase(); // Ensure connection is ready
  const users = await db.collection('Users').find({}).toArray();
  return users;
}
