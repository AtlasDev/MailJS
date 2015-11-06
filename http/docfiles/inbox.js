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
