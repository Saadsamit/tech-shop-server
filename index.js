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
