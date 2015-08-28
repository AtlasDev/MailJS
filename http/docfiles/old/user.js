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
 * @apiError EINVALID Username/Password not filled in.
 * @apiErrorExample {json} EINVALID:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "name": "EINVALID",
 *         "message": "Username/Password not filled in."
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
