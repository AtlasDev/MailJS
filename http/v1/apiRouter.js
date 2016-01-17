var express = require('express');

var router = express.Router();
var authController = require('./controllers/auth.js');
var userController = require('./controllers/user.js');
var loginController = require('./controllers/login.js');
var clientController = require('./controllers/client.js');
var oauth2Controller = require('./controllers/oauth2.js');
var tfaController = require('./controllers/2fa.js');
var mailboxController = require('./controllers/mailbox.js');
var sessionController = require('./controllers/session.js');
var domainController = require('./controllers/domain.js');
var inboxController = require('./controllers/inbox.js');
var transferController = require('./controllers/transfer.js');
var emailController = require('./controllers/email.js');

router.route('/login')
  .post(authController.isUserAuthenticated, loginController.postLogin)
  .delete(authController.isSessionAuthenticated, loginController.deleteLogin)
  .patch(authController.isSessionAuthenticated, loginController.patchLogin);

router.route('/user')
  .post(authController.isAuthenticated, authController.checkTFA, userController.postUser)
  .get(authController.isAuthenticated, authController.checkTFA, userController.getUsers);

router.route('/2fa')
  .get(authController.isSessionAuthenticated, authController.checkTFA, tfaController.getTFA)
  .delete(authController.isSessionAuthenticated, authController.checkTFA, tfaController.deleteTFA)
  .post(authController.isSessionAuthenticated, authController.checkTFA, tfaController.postTFA);

router.route('/user/current')
  .get(authController.isAuthenticated, authController.checkTFA, userController.currentUser);

router.route('/user/session')
  .get(authController.isAuthenticated, authController.checkTFA, sessionController.getSessions);

router.route('/user/:user')
  .get(authController.isAuthenticated, authController.checkTFA, userController.getUser);

router.route('/mailbox')
  .post(authController.isAuthenticated, authController.checkTFA, mailboxController.postMailbox)
  .get(authController.isAuthenticated, authController.checkTFA, mailboxController.getMailboxes);

router.route('/mailbox/:mailbox')
  .get(authController.isAuthenticated, authController.checkTFA, mailboxController.getMailbox);

router.route('/inbox')
  .post(authController.isAuthenticated, authController.checkTFA, inboxController.postInbox);

router.route('/inbox/:inbox')
  .get(authController.isAuthenticated, authController.checkTFA, inboxController.getInbox);

router.route('/inbox/:inbox/:skip')
  .get(authController.isAuthenticated, authController.checkTFA, inboxController.getInbox);

router.route('/inbox/:inbox/:skip/:limit')
  .get(authController.isAuthenticated, authController.checkTFA, inboxController.getInbox);

router.route('/domain')
  .post(authController.isAuthenticated, authController.checkTFA, domainController.postDomain)
  .get(authController.isAuthenticated, authController.checkTFA, domainController.getDomains);

router.route('/client')
  .post(authController.isSessionAuthenticated, authController.checkTFA, clientController.postClient)
  .get(authController.isAuthenticated, authController.checkTFA, clientController.getOwnClients);

router.route('/transfer/:type/:id')
  .get(authController.isAuthenticated, authController.checkTFA, transferController.find)
  .post(authController.isAuthenticated, authController.checkTFA, transferController.create);

router.route('/transfer')
  .post(authController.isAuthenticated, authController.checkTFA, transferController.claim);

router.route('/email/:id')
  .get(authController.isAuthenticated, authController.checkTFA, emailController.get)
  .delete(authController.isAuthenticated, authController.checkTFA, emailController.delete);

router.route('/email/:id/attachment/:attachmentID')
  .get(authController.isAuthenticated, authController.checkTFA, emailController.getAttachment);

/*
* router.route('/client')
*   .post(authController.isAuthenticated, clientController.postClients)
*   .delete(authController.isAuthenticated, clientController.deleteClients)
*   .get(authController.isAuthenticated, clientController.getClients);
*
* router.route('/oauth2/authorize')
*   .get(authController.isAuthenticated, oauth2Controller.authorization)
*   .post(authController.isAuthenticated, oauth2Controller.decision);
*
* router.route('/oauth2/token')
*   .post(authController.isClientAuthenticated, oauth2Controller.token);
*/

module.exports = router;
