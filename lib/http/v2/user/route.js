var express = require('express');

var router = express.Router();
var avatar = require('./avatar.js');

router.route('/avatar/:username')
  .get(avatar.get);

module.exports = router;
