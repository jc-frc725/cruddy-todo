const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

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
    var filePath = path.join(__dirname, 'data', id + '.txt');
    fs.writeFile(filePath, text, (err, data) => {
      if (err) {
        callback(err);;
      } else {
        console.log('success?', text);
        callback(null, {id, text});
      }

    });
  });

  //var textData = text;

//  items[id] = text;

};

exports.readAll = (callback) => {
  var data = _.map(items, (text, id) => {
    return { id, text };
  });
  callback(null, data);
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
