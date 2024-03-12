const fs = require("fs");
const fse = require("fs-extra");
const path = require("path");

function showAsRelatedAt(atArray, id, title, rootPath) {
  for (const at of atArray) {
    const data = fs.readFileSync(rootPath + `\\articles\\${at}.json`, "utf8");
    const article = JSON.parse(data);
    article.related.push({ id, title });
    const jsonData = JSON.stringify(article, null, 2);
    fs.writeFileSync(rootPath + `\\articles\\${at}.json`, jsonData);
  }
}

function getRelated(relatedIds, rootPath) {
  const result = [];
  for (const id of relatedIds) {
    const data = fs.readFileSync(rootPath + `\\articles\\${id}.json`, "utf8");
    const article = JSON.parse(data);
    result.push({ id, title: article.title });
  }
  return result;
}

module.exports = {
  showAsRelatedAt,
  getRelated,
};
