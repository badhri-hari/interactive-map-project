import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

let cachedClient = null;

const connectToDatabase = async () => {
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

app.use(cors());

app.get("/students", async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    console.log("Connecting to database...");
    const client = await connectToDatabase();
    const db = client.db(dbName);
    const collection = db.collection("School_Transport");

    let query = {};
    if (req.query.Name) {
      query.Name = { $regex: new RegExp(`^${req.query.Name}`, "i") };
    }
    if (req.query.StudentId) {
      query.StudentId = { $regex: new RegExp(req.query.StudentId, "i") };
    }
    if (req.query.RouteNo) {
      query.RouteNo = parseInt(req.query.RouteNo);
    }
    if (req.query.Address) {
      query.Address = { $regex: new RegExp(req.query.Address, "i") };
    }
    if (req.query.Area) {
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
