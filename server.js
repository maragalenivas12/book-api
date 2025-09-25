// server.js

const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON data in the request body
app.use(express.json());

// --- 4. In-Memory Data Store ---
let books = [
    { id: 1, title: 'The Lord of the Rings', author: 'J.R.R. Tolkien' },
    { id: 2, title: 'Pride and Prejudice', author: 'Jane Austen' },
    { id: 3, title: '1984', author: 'George Orwell' }
];

// Simple ID counter for new books
let nextId = 4;

// --- API Endpoints (Routes) ---

// Fix for "Cannot GET /": Welcome message for the root path
app.get('/', (req, res) => {
    res.send('Welcome to the Book Management API! Use /books to see the list.');
});


// ## 5. GET /books - Retrieve all books
app.get('/books', (req, res) => {
    res.status(200).json(books);
});

// GET /books/:id - Retrieve a single book by ID
app.get('/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const book = books.find(b => b.id === bookId);

    if (book) {
        res.status(200).json(book);
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});


// ## 6. POST /books - Add a new book
app.post('/books', (req, res) => {
    const { title, author } = req.body;

    if (!title || !author) {
        return res.status(400).json({ message: 'Title and author are required' });
    }

    const newBook = {
        id: nextId++,
        title: title,
        author: author
    };

    books.push(newBook);
    // Respond with 201 Created status and the new book object
    res.status(201).json(newBook); 
});


// ## 7. PUT /books/:id - Update an existing book
app.put('/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const { title, author } = req.body;
    
    const bookIndex = books.findIndex(b => b.id === bookId);

    if (bookIndex !== -1) {
        // Update the book properties
        if (title) books[bookIndex].title = title;
        if (author) books[bookIndex].author = author;
        
        // Respond with the updated book
        res.status(200).json(books[bookIndex]);
    } else {
        // Handle case where book ID is not found
        res.status(404).json({ message: 'Book not found for update' });
    }
});


// ## 8. DELETE /books/:id - Remove a book
app.delete('/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    
    const initialLength = books.length;
    
    // Filter out the book with the matching ID
    books = books.filter(b => b.id !== bookId);
    
    if (books.length < initialLength) {
        // Book was successfully removed
        // Send 204 No Content status
        res.status(204).send(); 
    } else {
        // Book ID was not found
        res.status(404).json({ message: 'Book not found for deletion' });
    }
});

// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`✅ REST API server is running on http://localhost:${PORT}`);
});