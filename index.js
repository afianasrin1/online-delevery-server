const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    //items db
    const flowerAndCakeItemsCollection = client
      .db("assignmentREVIEW")
      .collection("flowerAndCakeItems");
    //review db
    const reviewCollection = client.db("assignmentREVIEW").collection("review");

    //get data from db
    //routes- path: "/flowerAndCakeItems",
    app.get("/flowerAndCakeItems", async (req, res) => {
      const cursor = flowerAndCakeItemsCollection.find({});
      const flowerAndCakeItems = await cursor.toArray();
      res.send(flowerAndCakeItems);
    });

    //homeitems
    app.get("/limitFlowerAndCakeItems", async (req, res) => {
      const cursor = flowerAndCakeItemsCollection.find({});
      const limitFlowerAndCakeItems = await cursor.limit(3).toArray();
      res.send(limitFlowerAndCakeItems);
    });

    app.get("/flowerAndCakeItems/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: ObjectId(id) };
      const flowerAndCakeItems = await flowerAndCakeItemsCollection.findOne(
        query
      );
      res.send(flowerAndCakeItems);
    });
    // post addItem
    app.post("/flowerAndCakeItems", async (req, res) => {
      const flowerAndCakeItem = req.body;
      const result = await flowerAndCakeItemsCollection.insertOne(
        flowerAndCakeItem
      );
      res.send(result);
    });
    //review
    app.get("/review", async (req, res) => {
      const cursor = reviewCollection.find({});
      const review = await cursor.toArray();
      res.send(review);
    });
    app.get("/review/:id", async (req, res) => {
      const { id } = req.body;
      const cursor = reviewCollection.find(id);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/reviewOne/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: ObjectId(id) };
      const result = await reviewCollection.findOne(query);
      res.send(result);
    });
    // delete review
    app.delete("/review/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
      res.send(result);
    });
    //review post
    app.post("/review", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
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
