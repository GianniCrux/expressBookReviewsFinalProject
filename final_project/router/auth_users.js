const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    const userExists = users.some(user => user.username === username); 
    return userExists;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let  validusers = users.filter((user) => { 
        return (user.username === username && user.password === password);
    });

    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username; 
    const password = req.body.password; 

    if (!username || !password) {
        return res.status(404).json({ message: "Error loggin in"});
    }

    //Authenticate user
    if (authenticatedUser(username, password)) {
        //generate jwt token access
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 120});

        //Store both token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).json({ message: "User successfully logged in"});
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;

    if(!req.session.authorization) {
        return res.status(401).json({ error: "User not logged in!"});
    }

    if (!username) {
        return res.status(401).json({ error: "Username not found"});
    }


    const book = Object.values(books).find(book => book.isbn === isbn);

    if (!book) {
        return res.status(404).json({ error: `book not found for isbn ${isbn}`});
    }

    // Initialize reviews object if it doesn't exist
    if (!book.reviews) {
        book.reviews = {};
    }


    book.reviews[username] = review;

    return res.status(200).json({ message: `Review posted by ${username} for the book with the isbn ${isbn} added/modified successfully!`});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if(!req.session.authorization) {
        return res.status(401).json({ error: "User not logged in!"});
    }

    if (!username) {
        return res.status(401).json({ error: "Username not found"});
    }

    const book = Object.values(books).find(book => book.isbn === isbn);

    if (!book) {
        return res.status(404).json({ error: `Book not found for ISBN ${isbn}`})
    }

    if (!book.reviews) {
        return res.status(404).json({ error: "No reviews found for this book"});
    }

    if (!book.reviews.hasOwnProperty(username)) {
        return res.status(404).json({ error: "You haven't reveiwed this book"});
    }

    delete book.reviews[username];

    return res.status(200).json({ message: `Review with the isbn ${isbn} deleted successfully!`});


})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
