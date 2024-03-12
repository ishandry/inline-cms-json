const fs = require("fs");
const path = require("path");

async function registerNewCategoryInTemp(ctgPath) {
  const category = path.basename(ctgPath).split("-sections")[0];
  const emptyData = { categoryId: category, sections: [] };
  await fs.writeFile(
    process.cwd() + "\\temp\\category.json",
    JSON.stringify({ path: ctgPath, data: emptyData }, null, 2),
    (err) => {
      if (err) {
        console.error("Error writing JSON file:", err);
        return;
      }
    }
  );
  return emptyData;
}

async function registerCategoryInTemp(ctgPath, title) {
  const category = path.basename(ctgPath).split("-sections")[0];
  const data = { categoryId: category, title };
  await fs.writeFile(
    process.cwd() + "\\temp\\category.json",
    JSON.stringify({ path: ctgPath, data }, null, 2),
    (err) => {
      if (err) {
        console.error("Error writing JSON file:", err);
        return;
      }
    }
  );
  return data;
}

function registerSectionInTemp(rootPath, ctg, sectionId, type, title) {
  const emptyData = { id: sectionId, type, title };
  fs.writeFile(
    process.cwd() + "\\temp\\section.json",
    JSON.stringify(
      { path: rootPath + `\\sections\\${ctg}-sections.json`, data: emptyData },
      null,
      2
    ),
    (err) => {
      if (err) {
        console.error("Error writing JSON file:", err);
        return;
      } else {
        return emptyData;
      }
    }
  );
}

function registerArticleInTemp(rootPath, articleId) {
  const data = { id: articleId };
  fs.writeFile(
    process.cwd() + "\\temp\\article.json",
    JSON.stringify(
      { path: rootPath + `\\articles\\${articleId}.json`, data },
      null,
      2
    ),
    (err) => {
      if (err) {
        console.error("Error writing JSON file:", err);
        return;
      }
    }
  );
}

async function createTempDir(sourcePath) {
  await fs.mkdir(process.cwd() + "\\temp", { recursive: true }, (err) => {
    if (err) {
      console.error("Error creating directory:", err);
    }
  });

  await fs.writeFile(
    process.cwd() + "\\temp\\source.json",
    JSON.stringify({ source: sourcePath }, null, 2),
    (err) => {
      if (err) {
        console.error("Error writing JSON file:", err);
        return;
      }
    }
  );
}

module.exports = {
  registerCategoryInTemp,
  registerNewCategoryInTemp,
  registerSectionInTemp,
  registerArticleInTemp,
  createTempDir,
};
