/**
 * @api {get} /mailbox Get mailboxes of a user
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
 * @apiParamExample {json} Create a new mailbox:
 *     {
 *       "local": "myname",
 *       "domain": "55e40dc8cf8dbadb0c352302"
 *     }
 *
 * @apiSuccess {Object} mailbox The new mailbox.
 * @apiSuccessExample {json} Created response:
 *     HTTP/1.1 200 OK
 *     {
 *       {
 *         "mailbox": {
 *           "__v": 0,
 *           "domain": "5606e7f49ba75d600a11bc5b",
 *           "address": "myname@example.com",
 *           "_id": "5606e83d33753cc40c80f8d8",
 *           "admins": [
 *             "5606e7f49ba75d600a11bc5a"
 *           ],
 *           "owner": "5606e7f49ba75d600a11bc5a"
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
 * @apiError EDISABLED Specified domain has been disabled for registrations.
 * @apiErrorExample {json} EDISABLED:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "name": "EDISABLED",
 *         "message": "Specified domain has been disabled for registrations."
 *       }
 *     }
 *
 * @apiError EOCCUPIED Address already registered
 * @apiErrorExample {json} EOCCUPIED:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "name": "EOCCUPIED",
 *         "message": "Address already registered."
 *       }
 *     }
 *
 * @apiUse PermissionError
 * @apiUse AuthError
 * @apiUse UserAuthHeader
 * @apiUse OAuthHeader
 */

/**
 * @api {get} /mailbox/:mailbox Get a specific mailbox
 * @apiVersion 0.1.0
 * @apiName GetMailbox
 * @apiGroup Mailbox
 * @apiPermission mailbox.view
 *
 * @apiDescription Get information about a mailbox. Permissions only needed when mailbox is not owned.
 *
 * @apiParam {String} mailbox The mailbox ID to find the information about.
 * @apiParamExample {url} Find a user by username:
 *     .../mailbox/5606e7f49ba75d600a11bc5b
 *
 * @apiSuccess {Object} mailbox The mailbox information.
 * @apiSuccessExample {json} Created response:
 *     HTTP/1.1 200 OK
 *     {
 *       {
 *         "mailbox": {
 *           "__v": 0,
 *           "domain": "5606e7f49ba75d600a11bc5b",
 *           "address": "myname@example.com",
 *           "_id": "5606e83d33753cc40c80f8d8",
 *           "admins": [
 *             "5606e7f49ba75d600a11bc5a"
 *           ],
 *           "owner": "5606e7f49ba75d600a11bc5a"
 *         }
 *       }
 *     }
 *
 * @apiError EINVALID Invalid mailbox ID.
 * @apiErrorExample {json} EINVALID:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "name": "EINVALID",
 *         "message": "Invalid mailbox ID."
 *       }
 *     }
 *
 * @apiError ENOTFOUND Could not find mailbox.
 * @apiErrorExample {json} EINVALID:
 *     HTTP/1.1 404 Not found
 *     {
 *       "error": {
 *         "name": "EINVALID",
 *         "message": "Could not find mailbox."
 *       }
 *     }
 *
 * @apiUse AuthError
 * @apiUse PermissionError
 * @apiUse UserAuthHeader
 * @apiUse OAuthHeader
 */
