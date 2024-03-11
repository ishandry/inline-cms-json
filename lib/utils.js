const fs = require('fs');

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
      if (err.code === 'ENOENT') {
          return false;
      } else {
          throw err;
      }
  }
}

module.exports = {
    getDefaultName,
    fileExists,
    directoryExists,
};
