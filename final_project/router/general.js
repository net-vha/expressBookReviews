const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered." });
    } else {
      return res.status(404).json({ message: "User already exists" });
    }
  } else {
    return res.status(208).json({ message: "Please make sure to input username and password" });
  }
});

async function getBooks() {
  try{
    let response = await axios.get('http://localhost:5000/');
    console.log(response);
  } catch (error) {
    console.error('Error: ', error);
  }
}

async function getBookByIsbn(isbn) {
  try{
    let response = await axios.get('http://localhost:5000/isbn/' + isbn);
    console.log(response);
  } catch (error) {
    console.error('Error: ', error);
  }
}

async function getBookByAuthor(author) {
  try{
    let response = await axios.get('http://localhost:5000/author/' + author);
    console.log(response);
  } catch (error) {
    console.error('Error: ', error);
  }
}

async function getBookByTitle(title) {
  try{
    let response = await axios.get('http://localhost:5000/title/' + title);
    console.log(response);
  } catch (error) {
    console.error('Error: ', error);
  }
}

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books, null));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const myAuthor = req.params.author;

  let authorBooks = Object.fromEntries(Object.entries(books).filter(([isbn, book]) => book.author == myAuthor));

  res.send(JSON.stringify(authorBooks, null));
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const bookTitle = req.params.title;

  let booksByTitle = Object.fromEntries(Object.entries(books).filter(([isbn, book]) => book.title == bookTitle));

  res.send(JSON.stringify(booksByTitle, null));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.send(books[isbn].reviews);
});

module.exports.general = public_users;
