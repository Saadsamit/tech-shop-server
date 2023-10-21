require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEY}@cluster0.amhrtlq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const database = client.db("Tech-Shop");
    const brand = database.collection("brand");
    const brandItem = database.collection("brandItem");
    const cardData = database.collection("cardData");
    app.get("/brands", async (req, res) => {
      const getBrands = brand.find();
      const result = await getBrands.toArray();
      res.send(result);
    });
    app.get("/brands/:id", async (req, res) => {
      const id = req.params.id;
      const find = { _id: new ObjectId(id) };
      const result = await brand.findOne(find);
      res.send(result);
    });
    app.post("/brandItem", async (req, res) => {
      const data = req.body;
      const result = await brandItem.insertOne(data);
      res.send(result);
    });
    app.get("/brandItem", async (req, res) => {
      const getBrands = brandItem.find();
      const result = await getBrands.toArray();
      res.send(result);
    });
    app.get("/brandItem/:name", async (req, res) => {
      const name = req.params.name.toLowerCase();
      const filder = { brand: name };
      const sult = brandItem.find(filder);
      const result = await sult.toArray();
      res.send(result);
    });
    app.put("/brandItem/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const findId = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          image: data.image,
          name: data.name,
          brand: data.brand,
          type: data.type,
          price: data.price,
          rating: data.rating,
          description: data.description,
        },
      };
      const result = await brandItem.updateOne(findId, updateDoc, options);
      res.send(result);
    });
    app.delete("/brandItem/:id", async (req, res) => {
      const id = req.params.id;
      const findId = { _id: new ObjectId(id) };
      const result = await brandItem.deleteOne(findId);
      res.send(result);
    });
    app.get("/Item/:id", async (req, res) => {
      const id = req.params.id;
      const findId = { _id: new ObjectId(id) };
      const result = await brandItem.findOne(findId);
      res.send(result);
    });
    app.post("/cardData", async (req, res) => {
      const data = req.body;
      const result = await cardData.insertOne(data);
      res.send(result);
    });
    app.get("/cardData", async (req, res) => {
      const data = cardData.find();
      const result = await data.toArray();
      res.send(result);
    });
    app.get("/cardData/:email", async (req, res) => {
      const email = req.params.email
      const filder = { email: email };
      const data = cardData.find(filder);
      const result = await data.toArray();
      res.send(result);
    });
    app.delete("/cardData/:id", async (req, res) => {
      const id = req.params.id;
      const findId = { _id: new ObjectId(id) };
      const result = await cardData.deleteOne(findId);
      res.send(result);
    });
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is runing");
});

app.listen(port);
