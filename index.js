const express = require('express');
const app = express();
const { swaggerUi, swaggerSpec } = require('./swaggerconfig.js');
const fs = require('fs');
const helmet = require('helmet');
const { body, validationResult } = require('express-validator');
const PORT = 4000;
fs.writeFileSync('swagger-definition.json', JSON.stringify(swaggerSpec, null, 2));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Read data.json
function readData() {
    try {
        const data = fs.readFileSync('./data.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Failed to read data:', error);
        throw new Error('Data could not be read');
    }
}


// Write data.json 
function writeData(data) {
    try {
        fs.writeFileSync('./data.json', JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error('Failed to write data:', error);
        throw new Error('Data could not be saved');
    }
}


app.use(express.json());
app.get('/',(req,res) => {
    res.send("Welcome to my bookstore API :)")
});

app.use(helmet());



// CRUD for books 

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Add a new book
 *     description: Create a new book with title, author, publication date, and ISBN.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the book.
 *               author:
 *                 type: string
 *                 description: The author of the book.
 *               publicationDate:
 *                 type: string
 *                 format: date
 *                 description: The publication date of the book.
 *               ISBN:
 *                 type: string
 *                 description: The ISBN number of the book.
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Missing or invalid fields
 */
app.post('/books', [
    body('title').trim().isString().notEmpty().withMessage('Title is required').escape(),
    body('author').trim().isString().notEmpty().withMessage('Author is required').escape(),
    body('publicationDate').isDate().withMessage('Invalid publication date format'),
    body('ISBN').trim().isISBN().withMessage('Invalid ISBN format')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, author, publicationDate, ISBN } = req.body;

    if (!title || !author || !publicationDate || !ISBN) {
        return res.status(400).json({ error: 'All book fields (title, author, publicationDate, ISBN) are required' });
    }

    const data = readData();
    const newBook = {
        id: data.books.length + 1,
        title: req.body.title,
        author: req.body.author,
        publicationDate: req.body.publicationDate,
        ISBN: req.body.ISBN
    };

    data.books.push(newBook);

    try {
        writeData(data);
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save book data' });
    }

}); 




/**
 * @swagger
 * /books:
 *   get:
 *     summary: Retrieve all books
 *     description: Get a list of all books in the system.
 *     responses:
 *       200:
 *         description: A list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
app.get('/books', (req, res) => {
    const data = readData();
    res.status(200).json(data.books);
});




/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Retrieve a book by ID
 *     description: Get detailed information about a specific book.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the book to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 */
app.get('/books/:id', (req, res) => {
    const data = readData();
    const bookId = parseInt(req.params.id); 
    const book = data.books.find(b => b.id === bookId);

    if (!book) 
        return res.status(404).send('Book not found'); 

    res.status(200).json(book); 
});




/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Update a book
 *     description: Modify an existing book's information.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the book to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the book.
 *               author:
 *                 type: string
 *                 description: The author of the book.
 *               publicationDate:
 *                 type: string
 *                 format: date
 *                 description: The publication date of the book.
 *               ISBN:
 *                 type: string
 *                 description: The ISBN number of the book.
 *     responses:
 *       200:
 *         description: Book updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Missing or invalid fields
 *       404:
 *         description: Book not found
 */
app.put('/books/:id', (req, res) => {
    const data = readData();
    const book = data.books.find(b => b.id === parseInt(req.params.id));
    if (!book) 
        return res.status(404).send('Book not found');

    const { title, author, publicationDate, ISBN } = req.body;
    if (!title || !author || !publicationDate || !ISBN) {
        return res.status(400).json({ error: 'All book fields (title, author, publicationDate, ISBN) are required' });
    }

    Object.assign(book, { title, author, publicationDate, ISBN });
    writeData(data);

    res.status(200).json(book);
}); 




/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete a book
 *     description: Remove a book from the system.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the book to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       404:
 *         description: Book not found
 */
app.delete('/books/:id', (req, res) => {
    const data = readData();
    const bookIndex = data.books.findIndex(b => b.id === parseInt(req.params.id));
    if (bookIndex === -1) 
        return res.status(404).send('Book not found');

    const deletedBook = data.books.splice(bookIndex, 1);
    writeData(data);

    res.status(200).json(deletedBook);
}); 



// CRUD for authors 

/**
 * @swagger
 * /authors:
 *   post:
 *     summary: Add a new author
 *     description: Create a new author with name, biography, and associated books.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the author.
 *               biography:
 *                 type: string
 *                 description: A brief biography of the author.
 *               books:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: A list of books written by the author.
 *     responses:
 *       201:
 *         description: Author created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       400:
 *         description: Missing or invalid fields
 */
app.post('/authors', [
    body('name').trim().isString().notEmpty().withMessage('Author name is required').escape(),
    body('books').optional().isArray().withMessage('Books should be an array'),
    body('books.*').optional().isString().withMessage('Each book should be a string').escape(),
    body('biography').optional().isString().escape()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    const { name, books, biography } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Author name is required' });
    }

    const data = readData();
    const newAuthor = {
        id: data.authors.length + 1,
        name: req.body.name,
        books: req.body.books || [],
        biography: req.body.biography
    };
    data.authors.push(newAuthor);
    
    try {
        writeData(data);
        res.status(201).json(newAuthor);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save author data' });
    }
}); 


/**
 * @swagger
 * /authors:
 *   get:
 *     summary: Retrieve all authors
 *     description: Get a list of all authors in the system.
 *     responses:
 *       200:
 *         description: A list of authors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Author'
 */
app.get('/authors', (req, res) => {
    const data = readData();
    res.status(200).json(data.authors);
}); 

/**
 * @swagger
 * /authors/{id}:
 *   get:
 *     summary: Retrieve an author by ID
 *     description: Get a specific author by their unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the author to retrieve
 *     responses:
 *       200:
 *         description: Author found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       404:
 *         description: Author not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Author not found"
 */
app.get('/authors/:id', (req, res) => {
    const data = readData()
    const author = data.authors.find(a => a.id === parseInt(req.params.id));
    if (!author) 
        return res.status(404).send('Author not found');

    res.status(200).json(author);
});





/**
 * @swagger
 * /authors/{id}:
 *   put:
 *     summary: Update an author
 *     description: Modify an existing author's information.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the author to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the author.
 *               biography:
 *                 type: string
 *                 description: A brief biography of the author.
 *               books:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: A list of books written by the author.
 *     responses:
 *       200:
 *         description: Author updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       400:
 *         description: Missing or invalid fields
 *       404:
 *         description: Author not found
 */
app.put('/authors/:id', (req, res) => {
    const { name, books, biography } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Author name is required' });
    }
    
    const data = readData();
    const author = data.authors.find(a => a.id === parseInt(req.params.id));
    if (!author) 
        return res.status(404).send('Author not found');

    
    Object.assign(author, { name, books, biography });

    try {
        writeData(data);
        res.status(200).json(author);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update author data' });
    }
}); 



/**
 * @swagger
 * /authors/{id}:
 *   delete:
 *     summary: Delete an author
 *     description: Remove an author from the system.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the author to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Author deleted successfully
 *       404:
 *         description: Author not found
 */
app.delete('/authors/:id', (req, res) => {
    const data = readData();
    const authorIndex = data.authors.findIndex(a => a.id === parseInt(req.params.id));
    if (authorIndex === -1) 
        return res.status(404).send('Author not found');

    const deletedAuthor = data.authors.splice(authorIndex, 1);

    try {
        writeData(data);
        res.status(200).json(deletedAuthor);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete author data' });
    }
}); 



// CRUD for users

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Add a new user
 *     description: Create a new user with name and email, along with purchased books.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user.
 *               email:
 *                 type: string
 *                 description: The email of the user.
 *               purchasedBooks:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: A list of books purchased by the user.
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Missing or invalid fields
 */

app.post('/users', [
    body('name').trim().isString().notEmpty().withMessage('Name is required').escape(),
    body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
    body('purchasedBooks').optional().isArray().withMessage('Purchased books should be an array')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, purchasedBooks } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    const data = readData();
    const newUser = {
        id: data.users.length + 1,
        name: req.body.name,
        email: req.body.email,
        purchasedBooks: req.body.purchasedBooks || []
    };
    data.users.push(newUser);

    try {
        writeData(data);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save user data' });
    }
}); 



/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve all users
 *     description: Get a list of all users in the system.
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
app.get('/users',(req,res) => {
    const data = readData();
    res.status(200).json(data.users);
}); 

//////////////////////////////////////////
app.get('/users/:id', (req, res) => {
    const data = readData();
    const user = data.users.find(u => u.id === parseInt(req.params.id));
    if (!user) 
        return res.status(404).send('User not found');

    res.status(200).json(user);
});




/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user
 *     description: Modify an existing user's information.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user.
 *               email:
 *                 type: string
 *                 description: The email of the user.
 *               purchasedBooks:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: A list of books purchased by the user.
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Missing or invalid fields
 *       404:
 *         description: User not found
 */
app.put('/users/:id', (req, res) => {
    const { name, email, purchasedBooks } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    const data = readData();
    const user = data.users.find(u => u.id === parseInt(req.params.id));
    if (!user) 
        return res.status(404).send('User not found');

    Object.assign(user, { name, email, purchasedBooks });

    try {
        writeData(data);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user data' });
    }
}); 




/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Remove a user from the system.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
app.delete('/users/:id', (req, res) => {
    const data = readData();
    const userIndex = data.users.findIndex(u => u.id === parseInt(req.params.id));
    if (userIndex === -1) 
        return res.status(404).send('User not found');

    const deletedUser = data.users.splice(userIndex, 1);

    try {
        writeData(data);
        res.status(200).json(deletedUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user data' });
    }
}); 

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || "Internal Server Error"
  });
});

module.exports = app;

// Only start server if file is run directly
if (require.main === module) {
  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}