// Importing packages.
import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config(); // Initalizing the dotenv package so the server would be able to securely access the API keys.

const app = express(); // Initalizing the express package.
app.use(cors()); // Adding the cors package to the express app.

const uri = process.env.MONGODB_URI; // The link to the MongoDB Atlas database.
const dbName = process.env.DB_NAME; // The name of the MongoDB Atlas database.

let cachedClient = null;

const connectToDatabase = async () => { // Function to connect to the database.
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
    await client.connect();
    console.log("Connected to database");
    cachedClient = client;
    return client;
  } catch (err) {
    console.error("Failed to connect to database", err);
    throw err;
  }
};

app.get("/students", async (req, res) => { // API route for the frontend.
  if (req.method !== "GET") { // Specifying the request type.
    res.status(405).json({ error: "Method not allowed" }); // Only allows for GET requests to maintain data integrity (to prevent unauthorized changes to the database).
    return;
  }

  try {
    console.log("Connecting to database...");
    const client = await connectToDatabase();
    const db = client.db(dbName);
    const collection = db.collection("School_Transport");

    let query = {}; // Defining a query object to be sent to the database.
    if (req.query.Name) { // Student name
      query.Name = { $regex: new RegExp(`^${req.query.Name}`, "i") };
    }
    if (req.query.StudentId) { // Student ID
      query.StudentId = { $regex: new RegExp(req.query.StudentId, "i") };
    }
    if (req.query.RouteNo) { // Bus Route Number
      query.RouteNo = parseInt(req.query.RouteNo);
    }
    if (req.query.Address) { // Student address
      query.Address = { $regex: new RegExp(req.query.Address, "i") };
    }
    if (req.query.Area) {  // Student area
      query.Area = { $regex: new RegExp(`^${req.query.Area}`, "i") };
    }

    console.log("Fetching students with query:", query);
    const students = await collection.find(query).toArray();
    console.log("Students fetched successfully,", students);
    res.status(200).json(students);
  } catch (err) {
    console.error("Error fetching data:", err);
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
});

app.listen(5000, () => {
  console.log(`Server is running on http://localhost:5000`);
});
