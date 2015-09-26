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

/**
 * @api {post} /mailbox Create mailbox
 * @apiVersion 0.1.0
 * @apiName PostMailbox
 * @apiGroup Mailbox
 * @apiPermission mailbox.create
 *
 * @apiDescription Create a new mailbox with the specified data.
 *
 * @apiParam {String} local Local part of the address, like `myname` for myname@example.com (domain is example.com)
 * @apiParam {String} domain Domain ID of the domain of the to be created domain.
 * @apiParam {Boolean} transferable (Optional) If the mailbox is transferable with a token (default to false).
 * @apiParamExample {json} Create a new user:
 *     {
 *       "local": "myname",
 *       "domain": "55e40dc8cf8dbadb0c352302",
 *       "transferable": "true"
 *     }
 *
 * @apiSuccess {Object} user The new mailbox.
 * @apiSuccessExample {json} Created response:
 *     HTTP/1.1 200 OK
 *     {
 *       {
 *         "mailbox": {
 *           "__v": 0,
 *           "transferCode": "hqYqUPs9ce",
 *           "domain": "5606e7f49ba75d600a11bc5b",
 *           "address": "myname@example.com",
 *           "_id": "5606e83d33753cc40c80f8d8",
 *           "transferable": false,
 *           "admins": [
 *             "5606e7f49ba75d600a11bc5a"
 *           ]
 *         }
 *       }
 *     }
 *
 * @apiError EINVALID Request data is missing.
 * @apiErrorExample {json} EINVALID:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "name": "EINVALID",
 *         "message": "Request data is missing."
 *       }
 *     }
 *
 * @apiError EINVALID Transferable data is invalid
 * @apiErrorExample {json} EINVALID:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "name": "EINVALID",
 *         "message": "Transferable data is invalid."
 *       }
 *     }
 *
 *
 * @apiUse PermissionError
 * @apiUse AuthError
 * @apiUse UserAuthHeader
 * @apiUse OAuthHeader
 */
