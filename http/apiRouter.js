var express = require('express');

var router = express.Router();
var secretController = require('./controllers/secret.js');

router.route('/secret')
  .get(secretController.getSecret);
  
module.exports = router;