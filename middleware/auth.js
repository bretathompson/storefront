

module.exports = (req, res, next) => {
   
    const credential = {
      email: "admin@gmail.com",
      password: "admin123",
    };
  
    if (req.body.email == credential.email && req.body.password == credential.password) {
      req.session.user = req.body.email;
      next(); 
    } else {
      res.end('Invalid Username');
    }
  };
  