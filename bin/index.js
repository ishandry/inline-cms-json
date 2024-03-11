#!/usr/bin/env node

const fs = require("fs");
const { getCurrentState } = require("../lib/state");
const { newArticleSource } = require("../lib/article");
const { buildInputs } = require("../lib/build");


const commandParameter = process.argv[2];
if (commandParameter === "state") {
    getCurrentState(`${process.cwd()}\\${process.argv[3]}`);
}

if (commandParameter === "article") {
    newArticleSource(`${process.cwd()}\\${process.argv[3]}`, process.argv[4]);
}

if (commandParameter === "build") {
    buildInputs();
}

// fs.writeFile(filePath, jsonString, (err) => {
//   if (err) {
//     console.error("Error writing JSON file:", err);
//   } else {
//     console.log("JSON file has been created successfully.");
//   }
// });

