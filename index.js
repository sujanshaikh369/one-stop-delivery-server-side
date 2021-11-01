const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = 5000;

// middleware
app.use(cors());
app.use(express.json());
// user: mydbuser1
// pass: 2Ro22ok7KHtGHu0o

const uri =
  "mongodb+srv://mydbuser1:2Ro22ok7KHtGHu0O@cluster0.a06ta.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();
    const database = client.db("foodMaster");
    const deliveryCollection = database.collection("deliver");

    //GET THE API
    app.get("/deliver", async (req, res) => {
      const result = await deliveryCollection.find({}).toArray();
      res.send(result);
      // console.log(result);
    });

    //CREATE A DYNMICE API
    app.get("/deliver/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting specific service", id);
      const query = { _id: ObjectId(id) };
      const service = await deliveryCollection.findOne(query);
      res.json(service);
      console.log(service);
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
