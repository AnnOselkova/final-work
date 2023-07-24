const express = require('express');
const app = express();
const fs = require('fs');

app.use(express.json());

// Запрос GET для получения всех книг
app.get('/books', (req, res) => {
  fs.readFile('books.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    } else {
      const books = JSON.parse(data);
      res.json(books);
    }
  });
});

// Запрос GET для получения книги по bookid
app.get('/books/:bookid', (req, res) => {
  const bookid = req.params.bookid;
  fs.readFile('books.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    } else {
      const books = JSON.parse(data);
      const book = books.find(book => book.bookid === bookid);
      if (book) {
        res.json(book);
      } else {
        res.status(404).send('Book not found');
      }
    }
  });
});

// Запрос POST для создания новой книги
app.post('/books', (req, res) => {
  const { bookid, title, author } = req.body;
  if (bookid && title && author) {
    fs.readFile('books.json', 'utf8', (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        const books = JSON.parse(data);
        const exBook = books.find(book => book.bookid === bookid);
        if (exBook) {
          res.status(400).send('Book with the same bookid already exists');
        } else {
          const newBook = { bookid, title, author };
          books.push(newBook);
          fs.writeFile('books.json', JSON.stringify(books), 'utf8', err => {
            if (err) {
              console.log(err);
              res.status(500).send('Internal Server Error');
            } else {
              res.json(newBook);
            }
          });
        }
      }
    });
  } else {
    res.status(400).send('Invalid request');
  }
});

// Запрос PUT для редактирования книги по bookid
app.put('/books/:bookid', (req, res) => {
  const bookid = req.params.bookid;
  const { title, author } = req.body;
  if (title && author) {
    fs.readFile('books.json', 'utf8', (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        const books = JSON.parse(data);
        const bookIndex = books.findIndex(book => book.bookid === bookid);
        if (bookIndex !== -1) {
          books[bookIndex].title = title;
          books[bookIndex].author = author;
          fs.writeFile('books.json', JSON.stringify(books), 'utf8', err => {
            if (err) {
              console.log(err);
              res.status(500).send('Internal Server Error');
            } else {
              res.json(books[bookIndex]);
            }
          });
        } else {
          res.status(404).send('Book not found');
        }
      }
    });
  } else {
    res.status(400).send('Invalid request');
  }
});

// Запрос DELETE для удаления книги по bookid
app.delete('/books/:bookid', (req, res) => {
  const bookid = req.params.bookid;
  fs.readFile('books.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    } else {
      const books = JSON.parse(data);
      const bookIndex = books.findIndex(book => book.bookid === bookid);
      if (bookIndex !== -1) {
        const delBook = books.splice(bookIndex, 1);
        fs.writeFile('books.json', JSON.stringify(books), 'utf8', err => {
          if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
          } else {
            res.json(delBook[0]);
          }
        });
      } else {
        res.status(404).send('Book not found');
      }
    }
  });
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});



