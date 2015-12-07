/**
 * @api {post} /inbox Create inbox
 * @apiVersion 0.1.0
 * @apiName PostInbox
 * @apiGroup Inbox
 *
 * @apiDescription Create an inbox in the specified mailbox.
 *
 * @apiParam {MongodbID} mailbox ID of the mailbox to add the inbox to.
 * @apiParam {String} title Title of the new inbox.
 * @apiParamExample {json} Create a new user:
 *     {
 *       "mailbox": "55e415b46e0c093119a0748c",
 *       "title": "Inbox 6"
 *     }
 *
 * @apiSuccess {Object} inbox The new inbox.
 * @apiSuccessExample {json} Created response:
 *     HTTP/1.1 200 OK
 *     {
 *       "inbox": {
 *         "__v": 0,
 *         "username": "AtlasDev",
 *         "group": "55e40dc8cf8dbadb0c352304",
 *         "firstName": "Dany",
 *         "lastName": "Sluijk",
 *         "_id": "55e415b46e0c093119a0748c",
 *         "mailboxes": []
 *       }
 *     }
 *
 * @apiUse ValidationError
 * @apiUse AuthError
 * @apiUse UserAuthHeader
 * @apiUse OAuthHeader
 */

/**
 * @api {get} /inbox/{inbox}/{start}/{limitBy} Get emails
 * @apiVersion 0.1.0
 * @apiName GetInbox
 * @apiGroup Inbox
 *
 * @apiDescription Get emails in an inbox.
 *
 * @apiParam {String} inbox ID of the inbox to get the mails from.
 * @apiParam {Int} start Amount of mails to skip before returning. Default: 0
 * @apiParam {Int} limitBy Maximal amount of mails to return. Default: 20
 * @apiParamExample {json} Get the first 10 mails:
 *     {
 *       "inbox": "55e415b46e0c093119a0748c",
 *       "start": 0,
 *       "limitBy": 10
 *     }
 *
 * @apiSuccess {Object} emails The found emails
 * @apiSuccessExample {json} Created response:
 *     HTTP/1.1 200 OK
 *     {
 *       "emails": [
 *         {
 *           "__v": 0,
 *           "_id": "55e415b46e0c093119a0748c",
 *           "inbox": "55e40dc8cf8dbadb0c352304",
 *           "creationDate": "1449441116",
 *           "reportedDate": "1449441035",
 *           "sender": "dany@atlasdev.nl",
 *           "senderDisplay": "Dany Sluijk",
 *           "preview": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla consequat est vel tortor turpis duis.",
 *           "subject": "Hey, check this out!",
 *         },
 *         { ... }
 *       ]
 *     }
 *
 * @apiUse ValidationError
 * @apiUse AuthError
 * @apiUse UserAuthHeader
 * @apiUse OAuthHeader
 */
