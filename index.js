const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8gtonc3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const flowerAndCakeItemsCollection = client
      .db("assignmentREVIEW")
      .collection("flowerAndCakeItems");
    //get data from db
    app.get("/flowerAndCakeItems", async (req, res) => {
      const cursor = flowerAndCakeItemsCollection.find({});
      const flowerAndCakeItems = await cursor.toArray();
      res.send(flowerAndCakeItems);
    });

    app.get("/limitFlowerAndCakeItems", async (req, res) => {
      const cursor = flowerAndCakeItemsCollection.find({});
      const limitFlowerAndCakeItems = await cursor.limit(3).toArray();
      res.send(limitFlowerAndCakeItems);
    });
    app.get("/FlowerAndCakeItems/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: ObjectId(id) };
      const FlowerAndCakeItems = await flowerAndCakeItemsCollection.findOne(
        query
      );
      res.send(FlowerAndCakeItems);
    });
    // post data
    app.post("/flowerAndCakeItems", async (req, res) => {
      const flowerAndCakeItem = req.body;
      const result = await flowerAndCakeItemsCollection.insertOne(
        flowerAndCakeItem
      );
      res.send(result);
    });
  } finally {
  }
}
run().catch((error) => console.error(error));

//test for server running
app.get("/", (req, res) => {
  res.send("assignment review Server is running");
});
app.listen(port, () => {
  console.log(`assignment review Server running on ${port}`);
});
