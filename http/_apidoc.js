// ------------------------------------------------------------------------------------------
// Errors.
// ------------------------------------------------------------------------------------------
/**
 * @apiDefine PermissionError
 * @apiVersion 0.1.0
 *
 * @apiError EPERMS The permission level of the user is not high enough.
 * @apiError Unauthorized The user is not authorized.
 *
 * @apiErrorExample {json} EPERMS:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "error": {
 *         "name": "EPERM",
 *         "message": "Permission denied."
 *       }
 *     }
 *
 * @apiErrorExample {json} Unauthorized:
 *     HTTP/1.1 401 Unauthorized
 *     Unauthorized
 */


// ------------------------------------------------------------------------------------------
// Permissions.
// ------------------------------------------------------------------------------------------
/**
 * @apiDefinePermission admin Admin access rights needed.
 * Admin is the highest rank available, should only be given to very trusty people.
 *
 * @apiVersion 0.1.0
 */

/**
 * @apiDefinePermission mod Moderator access rights needed.
 * Mod is the middle rank, and should be given to the ones who have to manage the system in daily live.
 *
 * @apiVersion 0.1.0
 */

/**
 * @apiDefinePermission user User access rights needed.
 * User is the lowest rank, and is given standard to every user. These are the people who are actually using the system.
 *
 * @apiVersion 0.1.0
 */

// ------------------------------------------------------------------------------------------
// Methods.
// ------------------------------------------------------------------------------------------

//User

/**
 * @api {get} /user Get all users
 * @apiVersion 0.1.0
 * @apiName GetUsers
 * @apiGroup User
 * @apiPermission Mod
 *
 * @apiDescription Gives back a list of users registered with there properties.
 *
 * @apiSuccess {Array} users All user objects registered.
 * @apiSuccessExample {json} Get all users:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "_id": "55bcf88eaa9f7e8c217ee376",
 *         "username": "admin",
 *         "mailboxes": [],
 *         "group": 3
 *       },
 *       {
 *         "_id": "55bcf8a904edc314212c857d",
 *         "username": "AtlasDev",
 *         "mailboxes": [],
 *         "group": 1
 *       }
 *     ]
 *
 * @apiUse PermissionError
 */

/**
 * @api {post} /user Create a new User
 * @apiVersion 0.1.0
 * @apiName CreateUser
 * @apiGroup User
 * @apiPermission Mod
 *
 * @apiDescription Create a new user.
 *
 * @apiParam {String} username Desired username of the user.
 * @apiParam {String} password Desired password of the user.
 * @apiParamExample {json} Create a new user:
 *     {
 *       "username": "AtlasDev",
 *       "password": "supersecretpassword"
 *     }
 *
 * @apiSuccess {String} _id The id of the user.
 * @apiSuccess {String} username The username of the user.
 * @apiSuccess {Array} mailboxes The mailboxes the user has access to.
 * @apiSuccess {Number} group The number of the users group (1=user 2=mod 3=admin)
 * @apiSuccessExample {json} Created response:
 *     HTTP/1.1 200 OK
 *     {
 *       "_id": "55bcf8a904edc314212c857d",
 *       "username": "AtlasDev",
 *       "mailboxes": [],
 *       "group": 1
 *     }
 *
 * @apiError EINVALID Username/Password is not valid.
 * @apiErrorExample {json} EINVALID:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "name": "EINVALID",
 *         "message": "Username/Password is not valid."
 *       }
 *     }
 *
 * @apiUse PermissionError
 */

 /**
 * @api {delete} /user Delete a user
 * @apiVersion 0.1.0
 * @apiName DeleteUser
 * @apiGroup User
 * @apiPermission Mod
 *
 * @apiDescription Delete a user.
 *
 * @apiParam {String} id The id of the user to be deleted (found by a GET request, it's the _id property).
 * @apiParamExample {json} Successfull request:
 *     {
 *       "id": "55bcf8a904edc314212c857d"
 *     }
 *
 * @apiSuccess {String} message A message of success.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "User deleted."
 *     }
 *
 * @apiError EINVALID ID was not given.
 * @apiErrorExample {json} EINVALID:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "name": "EINVALID",
 *         "message": "No id given."
 *       }
 *     }
 *
 * @apiError ENOTFOUND given id was not found.
 * @apiErrorExample {json} ENOTFOUND:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "name": "ENOTFOUND",
 *         "message": "The given id was not found."
 *       }
 *     }
 *
 * @apiError EPERMITTED You cannot delete yourself.
 * @apiErrorExample {json} EPERMITTED:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "name": "EPERMITTED",
 *         "message": "You cannot delete yourself."
 *       }
 *     }
 *
 * @apiError EPERMITTED You cannot delete the first user.
 * @apiErrorExample {json} EPERMITTED:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "name": "EPERMITTED",
 *         "message": "You cannot delete the first user."
 *       }
 *     }
 *
 * @apiUse PermissionError
 */

 /**
 * @api {put} /user/group Update the group of a user
 * @apiVersion 0.1.0
 * @apiName UpdateUserGroup
 * @apiGroup User
 * @apiPermission Admin
 *
 * @apiDescription Update the group of a user.
 *
 * @apiParam {String} id The id of the user
 * @apiParam {Number} group The id of the new group (1=User 2=Mod 3=Admin)
 * @apiParamExample {json} Successfull request:
 *     {
 *       "id": "55bcf8a904edc314212c857d",
 *       "group": "2"
 *     }
 *
 * @apiSuccess {String} message A message of success.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "User group updated."
 *     }
 *
 * @apiError EINVALID ID or group was not given.
 * @apiErrorExample {json} EINVALID:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "name": "EINVALID",
 *         "message": "No id/group given."
 *       }
 *     }
 *
 * @apiError EINVALID Given group was invalid.
 * @apiErrorExample {json} EINVALID:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "name": "EINVALID",
 *         "message": "Group not valid"
 *       }
 *     }
 *
 * @apiError ENOTFOUND given id was not found.
 * @apiErrorExample {json} ENOTFOUND:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "name": "ENOTFOUND",
 *         "message": "The given id was not found."
 *       }
 *     }
 *
 * @apiError EPERMITTED You cannot change your own group.
 * @apiErrorExample {json} EPERMITTED:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "name": "EPERMITTED",
 *         "message": "You cannot change your own group."
 *       }
 *     }
 *
 * @apiError EPERMITTED You cannot change the group of the first user.
 * @apiErrorExample {json} EPERMITTED:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "name": "EPERMITTED",
 *         "message": "You cannot the group of the first user."
 *       }
 *     }
 *
 * @apiUse PermissionError
 */

 //Client

 /**
 * @api {get} /client Get all clients
 * @apiVersion 0.1.0
 * @apiName GetClients
 * @apiGroup Client
 * @apiPermission Mod
 *
 * @apiDescription Gives back a list of clients registered with there properties.
 *
 * @apiSuccess {Array} users All client objects registered.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "_id": "55bcfd686aeb0af00ad0cfe3",
 *         "userId": "55bcfd439fc60f902808da36",
 *         "secret": "$2a$05$mRs66hZOQnygrJfGBvKk8Oij.J67hFdJj7aMOnnyYzp/3HQv0Gm/e",
 *         "id": "$2a$05$kjRgAKvF/n00ZmaukIoFSe/r2ZYCcHMTmdutJJiNx67PINogxU4Im",
 *         "name": "mail",
 *         "__v": 0
 *       },
 *       {
 *         "_id": "55bcfe016aeb0af00ad0cfe4",
 *         "userId": "55bcfd439fc60f902808da36",
 *         "secret": "$2a$05$Sw6Ep1SLE7X881ZLjrOezOGg.U5QOnuzU/x6NWwxFSlHHZYqQK8Ji",
 *         "id": "$2a$05$dQca6PfE4eVS6vTvg/h0ZOZlEp5H6Qt7no8hqgAxUoy7wNS3Z6VVK",
 *         "name": "SpaceCP",
 *         "__v": 0
 *       }
 *     ]
 *
 * @apiUse PermissionError
 */

/**
 * @api {post} /client Create a new client
 * @apiVersion 0.1.0
 * @apiName CreateClient
 * @apiGroup Client
 * @apiPermission Admin
 *
 * @apiDescription Create a new client.
 *
 * @apiParam {String} name Name of the application the client is created for.
 * @apiParamExample {json} Create client:
 *     {
 *       "name": "SpaceCP"
 *     }
 *
 * @apiSuccess {String} Message A message of success.
 * @apiSuccess {Array} data The client object created.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Client added!",
 *       "data": {
 *         "__v": 0,
 *         "userId": "55bcfd439fc60f902808da36",
 *         "secret": "$2a$05$jjU7Tx7ssFGMs0Zp7TjVGOfG9kilWgUb8atQ7yikp2Mjl7w/nUX3O",
 *         "id": "$2a$05$aP6QNevEHPfQYDL1tNeYqOKHyTfkfOXXfwKvbKYzWa8mGXST3wXrO",
 *         "name": "MailTest",
 *         "_id": "55bcffbc6aeb0af00ad0cfe8"
 *       }
*      }
 *
 * @apiError EINVALID Username/Password is not valid.
 * @apiErrorExample {json} EINVALID:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "name": "EINVALID",
 *         "message": "name/id/secret not filled in."
 *       }
 *     }
 *
 * @apiUse PermissionError
 */

 /**
 * @api {delete} /client Delete a client
 * @apiVersion 0.1.0
 * @apiName DeleteClient
 * @apiGroup Client
 * @apiPermission Admin
 *
 * @apiDescription Delete a client.
 *
 * @apiParam {String} id The id of the client to be deleted. (found by a GET request, it's the _id property).
 * @apiParamExample {json} Successfull request:
 *     {
 *       "id": "55bcfe016aeb0af00ad0cfe4"
 *     }
 *
 * @apiSuccess {String} message A message of success.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Client deleted."
 *     }
 *
 * @apiError EINVALID ID was not given.
 * @apiErrorExample {json} EINVALID:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "name": "EINVALID",
 *         "message": "No id given."
 *       }
 *     }
 *
 * @apiError ENOTFOUND given id was not found.
 * @apiErrorExample {json} ENOTFOUND:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "name": "ENOTFOUND",
 *         "message": "The given id was not found."
 *       }
 *     }
 *
 * @apiUse PermissionError
 */
