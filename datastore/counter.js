const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////
// 1st param = err
// 2nd param = success
exports.getNextUniqueId = (err, id) => {
  // readCounter(callback(err, id) )

  // get the next ID, if it exists in file
  readCounter((err, id) => {
    let counterFromFile = id;
    console.log(`read from file: ${id}`);
    console.log(`err is: ${err}`);

    counter = counterFromFile + 1;
    console.log(`adding 1 to ${counterFromFile}, now equal to: ${counter}`);

    writeCounter(counter, (err, counterString) => {
      console.log(`this is what will be written to file: ${counterString}`);
    });
    // return zeroPaddedNumber(counterFromFile);
  });
  // console.log('counterFromFile after using readCounter: ' + counterFromFile);
  // counter = counter + 1;
  // err = null;
  // id = zeroPaddedNumber(counter);
  console.log(`finished read: ${counter}`);
  return zeroPaddedNumber(counter);

};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
