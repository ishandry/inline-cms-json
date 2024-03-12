const fs = require("fs");
const path = require("path");
const {
  createSectionConfig,
  createArticleConfig,
  createCategotyConfig,
  createInputDir,
} = require("./config");
const {
  registerCategoryInTemp,
  registerNewCategoryInTemp,
  registerSectionInTemp,
  registerArticleInTemp,
  createTempDir,
} = require("./temp");
const { fileExists, cleanup } = require("./utils");

async function newArticleSource(rootPath, artPath) {
  try {
  await createTempDir(rootPath);
  await createInputDir();

  const pathNodes = artPath.split("/");
  if (pathNodes.length < 3) {
    console.error("Invalid article path");
    return;
  }
  const buildPath = `${process.cwd()}\\build\\${path.basename(rootPath)}`;

  const ctgPath = `${rootPath}\\sections\\${pathNodes[0]}-sections.json`;
  const ctgPathBuild = `${buildPath}\\sections\\${pathNodes[0]}-sections.json`;
  const categoryData = fileExists(ctgPath)
    ? readCategorySections(ctgPath, ctgPathBuild)
    : await registerNewCategoryInTemp(ctgPathBuild);
  if (!fileExists(ctgPath)) {
    createCategotyConfig(pathNodes[0]);
  }

  let isSectionFound = false;
  let secTitle = "";
  for (const section of categoryData.sections) {
    if (section.id === pathNodes[1]) {
      secTitle = section.title;
      isSectionFound = true;
    }
  }

  if (!isSectionFound) {
    registerSectionInTemp(
      buildPath,
      pathNodes[0],
      pathNodes[1],
      "create",
      secTitle
    );
    createSectionConfig(pathNodes[1]);
    createArticleConfig(pathNodes[2]);
    registerArticleInTemp(buildPath, pathNodes[2]);
  } else {
    registerSectionInTemp(
      buildPath,
      pathNodes[0],
      pathNodes[1],
      "upsert",
      secTitle
    );
    createArticleConfig(pathNodes[2]);
    registerArticleInTemp(buildPath, pathNodes[2]);
  }
  } catch (e) {
    cleanup();
    throw e;
  }
}

function readCategorySections(filePath, buildPath) {
  const data = fs.readFileSync(filePath, "utf8");
  const result = JSON.parse(data);
  registerCategoryInTemp(buildPath, result.category.title);
  return result;
}

module.exports = {
  newArticleSource,
};
