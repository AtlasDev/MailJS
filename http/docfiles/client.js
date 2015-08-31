/**
 * @api {get} /clients Get own clients.
 * @apiVersion 0.1.0
 * @apiName GetOwnClients
 * @apiGroup Clients
 *
 * @apiDescription Get all clients which the authenticated user owns.
 *
 * @apiSuccess {Array} clients A list of client objects.
 * @apiSuccessExample {json} Created response:
 *     HTTP/1.1 200 OK
 *     {
 *       "clients": [
 *         {
 *           ...
 *         },
 *         {
 *           ...
 *         }
 *       ]
 *     }
 *
 * @apiUse AuthError
 */
