const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {   
  const isbn = req.params.isbn;

  const booksArray = Object.values(books);

  let filtered_books = booksArray.filter((books) => books.isbn === isbn);

  res.send(filtered_books);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author; 

  const booksArray = Object.values(books);
  
  let filtered_books = booksArray.filter((book) => book.author === author);
  
  res.send(filtered_books);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title; 

  const booksArray = Object.values(books);
  
  let filtered_books = booksArray.filter((book) => book.title === title);
  
  res.send(filtered_books);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
