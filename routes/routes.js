const express = require("express");
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');

// image uplaod
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.filename + "_" + Date.now() + "_" + file.originalname);
  },
});

var upload = multer({
  storage: storage,
}).single("image");

// insert an user into database route
router.post("/add", upload, async (req, res) => {
  try {
    // Создание нового пользователя
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: req.file.filename,
    });

    // Сохранение пользователя с использованием async/await
    await user.save();

    // Установка сообщения в сессию
    req.session.message = {
      type: 'success',
      message: 'User added successfully!',
    };

    // Перенаправление на главную страницу
    res.redirect('/');
  } catch (err) {
    // Обработка ошибки и отправка ответа
    res.json({ message: err.message, type: 'danger' });
  }
});

// get all users route
router.get("/", async (req, res) => {
  try {
    const users = await User.find().exec();
    res.render("index", {
      title: "Home Page",
      users: users,
    });
  } catch (err) {
    res.json({ message: err.message });
  }
});

router.get("/add", (req, res) => {
  res.render("add_users", { title: "Add Users" });
});

module.exports = router;