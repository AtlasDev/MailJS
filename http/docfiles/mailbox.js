/**
 * @api {get} /mailbox Get mailboxes meta
 * @apiVersion 0.1.0
 * @apiName GetMailboxes
 * @apiGroup Mailbox
 *
 * @apiDescription Get the mailboxes the user has access to.
 *
 * @apiSuccess {Array} mailboxes A list of mailboxes.
 * @apiSuccessExample {json} Created response:
 *     HTTP/1.1 200 OK
 *     {
 *       "mailboxes": [
 *         {
 *           "_id": "55e40dc8cf8dbadb0c352305",
 *           "username": "admin",
 *           "group": "55e40dc8cf8dbadb0c352302",
 *           "firstName": "Admin",
 *           "lastName": "Adminius",
 *           "__v": 0,
 *           "mailboxes": [
 *             "55e40dc8cf8dbadb0c352307"
 *           ]
 *         },
 *         {
 *           ....
 *         }
 *       ]
 *     }
 *
 * @apiError ENOTFOUND User has no mailboxes.
 * @apiErrorExample {json} EINVALID:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "name": "ENOTFOUND",
 *         "message": "User has no mailboxes."
 *       }
 *     }
 *
 * @apiUse AuthError
 * @apiUse UserAuthHeader
 * @apiUse OAuthHeader
 */
