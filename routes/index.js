var express = require('express');
var router = express.Router();
const exec = require('child_process');
const multer = require('multer');
var path = require('path')
var db = require('../model/database.js');


/* GET home page. */
router.get('/contact', function (req, res, next) {
  res.render('contact', { title: 'Express' });
});
router.get('/blog', function (req, res, next) {
  res.render('blog', { title: 'Express' });
});

router.get('/', function (req, res, next) {
  res.render('index');
});

/* GET home page. */
router.get('/real-time', function (req, res, next) {
  res.render('real-time', { title: 'Express' });
});

/* GET home page. */
router.get('/image', function (req, res, next) {
  res.render('image', { prediction: '' });
});

const uploadImage = multer({ dest: "uploads/" });
/* GET home page. */
router.post('/image', uploadImage.single("file"), function (req, res, next) {
  res.render('image', { predictions: '' });
});



const videoStorage = multer.diskStorage({
  destination: 'videos', // Destination to store video 
  filename: (req, file, cb) => {
    cb(null, path.extname(file.fieldname) + '_' + Date.now()
      + file.originalname)
  }
});

router.get("/history", (req, res, next) => {
  var sql = "select word, count(word) as wordCount from words group by word;";
  var params = []
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    console.log(rows);
    res.render("history", { "words": rows });
  });
});

router.get("/words", (req, res, next) => {
  var sql = "select * from words";
  var params = []
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      rows
    })
  });
});

router.post("/createWord", (req, res, next) => {
  var data = {
    word: req.body.word,
  }
  var sql = 'INSERT INTO words (word, createdAt) VALUES (?, ?)';
  var params = [data.word, new Date().toISOString()];
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ "error": err.message })
      return;
    }
    res.json({
      "data": data,
      "id": this.lastID
    })
  });
})

router.delete("/deleteWord/:id", (req, res, next) => {
  db.run(
    'DELETE FROM words WHERE id = ?',
    req.params.id,
    function (err, result) {
      if (err) {
        res.status(400).json({ "error": res.message })
        return;
      }
      res.json({ "message": "deleted", changes: this.changes })
    });
})

module.exports = router;