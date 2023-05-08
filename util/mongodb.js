import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

/*

NOTE: if using MongoDB Atlas, make sure to add 0.0.0.0/0 to the Network Access IP Whitelist.
      This will allow any IP to connect to your database.
      It is needed because Vercel uses dynamic IPs. see: https://vercel.com/guides/how-to-allowlist-deployment-ip-address

*/

// check the MongoDB URI
if (!MONGODB_URI) {
  throw new Error("Define the MONGODB_URI environmental variable");
}

// check the MongoDB DB
if (!DB_NAME) {
  throw new Error("Define the DB_NAME environmental variable");
}

let cachedClient = null;
let cachedDb = null;

export default async function connectToDatabase() {
  // check if cached
  if (cachedClient && cachedDb) {
    // load from cache
    return {
      client: cachedClient,
      db: cachedDb,
    };
  }

  // set the connection options
  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  // Connect to cluster
  let client = new MongoClient(MONGODB_URI, opts);
  await client.connect();
  let db = client.db(DB_NAME);

  // set cache
  cachedClient = client;
  cachedDb = db;

  return {
    client: cachedClient,
    db: cachedDb,
  };
}
