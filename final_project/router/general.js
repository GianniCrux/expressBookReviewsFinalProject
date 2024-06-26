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

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required." });
        }

        if (!isValid(username)) { 
            return res.status(400).json({ message: "Invalid username format." }); // or customize the error message
        }

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
        res.status(500).json({ error: 'Error fetching books' });
    });
});

// Get book details based on ISBN
function getBookByIsbn(isbn) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const booksArray = Object.values(books);
            const filtered_books = booksArray.filter((books) => books.isbn === isbn);
            resolve(filtered_books);
        }, 100)
    });
}

public_users.get('/isbn/:isbn', async function (req, res) {   
    try {
        const isbn = req.params.isbn;
        const filtered_books = await getBookByIsbn(isbn);
        res.send(filtered_books);
    } catch (error) {
        res.status(500).send('Error Fetching books by isbn');
    }
});

// Get book details based on author
function getBooksByAuthor(author) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const booksArray = Object.values(books);
            const filtered_books = booksArray.filter((book) => book.author === author);
            resolve(filtered_books);
        }, 100);
    });
}

public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        let filtered_books = await getBooksByAuthor(author);
        res.send(filtered_books);
    } catch (error) {
        res.status(500).send('Error while fetching books by author');
    }
});

// Get all books based on title
function getBooksByTitle(title) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const booksArray = Object.values(books);
            const filtered_books = booksArray.filter((book) => book.title === title);
            resolve(filtered_books);
    }, 100);
});
}

public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title; 
        let filtered_books = await getBooksByTitle(title);
        res.send(filtered_books);
    } catch (error) {
        res.status(500).send('Error while fetching books by title.');
    }
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
