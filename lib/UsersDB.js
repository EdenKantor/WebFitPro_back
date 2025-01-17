import connectToDatabase from './mongodb';


const {db} = await connectToDatabase();

/*
* Get username of a user, return JSON of User if exhist in the db 
* with all the details except of his _id in the db
*/
export async function getUserByUsername(userName) {
    const user = await db.collection('Users').findOne(
      { userName: userName },
      { projection: { _id: 0 } }
    );
    return user;
}

/**
 * @param {*} userName 
 * @param {*} age 
 * @param {*} gender 
 * @param {*} height 
 * @param {*} passowrd 
 * @param {*} weight 
 * 
 * @returns new user
 */
export async function addNewUser(userName, age, gender,height,password,weight) {
  const user = await db.collection('Users').insertOne({
    "userName": userName,
    "age": age,
    "gender": gender,
    "height": height,
    "isAdmin": "N",
    "isRegistered": "N",
    "password": password,
    "weight": weight,
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
  const result = await db.collection('Users').updateOne(
    { userName: userName },
    { $set: { age: age, height: height, weight: weight } }
  );
  return result;
}

/**
 * Delete a user by username.
 * @param {string} userName
 * @returns {object} The result of the delete operation.
 */
export async function deleteUser(userName) {
  const result = await db.collection('Users').deleteOne({ userName: userName });
  return result;
}

/**
 * Set the isRegistered status to "Y" for a specific user.
 * @param {string} userName
 * @returns {object} The result of the update operation.
 */
export async function registerUser(userName) {
  const result = await db.collection('Users').updateOne(
    { userName: userName },
    { $set: { isRegistered: "Y" } }
  );
  return result;
}

/*
* Get all users with isRegistered="N"
* @returns {Array} Array of pending users
*/
export async function getPendingUsers() {
 const users = await db.collection('Users').find(
     { isRegistered: "N" },
     { projection: { userName: 1, isRegistered: 1, _id: 0 } }
 ).toArray();
 return users;
}

/*
 * Get all users
 * @returns {Array} Array of users
 */
export async function getUsers() {
  const users = await db.collection('Users').find({}).toArray();
  return users;
}

