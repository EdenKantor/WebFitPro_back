import connectToDatabase from './mongodb';

/**
 * Fetch a random quote from the Quotes collection.
 * @returns {object} A random quote JSON object.
 */
export async function getRandomQuote() {
  const { db } = await connectToDatabase(); // Ensure connection is ready
  const quote = await db.collection('Quotes')
    .aggregate([
      { $sample: { size: 1 } }, // Randomly sample one document
      { $project: { _id: 0 } } // Exclude the _id field
    ])
    .toArray();
  return quote[0];
}
