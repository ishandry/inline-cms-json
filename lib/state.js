const fs = require("fs");
const path = require("path");

function getCurrentState(statePath) {
  const directoryPath = statePath;

  fs.readdir(directoryPath, (err, items) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }
    items.forEach((item) => {
      const itemPath = path.join(directoryPath, item);
      const itemName = path.basename(itemPath);
      fs.stat(itemPath, (err, stats) => {
        if (err) {
          console.error("Error getting item stats:", err);
          return;
        }
        if (itemName === "sections") {
          fs.readdir(itemPath, (err, categoriesSections) => {
            if (err) {
              console.error("Error reading directory:", err);
              return;
            }
            categoriesSections.forEach((categorySections) => {
              displayCategorySections(path.join(itemPath, categorySections));
            });
          });
        }
      });
    });
  });
}

function displayCategorySections(file) {
  const filename = path.basename(file);
  console.log("\n=== ", filename.split("-sections")[0]);
  fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading JSON file:", err);
      return;
    }

    try {
      const jsonData = JSON.parse(data);
      jsonData.sections.forEach((section) => {
        console.log(`    -- ${section.id}`);
        section.articles.forEach((article) => {
          console.log(`         . ${article.id}`);
        });
      });
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  });
}

module.exports = {
  getCurrentState,
};
