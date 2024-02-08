const express = require ('express');
const path = require ('path');
const bodyparser = require ("body-parser");
const session = require ("express-session");
const {v4: uuidv4} = require ("uuid");
const MongoClient = require ("mongodb").MongoClient;


const {router, setDatabase} = require('./router');
const app = express ();

const port = process.env.PORT || 3000;
const mongoURL = 'mongodb://localhost:27017/storefront';



app.use (bodyparser.json());
app.use (bodyparser.urlencoded ({extended: true}))

app.set ('view engine', 'ejs');


app.use (session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true
}));



MongoClient.connect('mongodb://localhost:27017/storefront')
.catch((err) => {
  console.log(err);
})
.then((client) => {
    console.log("Connected to MongoDB");
    const db = client.db('storefront');

    // Log the number of items in the collection
    const storeItemsCollection = db.collection("storeItems");
    storeItemsCollection.insertMany(
      [
        { name: "Pizza", price: 10 },
        { name: "Toy car", price: 20 },
        { name: "Ball", price: 30 },
        { name: "Board Game", price: 40 },
      ],
      (insertErr, result) => {
        if (insertErr) {
          console.error("Error inserting store items:", insertErr);
        } else {
          console.log("Number of items inserted:", result.insertedCount);
        }
      }
    );

    // Set the database instance for the router
    setDatabase(db);

    app.use("/route", router);

    app.get("/", (req, res) => {
      res.render("base", { title: "Login System" });
    });

    app.listen(port, () => {
      console.log("Listening to the server on http://localhost:3000");
    });
});


