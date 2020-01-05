const fs = require('fs');
const qs = require('querystring');
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
  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  let callbackNext = false;
  if (req.method === 'GET') {
    switch (req.url) {
      case "/swim":
        res.writeHead(200, headers);
        res.end(messageQueue.dequeue());
        break;
      case "/background":
        console.log(module.exports.backgroundImageFile);
        callbackNext = true;
        fs.readFile(module.exports.backgroundImageFile, (err, data) => {
          if (err) {
            res.writeHead(404, headers);
            console.log("ERROR:", err, data);
            res.end();
          } else {
            res.writeHead(200, headers);
            console.log("SUCCESS:", data);
            res.end(data);
          }
          next();
        });
        break;
      default:
        res.writeHead(200, headers);
        res.end();
        break;
    }
  } else if (req.method === 'POST') {
    console.log("ENTERING POST PARSING");
    callbackNext = true;

    var bufferArray = [];
    req.on('data', (chunk) => {
      bufferArray.push(chunk);
    });
    req.on('end', function () {
      console.log("BufferArray: ", bufferArray);
      var buffer= Buffer.concat(bufferArray);
      var post = multipart.getFile(buffer);
      if (post === null) {
        // it's probably an actual file, not form data
        post = multipart.parse(buffer);
      } else {
        // it IS form data, so only send the data property
        post = post['data'];
      }
      console.log('Buffer (after concat)', buffer);
      console.log('Post (after getFile parsing)', post);
      console.log(post);
      fs.writeFile(module.exports.backgroundImageFile, post, (err) => {
        if (err) {
          console.log('ERROR WRITING:', err);
        } else {
          console.log('SUCCESS WRITING');
        }
        res.writeHead(201, headers);
        res.end();
        next();
      });
    })
  } else {
    res.writeHead(200, headers);
    res.end();
  }
  if (!callbackNext) {
    next();
  }
};

getRandomCommand = () => {
  var commands = ['left', 'right', 'up', 'down'];
  return commands[Math.floor(Math.random() * commands.length)];
}
