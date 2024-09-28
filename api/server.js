// Importing packages.
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

// Initializing the dotenv package so the server would be able to securely access the API keys.
dotenv.config();

// The link to the MongoDB Atlas database.
const uri = process.env.MONGODB_URI;
// The name of the MongoDB Atlas database.
const dbName = process.env.DB_NAME;

let cachedClient = null; // Caching the MongoDB client to avoid unnecessary reconnections.

// Function to connect to the database.
const connectToDatabase = async () => {
  // Check if there's a cached database client and if it's still connected.
  if (
    cachedClient &&
    cachedClient.topology &&
    cachedClient.topology.isConnected()
  ) {
    console.log("Using cached database instance");
    return cachedClient;
  }

  console.log("Creating new database connection");
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    // Attempt to connect to the MongoDB database.
    await client.connect();
    console.log("Connected to database");
    cachedClient = client; // Cache the client for future requests.
    return client;
  } catch (err) {
    console.error("Failed to connect to database", err);
    throw err; // Throw error if connection fails.
  }
};

// This is the serverless function that handles the request.
export default async (req, res) => {
  // Adding CORS headers to allow cross-origin requests.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Only allows for GET requests to maintain data integrity (to prevent unauthorized changes to the database).
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    console.log("Connecting to database...");
    const client = await connectToDatabase();
    const db = client.db(dbName);
    const collection = db.collection("School_Transport");

    // Defining a query object to be sent to the database.
    let query = {};
    if (req.query.Name) {
      // Student name
      query.Name = { $regex: new RegExp(`^${req.query.Name}`, "i") };
    }
    if (req.query.StudentId) {
      // Student ID
      query.StudentId = { $regex: new RegExp(req.query.StudentId, "i") };
    }
    if (req.query.RouteNo) {
      // Bus Route Number
      query.RouteNo = parseInt(req.query.RouteNo);
    }
    if (req.query.Address) {
      // Student address
      query.Address = { $regex: new RegExp(req.query.Address, "i") };
    }
    if (req.query.Area) {
      // Student area
      query.Area = { $regex: new RegExp(`^${req.query.Area}`, "i") };
    }

    console.log("Fetching students with query:", query);
    // Fetching the data from the collection.
    const students = await collection.find(query).toArray();
    console.log("Students fetched successfully,", students);

    // Responding with the fetched students.
    res.status(200).json(students);
  } catch (err) {
    // Handling and responding with any internal server errors.
    console.error("Error fetching data:", err);
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
};
