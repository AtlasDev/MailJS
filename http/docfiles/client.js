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
 *         "name": "mail",
 *         "__v": 0
 *       },
 *       {
 *         "_id": "55bcfe016aeb0af00ad0cfe4",
 *         "userId": "55bcfd439fc60f902808da36",
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
