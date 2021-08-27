const fs = require('fs');

const deleteFile = req => {
  fs.unlink(req.file.path, err => {
    console.log(err);
  });
};

module.exports = deleteFile;
