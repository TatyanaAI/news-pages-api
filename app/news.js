const fs = require("fs");
const express = require("express");
const { nanoid } = require("nanoid");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const config = require('../config');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, nanoid() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const createRouter = (dbNews, dbComments) => {
  router.get("/", (req, res) => {
    const news = dbNews.getNews().map(item => ({
      id: item.id,
      title: item.title,
      image: item.image,
      datetime: item.datetime
    }))
    res.send(news);
  });

  router.get("/:id", (req, res) => {
    const news = dbNews.getNews().find(item => item.id === req.params.id);
    if (!news) {
      return res.status(400).send({ error: "Parameter id incorrect." });
    }
    res.send(news);
  });

  router.post("/", upload.single('image'), (req, res) => {
    const id = nanoid();
    const datetime = new Date().toISOString();
    let news = { ...req.body, id, datetime };

    if (req.file) {
      news.image = req.file.filename;
    }

    if (!req.body.title || !req.body.content) {
      const fieldName = !req.body.title ? "Title" : "Content"
      return res.status(400).send({ error: fieldName + " must be present in the request. Please, check up this field." });
    }
    dbNews.addNews(news);
    res.send(news);
  });

  router.delete("/:id", (req, res) => {
    const news = dbNews.getNews(req.params.id);
    if (!news) {
      return res.status(400).send({ error: "Parameter id incorrect." });
    }
    dbComments.deleteComments(req.params.id)
    if (news.image) {
      const filePath = config.uploadPath + "/" + news.image;
      fs.unlinkSync(filePath);
    }
    dbNews.deleteNews(req.params.id)
    return res.send(200)
  });

  return router;
};

module.exports = createRouter;