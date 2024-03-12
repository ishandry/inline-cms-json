const fs = require("fs");
const path = require("path");
const { readJsonFile, directoryExists } = require("./utils");

function whiteSpaces(directoryName) {
  const directoryPath = process.cwd() + "\\" + directoryName;
  if (!directoryExists(directoryPath)) {
    throw new Error("Directory not found");
  }
  createWhiteSpacesDir(directoryName);

  iterateOverDirectory(directoryPath, (file) => {
    const relativePath = file.split(directoryName)[1];
    const removePath =
      process.cwd() + "\\whitespaces\\removed\\" + directoryName + relativePath;
    const addPath =
      process.cwd() + "\\whitespaces\\added\\" + directoryName + relativePath;
    rewriteWhiteSpaces(file, 0, removePath);
    rewriteWhiteSpaces(file, 2, addPath);
  });
}

function rewriteWhiteSpaces(input, space, output) {
  if (!output) {
    output = input;
  }
  const fileData = readJsonFile(input);
  fs.writeFileSync(output, JSON.stringify(fileData, null, space));
}

function iterateOverDirectory(directoryPath, callback) {
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
        if (itemName === "sections" || itemName === "articles") {
          fs.readdir(itemPath, (err, files) => {
            if (err) {
              console.error("Error reading directory:", err);
              return;
            }
            files.forEach((file) => {
              callback(path.join(itemPath, file));
            });
          });
        } else if (itemName === "searchkeys.json") {
          callback(itemPath);
        }
      });
    });
  });
}

function createWhiteSpacesDir(sourceDirName) {
  fs.mkdir(
    process.cwd() + `\\whitespaces\\added\\${sourceDirName}\\articles`,
    { recursive: true },
    (err) => {
      if (err) {
        console.error("Error creating directory:", err);
      }
    }
  );

  fs.mkdir(
    process.cwd() + `\\whitespaces\\added\\${sourceDirName}\\sections`,
    { recursive: true },
    (err) => {
      if (err) {
        console.error("Error creating directory:", err);
      }
    }
  );

  fs.mkdir(
    process.cwd() + `\\whitespaces\\removed\\${sourceDirName}\\articles`,
    { recursive: true },
    (err) => {
      if (err) {
        console.error("Error creating directory:", err);
      }
    }
  );

  fs.mkdir(
    process.cwd() + `\\whitespaces\\removed\\${sourceDirName}\\sections`,
    { recursive: true },
    (err) => {
      if (err) {
        console.error("Error creating directory:", err);
      }
    }
  );
}

module.exports = {
  whiteSpaces,
};
