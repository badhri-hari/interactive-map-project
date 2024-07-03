import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

let cachedClient = null;

const connectToDatabase = async () => {
  if (
    cachedClient &&
    cachedClient.topology &&
    cachedClient.topology.isConnected()
  ) {
    return cachedClient;
  }
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  cachedClient = client;
  return client;
};

export default async (req, res) => {
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
      query.RouteNo = { $regex: new RegExp(`^${req.query.RouteNo}`, "i") };
    }
    if (req.query.Address) {
      query.Address = { $regex: new RegExp(req.query.Address, "i") };
    }
    if (req.query.Area) {
      query.Area = { $regex: new RegExp(`^${req.query.Area}`, "i") };
    }

    console.log("Fetching students with query:", query);
    const students = await collection.find(query).toArray();
    console.log("Students fetched successfully");
    res.status(200).json(students);
  } catch (err) {
    console.error("Error fetching data:", err);
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
};
