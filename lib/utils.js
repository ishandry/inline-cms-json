const fs = require("fs");
const fse = require("fs-extra");

function getDefaultName(idString) {
  return (
    idString.charAt(0).toUpperCase() + idString.replace(/-/g, " ").slice(1)
  );
}

function fileExists(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}

function directoryExists(path) {
  try {
    const stats = fs.statSync(path);
    return stats.isDirectory();
  } catch (err) {
    if (err.code === "ENOENT") {
      return false;
    } else {
      throw err;
    }
  }
}

function readJsonFile(filePath) {
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

function cleanup() {
  if (directoryExists(process.cwd() + "\\temp")) {
    fse.removeSync(process.cwd() + "\\temp");
  }
  if (directoryExists(process.cwd() + "\\input")) {
    fse.removeSync(process.cwd() + "\\input");
  }
}

module.exports = {
  getDefaultName,
  fileExists,
  directoryExists,
  readJsonFile,
  cleanup
};
