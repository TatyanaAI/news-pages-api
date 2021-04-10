const fs = require("fs");

const fileName = "./db_comments.json";

let data = [];

module.exports = {
  init() {
    try {
      const fileContent = fs.readFileSync(fileName);
      data = JSON.parse(fileContent.toString());
    } catch (e) {
      data = [];
    }
  },

  getComments() {
    return data;
  },

  getComment(id) {
    return data.find(item => item.id === id) || {};
  },

  addComment(item) {
    data.push(item);
    this.save();
  },

  deleteComment(id) {
    const index = data.findIndex(item => item.id === id);
    if (index >= 0) {
      data.splice(index, 1);
      this.save();
    }
  },

  deleteComments(newsId) {
    data = data.filter(item => item.newsId !== newsId);
    this.save();
  },

  save() {
    fs.writeFileSync(fileName, JSON.stringify(data));
  }
};