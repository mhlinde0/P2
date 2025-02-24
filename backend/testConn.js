// testConn.js

import dotenv from 'dotenv';
dotenv.config(); // Load variables from .env into process.env

import { MongoClient, ServerApiVersion } from 'mongodb';

// Read the connection string from .env
const uri = process.env.ATLAS_URI;
if (!uri) {
    throw new Error("❌ ATLAS_URI not found in .env");
}

// Create the MongoDB client
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        // 1) Connect to your Atlas cluster
        await client.connect();

        // 2) Ping the admin database
        await client.db("admin").command({ ping: 1 });
        console.log("✅ Pinged your deployment. You successfully connected to MongoDB!");

    } catch (err) {
        console.error("❌ Error connecting to MongoDB Atlas:", err);

    } finally {
        // 3) Close the connection
        await client.close();
    }
}

// 4) Execute
run().catch(console.dir);
