var express = require ("express");
var router = express.Router ();

function setDatabase(db) {
  router.use((req, res, next) => {
    req.db = db;
    next();
  });
}

const credential = {
  email: "admin@gmail.com",
  password: "admin123",
};


router.post('/login', (req, res) => {
  if (req.body.email == credential.email && req.body.password == credential.password) {
    req.session.user = req.body.email;

    const storeItems = req.db.collection('storeItems');
    storeItems.find({}).toArray((findErr, items) => {
      if (findErr) {
        console.error('Error retrieving store items:', findErr);
        res.send('Error retrieving store items');
      } else {
        res.render('dashboard', {user: req.session.user, storeItems: items});
      }
    });
  } else {
    res.end('Invalid Username');
  }
});


router.get ('/dashboard', (req, res) => {
    if (req.session.user){
        res.render ('dashboard', {user: req.session.user})
    } else {
        res.send ("Unauthorized User")
    }
});


router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      res.send("Error");
    } else {
      res.render('base', {title: "Express", logout: "Logout Successfully...!"});
    }
  });
});

module.exports = {router, setDatabase};