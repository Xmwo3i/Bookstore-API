const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0', 
    info: {
      title: 'Bookstore API',
      version: '1.0.0', 
      description: 'API for managing a bookstore with books, authors, and users', // API description
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Book: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the book',
              example: '1',
            },
            title: {
              type: 'string',
              description: 'Title of the book',
              example: 'Harry Potter',
            },
            author: {
              type: 'string',
              description: 'the author who wrote the book',
              example: 'J. K. Rowling',
            },
            publicationDate: {
              type: 'string',
              description: 'Date of the book was published',
              example: '1998-07-02',
            },
            ISBN: {
              type: 'string',
              description: 'Number of the book',
              example: '978-0747538493',
            },
          },
          required: ['title', 'author', 'publicationDate', 'ISBN'],
        },

        // Author Schema
        Author: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the author',
              example: '1',
            },
            name: {
              type: 'string',
              description: 'Name of the author',
              example: 'Darren Hardy',
            },
            books: {
                type: 'array',
                items: {
                    type: 'integer',
                },
                description: 'A list of books written by the author',
            },
            biography: {
              type: 'string',
              description: 'Short biography of the author',
              example:'JK Rowling is a British author and philanthropist.'
            }
          },
          required: ['name'],
        },

        // User Schema
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the user',
              example: '1',
            },
            name: {
              type: 'string',
              description: 'Name of the user',
              example: 'Mostafa Faghani',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address of the user',
              example: 'Faghanim@mcmaster.ca',
            },
            purchasedBooks: {
                type: 'array',
                items: {
                    type: 'integer',
                },
                description: 'A list of books purchased by the user',
            },
          },
          required: ['name', 'email'],
        },
      },
    },
  },
  apis: ['./index.js'], 
};


const swaggerSpec = swaggerJSDoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
};
