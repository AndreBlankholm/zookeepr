const path = require('path');
const router = require('express').Router();

router.get('/', (req, res) => { //root route
  res.sendFile(path.join(__dirname, '../../public/index.html')); //index.html to be served from our Express.js server.
});  //res.sendFile displays the file we want to send back to the client.

router.get('/animals', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/animals.html'));
});

router.get('/zookeepers', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
});

router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html')); //( * )is catching wrong Url
});

module.exports = router;















