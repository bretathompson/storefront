const express = require ('express');
const path = require ('path');
const bodyparser = require ("body-parser");
const session = require ("express-session");
const {v4: uuidv4} = require ("uuid");
const {MongoClient} = require('mongodb');

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

MongoClient.connect(mongoURL, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
  } else {
    console.log('Connected to MongoDB');
    const db = client.db();

    // Set the database instance for the router
    setDatabase(db);

    app.use('/route', router);

    app.get('/', (req, res) => {
      res.render('base', { title: 'Login System' });
    });

    app.listen(port, () => {
      console.log("Listening to the server on http://localhost:3000");
    });
  }
});


