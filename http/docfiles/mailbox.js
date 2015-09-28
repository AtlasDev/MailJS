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
 * @apiParam {Boolean} transferable (Optional) If the mailbox is transferable with a token (default to false).
 * @apiParamExample {json} Create a new user:
 *     {
 *       "local": "myname",
 *       "domain": "55e40dc8cf8dbadb0c352302",
 *       "transferable": "true"
 *     }
 *
 * @apiSuccess {Object} mailbox The new mailbox.
 * @apiSuccessExample {json} Created response:
 *     HTTP/1.1 200 OK
 *     {
 *       {
 *         "mailbox": {
 *           "__v": 0,
 *           "transferCode": "hqYqUPs9ce",
 *           "smtpToken": "afr6UPs9ce",
 *           "domain": "5606e7f49ba75d600a11bc5b",
 *           "address": "myname@example.com",
 *           "_id": "5606e83d33753cc40c80f8d8",
 *           "transferable": false,
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
 *           "transferCode": "hqYqUPs9ce",
 *           "smtpToken": "afr6UPs9ce",
 *           "domain": "5606e7f49ba75d600a11bc5b",
 *           "address": "myname@example.com",
 *           "_id": "5606e83d33753cc40c80f8d8",
 *           "transferable": false,
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

/**
 * @api {patch} /mailbox Claim mailbox
 * @apiVersion 0.1.0
 * @apiName ClaimMailbox
 * @apiGroup Mailbox
 *
 * @apiDescription Claim an existing mailbox with an transfer code.
 *
 * @apiParam {String} transfercode Transfer code gain from an existing admin.
 * @apiParamExample {json} Claim mailbox:
 *     {
 *       "transfercode": "2fHq5afM"
 *     }
 *
 * @apiSuccess {Object} mailbox The claimed mailbox.
 * @apiSuccessExample {json} Created response:
 *     HTTP/1.1 200 OK
 *     {
 *       {
 *         "mailbox": {
 *           "__v": 0,
 *           "transferCode": "hqYqUPs9ce",
 *           "smtpToken": "afr6UPs9ce",
 *           "domain": "5606e7f49ba75d600a11bc5b",
 *           "address": "myname@example.com",
 *           "_id": "5606e83d33753cc40c80f8d8",
 *           "transferable": false,
 *           "admins": [
 *             "5606e7f49ba75d600a11bc5a"
 *           ],
 *           "owner": "5606e7f49ba75d600a11bc5a"
 *         }
 *       }
 *     }
 *
 * @apiError EMISSING Request data is missing.
 * @apiErrorExample {json} EMISSING:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "name": "EMISSING",
 *         "message": "Request data is missing."
 *       }
 *     }
 *
 * @apiError ENOTFOUND Mailbox not found
 * @apiErrorExample {json} EINVALID:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "name": "ENOTFOUND",
 *         "message": "Mailbox not found."
 *       }
 *     }
 *
 * @apiError EDENIED Mailbox not transferable
 * @apiErrorExample {json} EDENIED:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "name": "EDENIED",
 *         "message": "Mailbox not transferable."
 *       }
 *     }
 *
 * @apiError EOCCUPIED User already member of the mailbox
 * @apiErrorExample {json} EDENIED:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "name": "EOCCUPIED",
 *         "message": "User already member of the mailbox."
 *       }
 *     }
 *
 * @apiUse AuthError
 * @apiUse UserAuthHeader
 * @apiUse OAuthHeader
 */
