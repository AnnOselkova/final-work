const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;


// Подключение к базе данных MongoDB
mongoose.connect('mongodb://localhost/library', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Схема книги
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
});
const Book = mongoose.model('Book', bookSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Запросы

// GET - получение всех книг
app.get('/books', (req, res) => {
  Book.find((err, books) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(books);
    }
  });
});

// GET - получение книги по bookid
app.get('/books/:bookId', (req, res) => {
  Book.findById(req.params.bookId, (err, book) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(book);
    }
  });
});

// POST - создание книги
app.post('/books', (req, res) => {
  const newBook = new Book(req.body);
  newBook.save((err, book) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(book);
    }
  });
});

// PUT - редактирование книги по bookid
app.put('/books/:bookId', (req, res) => {
  Book.findByIdAndUpdate(req.params.bookId, req.body, { new: true }, (err, book) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(book);
    }
  });
});

// DELETE - удаление книги по bookid
app.delete('/books/:bookId', (req, res) => {
  Book.findByIdAndRemove(req.params.bookId, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send('Book deleted');
    }
  });
});

// POST - авторизация
app.post('/login', (req, res) => {
  // Ваш код авторизации
});

// POST - регистрация
app.post('/register', (req, res) => {
  // Ваш код регистрации
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});