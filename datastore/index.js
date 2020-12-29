const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // fs.writeFile(path, data, callback)
  // path = ./datastore/data/newTodoList.txt?

  // data = {id, text}
  // callback(null, text stuff)

  // should be making a new file.txt for every item
  // filename = id
  // file contents = text only, no objects

  counter.getNextUniqueId((err, id) => {
    var filePath = path.join(exports.dataDir, id + '.txt');
    fs.writeFile(filePath, text, (err) => {
      if (err) {
        callback(err);
      } else {
        callback(null, {id, text});
      }
    });
  });
};

exports.readAll = (callback) => {
/* return: array of todos
  todo item: {id, item} */
  let readFilePromise = Promise.promisify(fs.readFile);

  // construct new Promise
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('readAll error');
    } else {
      // populate an array of Promises
      var allTodos = _.map(files, (fileName) => {
        let id = fileName.substring(0, 5);
        // readFile (filepath, file's data within)
        return readFilePromise(path.join(exports.dataDir, fileName))
          .then(fileData => {
            return {id: id, text: fileData.toString()};
          });
      });
      Promise.all(allTodos)
        .then(results =>
          callback(null, results))
        .catch(err =>
          callback(err));
    }
  });
};

exports.readOne = (id, callback) => {
  var filePath = path.join(exports.dataDir, id + '.txt');
  fs.readFile(filePath, (err, fileData) => {
    if (err) {
      callback(err);
    } else {
      callback(null, { id, text: fileData.toString()});
    }
  });
};

exports.update = (id, text, callback) => {
  // write file (filename/path, newdata, cb)
  var filePath = path.join(exports.dataDir, id + '.txt');

  // should not make new file for non existant id
  // must look up todo file first, if exists, write, if not, dont
  fs.readFile(filePath, (err, fileData) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(filePath, text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, { id, 'text': text} );
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  // fs.unlink(filePathName, cb)
  var filePath = path.join(exports.dataDir, id + '.txt');
  fs.unlink(filePath, (err) => {
    if (err) {
      callback(err);
    } else {
      callback();
    }
  });

};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
