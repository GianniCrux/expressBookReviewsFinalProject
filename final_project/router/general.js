const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });

    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist (username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login"})
        } else {
            return res.status(404).json({ message: "User already exists!"});
        }
    }
    return res.status(404).json({ error: "Unable to register user."});
});

// Get the book list available in the shop
async function fetchBooks() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(books);
        }, 100);
    });
}

public_users.get('/',function (req, res) {
 fetchBooks()
    .then((books) => {
        res.send(JSON.stringify(books, null, 4));
    })
    .catch((error) => {
        res.status(500).send('Error fetching books');
    });
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
    const isbn = req.params.isbn;

    const booksArray = Object.values(books);

    const book = booksArray.find(book => book.isbn === isbn);

    if (book) {
        res.send(book.reviews);
    } else {
        res.status(404).json({ error: "Book not found!"});
    }
});

module.exports.general = public_users;
