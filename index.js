const express = require("express");
const cors = require("cors");
const news = require("./app/news");
const comments = require("./app/comments");
const dbNews = require("./fileNewsDb");
const dbComments = require("./fileCommentsDb");
const app = express();

const port = 8000;

dbNews.init();
dbComments.init();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use("/news", news(dbNews, dbComments));
app.use("/comments", comments(dbComments, dbNews));

app.listen(port, () => {
  console.log("Server started at http://localhost:" + port);
});