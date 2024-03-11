const fs = require('fs');
const path = require('path');
const { createSectionConfig, createArticleConfig, createCategotyConfig, createInputDir } = require('./config');
const { registerCategoryInTemp,registerNewCategoryInTemp, registerSectionInTemp, registerArticleInTemp, createTempDir } = require('./temp');
const { fileExists } = require('./utils');

async function newArticleSource(rootPath, artPath) {
    await createTempDir(rootPath);
    await createInputDir();

    const pathNodes = artPath.split('/');
    if (pathNodes.length < 3) {
        console.error('Invalid article path');
        return;
    }
    const buildPath = `${process.cwd()}\\build\\${path.basename(rootPath)}`;
    
    const ctgPath = `${buildPath}\\sections\\${pathNodes[0]}-sections.json`;
    const categoryData = fileExists(ctgPath)
    ? readCategorySections(ctgPath)
    : await registerNewCategoryInTemp(ctgPath);
    if (!fileExists(ctgPath)) {
        createCategotyConfig(pathNodes[0]);
    }
    
    let isSectionFound = false;
    for (const section of categoryData.sections) {
        if (section.id === pathNodes[1]) {
            isSectionFound = true;
        }
    }


    if (!isSectionFound) {
        registerSectionInTemp(buildPath, pathNodes[0], pathNodes[1], 'create');
        createSectionConfig(pathNodes[1]);
        createArticleConfig(pathNodes[2]);
        registerArticleInTemp(buildPath, pathNodes[2]);
    } else {
        registerSectionInTemp(buildPath, pathNodes[0], pathNodes[1], 'upsert');
    }

}

function readCategorySections(filePath) {
    registerCategoryInTemp(filePath);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
}

module.exports = {
    newArticleSource
};