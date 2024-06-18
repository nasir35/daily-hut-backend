const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

// const url = process.env.DATABASE_URL;
const url = process.env.DATABASE_URL_LOCAL;
const client = new MongoClient(url, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let dbClient;

module.exports = {
  connectToServer: async function (callback) {
    console.log("Attempting to connect to MongoDB...");
    try {
      dbClient = await client.connect();
      console.log("Database Connected Successfully✅");
      return callback();
    } catch (error) {
      console.log(error.name, error.message);
      return callback(error);
    }
  },

  getDb: function (dbName) {
    if (!dbClient) {
      throw new Error("Database not initialized");
    }
    return dbClient.db(dbName);
  },
};
