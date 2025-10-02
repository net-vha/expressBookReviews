const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });

  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }

}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.

  let userFound = users.filter((user) => {
    return (user.username === username && user.password === password);
  });

  if (userFound.length > 0) {
    return true;
  } else {
    return false;
  }

}

regd_users.use("/auth", function auth(req, res, next) {
  if (req.session.authorization) {
    let token = req.session.authorization['accessToken'];

    jwt.verify(token, "access", (err, user) => {
      if (!err) {
        req.user = user;
        next();
      } else {
        return res.status(403).json({ message: "user not authenticated" });
      }
    });
  } else {
    return res.status(403).json({message: "User not logged in"});
  }
});

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Missing username or password" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 6000 });

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    reviews = books[isbn].reviews;
    reviews[req.session.authorization.username] = req.body.review;
    res.status(200).send("Review successfully added");
  } else {
    res.status(403).json({message: "invalid isbn"});
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    if (reviews[req.session.authorization.username]){
      reviews = books[isbn].reviews;
      delete reviews[req.session.authorization.username];
      res.status(200).send("Review successfully deleted");
    } else {
      res.status(403).json({message: "no review to delete"});
    }
  } else {
    res.status(403).json({message: "invalid isbn"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
