#!/usr/bin/env node

const fs = require("fs");
const { getCurrentState } = require("../lib/state");
const { newArticleSource } = require("../lib/article");
const { buildInputs } = require("../lib/build");
const { whiteSpaces } = require("../lib/whitespaces");


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

if (commandParameter === "whitespace") {
    whiteSpaces(process.argv[3]);
}

