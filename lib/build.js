const fs = require("fs");
const fse = require("fs-extra");
const path = require("path");

const { directoryExists, fileExists, readJsonFile, cleanup } = require("./utils");
const { showAsRelatedAt, getRelated } = require("./related");

async function buildInputs() {
  if (
    !(
      directoryExists(process.cwd() + "\\input") &&
      directoryExists(process.cwd() + "\\temp")
    )
  ) {
    throw new Error("Input or temp directory not found");
  }
  const rootInBuild = await createBuildDir();

  const catTemp = readJsonFile(process.cwd() + "\\temp\\category.json", "utf8");
  const catCfg = fileExists(process.cwd() + "\\input\\category-config.json") ? readJsonFile(
    process.cwd() + "\\input\\category-config.json",
    "utf8"
  ): {title: catTemp.data.title};

  const secTemp = readJsonFile(process.cwd() + "\\temp\\section.json", "utf8");
  const secCfg = fileExists(process.cwd() + "\\input\\section-config.json") ? readJsonFile(
    process.cwd() + "\\input\\section-config.json",
    "utf8"
  ) : { title: secTemp.data.title, includeTitleToKeys: false }

  const artCfg = readJsonFile(
    process.cwd() + "\\input\\article-config.json",
    "utf8"
  );
  const artTemp = readJsonFile(process.cwd() + "\\temp\\article.json", "utf8");

  showAsRelatedAt(
    artCfg.showAsRelatedAt,
    artTemp.data.id,
    artCfg.title,
    rootInBuild
  );
  const art = {
    title: artCfg.title,
    showAsRelatedAt: artCfg.showAsRelatedAt,
    related: getRelated(artCfg.related, rootInBuild),
    contents: [],
  };

  const allKeys = readJsonFile(`${rootInBuild}\\searchkeys.json`, "utf8");
  let keyId = Math.max(...allKeys.keys.map((item) => parseInt(item.id))) + 1;

  let paragraphCount = 1;
  let videoCount = 1;
  let index = 0;

  newKeys = [];

  for (const content of artCfg.contents) {
    let id;
    let contentType;
    if (content.paragraph) {
      id = `p${paragraphCount++}`;
      contentType = "paragraph";
      art.contents.push({
        id,
        index: index++,
        type: contentType,
        paragraph: {
          title: content.paragraph.title,
          content: content.paragraph.content,
        },
      });
    } else if (content.video) {
      id = `v${videoCount++}`;
      contentType = "video";
      art.contents.push({
        id,
        index: index++,
        type: contentType,
        video: {
          url: content.video.url,
          label: content.video.label,
        },
      });
    }

    for (const key of content.keys) {
      newKeys.push({
        id: (keyId++).toString(),
        value: key,
        type: "content",
        category: catTemp.data.categoryId,
        section: secTemp.data.id,
        article: artTemp.data.id,
        content: id,
        "content-type": contentType,
        "path-naming": `${catCfg.title.toLowerCase()} / ${secCfg.title.toLowerCase()}`,
        "from-article-naming": artCfg.title,
      });
    }
  }

  newKeys.push({
    id: (keyId++).toString(),
    value: artCfg.title,
    type: "article",
    category: catTemp.data.categoryId,
    section: secTemp.data.id,
    article: artTemp.data.id,
    "path-naming": `${catCfg.title.toLowerCase()} / ${secCfg.title.toLowerCase()}`,
    "from-article-naming": artCfg.title,
  });

  fs.writeFileSync(artTemp.path, JSON.stringify(art, null, 0));

  if (!fileExists(catTemp.path)) {
    fs.writeFileSync(catTemp.path, JSON.stringify({category: {
        title: catCfg.title,
        id: catTemp.data.categoryId,
    }, sections: []}, null, 0));
    newKeys.push({
      id: (keyId++).toString(),
      value: catCfg.title,
      type: "category",
      category: catTemp.data.categoryId,
      "path-naming": catCfg.title.toLowerCase(),
    });
  }

  const catFile = readJsonFile(catTemp.path, "utf8");
  let newSections = catFile.sections.filter(
      (section) => section.id !== secTemp.data.id
      );
  if (secTemp.data.type === "create") {
    newSections.push({
      id: secTemp.data.id,
      title: secCfg.title,
      includeTitleToKeys: secCfg.includeTitleToKeys,
      articles: [{ id: artTemp.data.id, title: artCfg.title }],
    });
  } else {
    let currentSection = catFile.sections.filter(
      (section) => section.id === secTemp.data.id
    )[0];
    let updatedSection = {
      ...currentSection,
      articles: currentSection.articles.concat([{
        id: artTemp.data.id,
        title: artCfg.title,
      }]),
    };
    newSections.push(updatedSection);
  }

  catFile.sections = newSections;
  fs.writeFileSync(catTemp.path, JSON.stringify(catFile, null, 0));

  if (secCfg.includeTitleToKeys) {
    newKeys.push({
      id: (keyId++).toString(),
      value: secCfg.title,
      type: "section",
      category: catTemp.data.categoryId,
      section: secTemp.data.id,
      "path-naming": `${catCfg.title.toLowerCase()} / ${secCfg.title.toLowerCase()}`,
    });
  }

  fs.writeFileSync(
    `${rootInBuild}\\searchkeys.json`,
    JSON.stringify(
      {
        keys: allKeys.keys.concat(newKeys),
      },
      null,
      0
    )
  );
  cleanup();
}

async function createBuildDir() {
  await fs.mkdir(process.cwd() + "\\build", { recursive: true }, (err) => {
    if (err) {
      console.error("Error creating directory:", err);
    }
  });

  const data = fs.readFileSync(process.cwd() + "\\temp\\source.json", "utf8");
  const source = JSON.parse(data).source;

  try {
    fse.copySync(source, process.cwd() + "\\build\\" + path.basename(source));
  } catch (err) {
    console.error("Error copying directory:", err);
  }

  return process.cwd() + "\\build\\" + path.basename(source);
}

module.exports = { buildInputs };
