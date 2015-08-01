var express = require('express');

var router = express.Router();
var authController = require('./controllers/auth.js');
var userController = require('./controllers/user.js');
var clientController = require('./controllers/client.js');
var oauth2Controller = require('./controllers/oauth2.js');
  
router.route('/user')
  .get(authController.isAuthenticated, userController.getUser)
  .delete(authController.isAuthenticated, userController.deleteUser)
  .post(authController.isAuthenticated, userController.postUser);
  
router.route('/client')
  .post(authController.isAuthenticated, clientController.postClients)
  .delete(authController.isAuthenticated, clientController.deleteClients)
  .get(authController.isAuthenticated, clientController.getClients);
  
router.route('/oauth2/authorize')
  .get(authController.isAuthenticated, oauth2Controller.authorization)
  .post(authController.isAuthenticated, oauth2Controller.decision);

router.route('/oauth2/token')
  .post(authController.isClientAuthenticated, oauth2Controller.token);
  
module.exports = router;