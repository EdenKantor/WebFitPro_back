import connectToDatabase from './mongodb';

const { db } = await connectToDatabase();

/**
 * Fetch a random quote from the Quotes collection.
 * @returns {object} A random quote JSON object.
 */
export async function getRandomQuote() {
  const quote = await db.collection('Quotes').aggregate([
    { $sample: { size: 1 } },
    { $project: { _id: 0 } } // Exclude the _id field
  ]).toArray();
  return quote[0];
}