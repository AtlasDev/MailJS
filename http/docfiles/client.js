/**
 * @api {get} /clients Get own clients
 * @apiVersion 0.1.0
 * @apiName GetOwnClients
 * @apiGroup Clients
 *
 * @apiDescription Get all clients which the authenticated user owns.
 *
 * @apiSuccess {String} message Simple response message
 * @apiSuccess {Int} amount Amount of client received.
 * @apiSuccess {Array} clients A list of client objects.
 * @apiSuccessExample {json} Created response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Clients recieved.",
 *       "amount": "2",
 *       "clients": [
 *         {
 *           "_id": "55e430cbdec945f825ba6429",
 *           "userId": "55e40dc8cf8dbadb0c352305",
 *           "id": "hqa2j7W7YN",
 *           "url": "https://spacecp.net/img/rocket.png",
 *           "description": "Super awesome controll panel.",
 *           "name": "SpaceCP",
 *           "__v": 0,
 *           "scopes": [
 *             "mailbox.create",
 *             "user.list"
 *           ]
 *         },
 *         {
 *           ...
 *         }
 *       ]
 *     }
 *
 * @apiError EINVALID Invalid parameters.
 * @apiErrorExample {json} EINVALID:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "name": "EINVALID",
 *         "message": "Invalid parameters."
 *       }
 *     }
 *
 * @apiUse AuthError
 * @apiUse UserAuthHeader
 * @apiUse OAuthHeader
 */

/**
 * @api {post} /clients Create a new client
 * @apiVersion 0.1.0
 * @apiName CreateClient
 * @apiGroup Clients
 * @apiPermission client.create
 *
 * @apiDescription Create a new client with the specified data. In the response `secret` will be unencrypted.
 *   Save that somewhere secure! You need it later to exchange access tokens. You cannot recover the secret.
 *
 * @apiParam {String} name Desired username of the user.
 * @apiParam {String} description Description of the user.
 * @apiParam {String} url Image url of the logo of the client.
 * @apiParam {Array} scopes Scopes of the client, these are the same as permissions (https://github.com/AtlasDev/MailJS/wiki/Permissions).
 * @apiParamExample {json} Create a new client:
 *     {
 *       "name": "SpaceCP",
 *       "description": "Super awesome controll panel.",
 *       "url": "https://spacecp.net/img/rocket.png",
 *       "scopes": [
 *         "mailbox.create",
 *         "user.list"
 *       ]
 *     }
 *
 * @apiSuccess {String} message Simple success message
 * @apiSuccess {Array} client The created client.
 * @apiSuccessExample {json} Created response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Client added.";
 *       "client": {
 *         "__v": 0,
 *         "userId": "55e40dc8cf8dbadb0c352305",
 *         "secret": "0cFMaxMH5i",
 *         "id": "hqa2j7W7YN",
 *         "url": "https://spacecp.net/img/rocket.png",
 *         "description": "Super awesome controll panel.",
 *         "name": "SpaceCP",
 *         "_id": "55e430cbdec945f825ba6429",
 *         "scopes": [
 *           "mailbox.create",
 *           "user.list"
 *         ]
 *       }
 *     }
 *
 * @apiError EINVALID Invalid parameters.
 * @apiErrorExample {json} EINVALID:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "name": "EINVALID",
 *         "message": "Invalid parameters."
 *       }
 *     }
 *
 * @apiUse AuthError
 * @apiUse UserAuthHeader
 */
