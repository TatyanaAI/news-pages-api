const express = require("express");
const { nanoid } = require("nanoid");
const router = express.Router();


const createRouter = (dbComments, dbNews) => {
  router.get("/", (req, res) => {
    let comments = dbComments.getComments();
    if (req.query.news_id) {
      comments = comments.filter(item => item.newsId === req.query.news_id);
    }
    res.send(comments);
  });

  router.post("/", (req, res) => {
    if (!req.body.newsId)
      return res.status(400).send({ error: "NewsId must be present in the request. Please, check up this field." });
    if (!req.body.text)
      return res.status(400).send({ error: "Text must be present in the request. Please, check up this field." });

    const news = dbNews.getNews(req.body.newsId);
    if (!news)
      return res.status(400).send({ error: "Parameter newsId incorrect." });

    const id = nanoid();
    let comment = { ...req.body, id };
    dbComments.addComment(comment);
    res.send(comment);
  });

  router.delete("/:id", (req, res) => {
    const comment = dbComments.getComment(req.params.id);
    if (!comment) {
      return res.status(400).send({ error: "Parameter id incorrect." });
    }
    dbComments.deleteComment(req.params.id)
    return res.send(200)
  });

  return router;
};


module.exports = createRouter;