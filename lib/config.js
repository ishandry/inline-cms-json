const fs = require('fs');

const { getDefaultName } = require('./utils');

function createCategotyConfig(categoryId) {
    const data = {
        title: `REPLACE_WITH_TITLE_${getDefaultName(categoryId)}`
    }
    try {
        const jsonData = JSON.stringify(data, null, 2);
        fs.writeFileSync(process.cwd() + "\\input\\category-config.json", jsonData);
    } catch (err) {
        console.error('Error:', err);
    }

}

function createSectionConfig(sectionId) {
    const data = {
        title: `REPLACE_WITH_TITLE_${getDefaultName(sectionId)}`,
        includeTitleToKeys: true,
    }
    try {
        const jsonData = JSON.stringify(data, null, 2);
        fs.writeFileSync(process.cwd() + "\\input\\section-config.json", jsonData);
    } catch (err) {
        console.error('Error:', err);
    }
}

function createArticleConfig(atricleId) {
    const data = {
        title: `REPLACE_WITH_TITLE_${getDefaultName(atricleId)}`,
        showAsRelatedAt: ["REPLACE_WITH_ANY_ARTICLE_ID_"],
        related: ["REPLACE_WITH_ANY_ARTICLE_ID_"],
        contents: [
            {
                paragraph: {
                    title: "REPLACE_WITH_PARAGRAPH_TITLE_",
                    content: "REPLACE_WITH_PARAGRAPH_CONTENT_"
                },
                keys: ["REPLACE_WITH_KEY_", "REPLACE_WITH_KEY_"]
            },
            {
                video: {
                    url: "REPLACE_WITH_VIDEO_URL_",
                    label: "REPLACE_WITH_VIDEO_LABEL_"
                },
                keys: ["REPLACE_WITH_KEY_", "REPLACE_WITH_KEY_"]
            }
        ]
    }
    try {
        const jsonData = JSON.stringify(data, null, 2);
        fs.writeFileSync(process.cwd() + "\\input\\article-config.json", jsonData);
    } catch (err) {
        console.error('Error:', err);
    }
}

async function createInputDir() {
    await fs.mkdir(process.cwd() + "\\input", { recursive: true }, (err) => {
        if (err) {
            console.error('Error creating directory:', err);
        }
    });
}

module.exports = {
    createSectionConfig,
    createArticleConfig,
    createCategotyConfig,
    createInputDir
};