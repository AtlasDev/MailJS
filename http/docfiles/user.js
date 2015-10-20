/**
 * @api {get} /user Get users
 * @apiVersion 0.1.0
 * @apiName GetUsers
 * @apiGroup User
 * @apiPermission user.list
 *
 * @apiDescription Get a list of users.
 *
 * @apiParam {Int} limitBy (optional) Limit the amount of users to give back. should be as low as possible.
 * @apiParam {Int} skip (optional) Skip an amount of users, usefull for pagination and such.
 * @apiParamExample {url} Create a new user:
 *     ?limitBy=20&skip=20
 *
 * @apiSuccess {Array} users A list of users.
 * @apiSuccessExample {json} Created response:
 *     HTTP/1.1 200 OK
 *     {
 *       "users": [
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
 * @apiError EINVALID LimitBy should be a number.
 * @apiErrorExample {json} EINVALID:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "name": "EINVALID",
 *         "message": "LimitBy should be a number."
 *       }
 *     }
 *
 * @apiError EINVALID Skip should be a number.
 * @apiErrorExample {json} EINVALID:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "name": "EINVALID",
 *         "message": "Skip should be a number."
 *       }
 *     }
 *
 * @apiUse AuthError
 * @apiUse PermissionError
 * @apiUse UserAuthHeader
 * @apiUse OAuthHeader
 */

/**
 * @api {post} /user Create user
 * @apiVersion 0.1.0
 * @apiName PostUser
 * @apiGroup User
 * @apiPermission user.create
 *
 * @apiDescription Create a new user with the specified data.
 *
 * @apiParam {String} username Desired username of the user.
 * @apiParam {String} password Desired password of the user.
 * @apiParam {String} firstName Firstname of the new user.
 * @apiParam {String} lastName Lastname of the new user.
 * @apiParamExample {json} Create a new user:
 *     {
 *       "username": "AtlasDev",
 *       "password": "supersecretpassword",
 *       "firstName": "Dany",
 *       "lastName": "Sluijk"
 *     }
 *
 * @apiSuccess {Object} user The new user.
 * @apiSuccessExample {json} Created response:
 *     HTTP/1.1 200 OK
 *     {
 *       {
 *         "message": "User added!",
 *         "data": {
 *           "__v": 0,
 *           "username": "AtlasDev",
 *           "group": "55e40dc8cf8dbadb0c352304",
 *           "firstName": "Dany",
 *           "lastName": "Sluijk",
 *           "_id": "55e415b46e0c093119a0748c",
 *           "mailboxes": []
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
 * @apiUse ValidationError
 * @apiUse PermissionError
 * @apiUse AuthError
 * @apiUse UserAuthHeader
 * @apiUse OAuthHeader
 */

/**
 * @api {get} /user/:user Get a specific user
 * @apiVersion 0.1.0
 * @apiName GetUser
 * @apiGroup User
 * @apiPermission user.list
 *
 * @apiDescription Get a specific user by ID or username.
 *
 * @apiParam {String} getBy whenether you get a user by ID or username. Throws error if specified but not `username` or `ID`. default to `ID`.
 * @apiParam {String} user The ID or username to search by.
 * @apiParamExample {url} Find a user by username:
 *     ?getBy=AtlasDev
 *
 * @apiSuccess {Object} user The user found.
 * @apiSuccessExample {json} Created response:
 *     HTTP/1.1 200 OK
 *     {
 *       {
 *         "user": {
 *           "__v": 0,
 *           "username": "AtlasDev",
 *           "group": "55e40dc8cf8dbadb0c352304",
 *           "firstName": "Dany",
 *           "lastName": "Sluijk",
 *           "_id": "55e415b46e0c093119a0748c",
 *           "mailboxes": []
 *         }
 *       }
 *     }
 *
 * @apiError EINVALID Invalid getBy parameter.
 * @apiErrorExample {json} EINVALID:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "name": "EINVALID",
 *         "message": "Invalid getBy parameter."
 *       }
 *     }
 *
 * @apiError ENOTFOUND Could not find user.
 * @apiErrorExample {json} EINVALID:
 *     HTTP/1.1 404 Not found
 *     {
 *       "error": {
 *         "name": "EINVALID",
 *         "message": "Could not find user."
 *       }
 *     }
 *
 * @apiError EINVALID Invalid user ID.
 * @apiErrorExample {json} EINVALID:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "name": "EINVALID",
 *         "message": "Invalid user ID"
 *       }
 *     }
 *
 * @apiUse AuthError
 * @apiUse PermissionError
 * @apiUse UserAuthHeader
 * @apiUse OAuthHeader
 */

/**
 * @api {get} /user/current Get current user
 * @apiVersion 0.1.0
 * @apiName GetCurrentUser
 * @apiGroup User
 *
 * @apiDescription Get the user current logged in with the session key.
 *
 * @apiSuccess {Object} user The user found.
 * @apiSuccessExample {json} Created response:
 *     HTTP/1.1 200 OK
 *     {
 *       {
 *         "user": {
 *           "__v": 0,
 *           "username": "AtlasDev",
 *           "group": "55e40dc8cf8dbadb0c352304",
 *           "firstName": "Dany",
 *           "lastName": "Sluijk",
 *           "_id": "55e415b46e0c093119a0748c",
 *           "mailboxes": []
 *         }
 *       }
 *     }
 *
 * @apiUse AuthError
 * @apiUse UserAuthHeader
 * @apiUse OAuthHeader
 */
