const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const app = express();
require("dotenv").config();

const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());
// user: mydbuser1
// pass: 0Xaj8lFcBS956J4L

const uri =
  "mongodb+srv://mydbuser1:0Xaj8lFcBS956J4L@cluster0.a06ta.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();
    const database = client.db("foodMaster");
    const deliveryCollection = database.collection("deliver");
    const orderCollection = database.collection("order");

    //CREATE A ORDER API
    app.post("/deliver", async (req, res) => {
      const data = req.body;
      const result = await deliveryCollection.insertOne(data);
      res.send(result);
      console.log(result);
    });
    //GET THE API
    app.get("/deliver", async (req, res) => {
      const result = await deliveryCollection.find({}).toArray();
      res.send(result);
      // console.log(result);
    });

    //CREATE A DYNAMIC API
    app.get("/deliver/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting specific service", id);
      const query = { _id: ObjectId(id) };
      const service = await deliveryCollection.findOne(query);
      res.json(service);
      console.log(service);
    });
    // CREATE A ORDER API
    app.post("/order", async (req, res) => {
      const data = req.body;
      const result = await orderCollection.insertOne(data);
      res.send(result);
    });
    //GET THE ORDER API
    app.get("/order", async (req, res) => {
      const result = await orderCollection.find({}).toArray();
      res.send(result);
      // console.log(result);
    });

    //DELETE THE ORDER API
    app.delete("/order/:id", async (req, res) => {
      console.log(req.params.id);
      const result = await orderCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.send(result);
      console.log(result);
    });
    //my order get api with email
    app.get("/Order/:email", async (req, res) => {
      const result = await orderCollection
        .find({
          email: req.params.email,
        })
        .toArray();
      res.send(result);
    });

    //DELETE THE ORDER API
    app.delete("/Order/:id", async (req, res) => {
      console.log(req.params.id);
      const result = await orderCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.send(result);
    });
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running my CRUD server...and WOW! its working");
});

app.listen(port, () => {
  console.log("Running Server on port ", port);
});
