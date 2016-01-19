var express = require('express');

var router = express.Router();
var sys = require('../../sys/main.js');
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
var invitationController = require('./controllers/invitation.js');
var emailController = require('./controllers/email.js');

router.route('/login')
  .post(authController.isUserAuthenticated, sys.perms.checkOauth, loginController.postLogin)
  .delete(authController.isSessionAuthenticated, sys.perms.checkOauth , loginController.deleteLogin)
  .patch(authController.isSessionAuthenticated, sys.perms.checkOauth, loginController.patchLogin);

router.route('/user')
  .post(authController.isAuthenticated, sys.perms.checkOauth, authController.checkTFA, userController.postUser)
  .get(authController.isAuthenticated, sys.perms.checkOauth, authController.checkTFA, userController.getUsers);

router.route('/2fa')
  .get(authController.isSessionAuthenticated, sys.perms.checkOauth, authController.checkTFA, tfaController.getTFA)
  .delete(authController.isSessionAuthenticated, sys.perms.checkOauth, authController.checkTFA, tfaController.deleteTFA)
  .post(authController.isSessionAuthenticated, sys.perms.checkOauth, authController.checkTFA, tfaController.postTFA);

router.route('/user/current')
  .get(authController.isAuthenticated, sys.perms.checkOauth, authController.checkTFA, userController.currentUser);

router.route('/user/session')
  .get(authController.isAuthenticated, sys.perms.checkOauth, authController.checkTFA, sessionController.getSessions);

router.route('/user/:user')
  .get(authController.isAuthenticated, sys.perms.checkOauth, authController.checkTFA, userController.getUser);

router.route('/mailbox')
  .post(authController.isAuthenticated, sys.perms.checkOauth, authController.checkTFA, mailboxController.postMailbox)
  .get(authController.isAuthenticated, sys.perms.checkOauth, authController.checkTFA, mailboxController.getMailboxes);

router.route('/mailbox/:mailbox')
  .get(authController.isAuthenticated, sys.perms.checkOauth, authController.checkTFA, mailboxController.getMailbox);

router.route('/inbox')
  .post(authController.isAuthenticated, sys.perms.checkOauth, authController.checkTFA, inboxController.postInbox);

router.route('/inbox/:inbox')
  .get(authController.isAuthenticated, sys.perms.checkOauth, authController.checkTFA, inboxController.getInbox);

router.route('/inbox/:inbox/:skip')
  .get(authController.isAuthenticated, sys.perms.checkOauth, authController.checkTFA, inboxController.getInbox);

router.route('/inbox/:inbox/:skip/:limit')
  .get(authController.isAuthenticated, sys.perms.checkOauth, authController.checkTFA, inboxController.getInbox);

router.route('/domain')
  .post(authController.isAuthenticated, sys.perms.checkOauth, authController.checkTFA, domainController.postDomain)
  .get(authController.isAuthenticated, sys.perms.checkOauth, authController.checkTFA, domainController.getDomains);

router.route('/client')
  .post(authController.isSessionAuthenticated, sys.perms.checkOauth, authController.checkTFA, clientController.postClient)
  .get(authController.isAuthenticated, sys.perms.checkOauth, authController.checkTFA, clientController.getOwnClients);

router.route('/transfer/:type/:id')
  .get(authController.isAuthenticated, sys.perms.checkOauth, authController.checkTFA, transferController.find)
  .post(authController.isAuthenticated, sys.perms.checkOauth, authController.checkTFA, transferController.create);

router.route('/invitation')
  .post(authController.isAuthenticated, authController.checkTFA, invitationController.create);

router.route('/transfer')
  .post(authController.isAuthenticated, authController.checkTFA, transferController.claim);
  .post(authController.isAuthenticated, sys.perms.checkOauth, authController.checkTFA, transferController.claim);

router.route('/oauth2/authorize')
  .get(authController.isAuthenticated, sys.perms.checkOauth, oauth2Controller.authorization)
  .post(authController.isAuthenticated, sys.perms.checkOauth, oauth2Controller.decision);

router.route('/oauth2/token')
  .post(authController.isClientAuthenticated, sys.perms.checkOauth, oauth2Controller.token);

router.route('/email/:id')
  .get(authController.isAuthenticated, authController.checkTFA, emailController.get)
  .delete(authController.isAuthenticated, authController.checkTFA, emailController.delete);

router.route('/email/:id/attachment/:attachmentID')
  .get(authController.isAuthenticated, authController.checkTFA, emailController.getAttachment);

module.exports = router;
