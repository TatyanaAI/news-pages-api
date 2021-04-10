const fs = require("fs");

const fileName = "./db_news.json";

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

  getNews(id) {
    return id ? (data.find(item => item.id === id) || []) : data;
  },

  addNews(item) {
    data.push(item);
    this.save();
  },

  deleteNews(id) {
    const index = data.findIndex(item => item.id === id);
    if (index >= 0) {
      data.splice(index, 1);
      this.save();
    }
  },

  save() {
    fs.writeFileSync(fileName, JSON.stringify(data));
  }
};