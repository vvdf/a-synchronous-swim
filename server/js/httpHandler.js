const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const messageQueue = require('./messageQueue');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////


module.exports.initialize = (elementCount) => {
  for (let i = 0; i < elementCount; i++) {
    messageQueue.enqueue(getRandomCommand());
  }
};

module.exports.router = (req, res, next = ()=>{}) => {
  // console.log('Serving request type ' + req.method + ' for url ' + req.url);
  res.writeHead(200, headers);
  if (req.method === 'GET') {
    switch (req.url) {
      case "/swim": res.end(messageQueue.dequeue()); break;
      case "/background":
        fs.readFile('./background.jpg', (err, data) => {
          if (err) {
            console.log("ERROR:", err, data);
            res.end(err);
          } else {
            console.log("SUCCESS:", data);
            res.end(data);
          }
        });
        break;
      default: res.end(); break;
    }
  } else {
    res.end();
  }
  next(); // invoke next() at the end of a request to help with testing!
};

getRandomCommand = () => {
  var commands = ['left', 'right', 'up', 'down'];
  return commands[Math.floor(Math.random() * commands.length)];
}
