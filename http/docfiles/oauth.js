/**
 * @api {get} /oauth/authorize Request for authorization
 * @apiVersion 0.1.0
 * @apiName getAuthorize
 * @apiGroup oauth
 *
 * @apiDescription Request authorization from a client to the account of a user
 *
 * @apiParam {String} client_id The id of the client requesting access.
 * @apiParam {String} response_type Response type, should always be code.
 * @apiParam {String} redirect_uri Redirect uri where the code will be send to after the user has accepted the request.
 * @apiParamExample {url} authorize an client with the id `55bcf8a904edc314212c857d`:
 *     /api/oauth2/authorize?client_id=55bcf8a904edc314212c857d&response_type=code&redirect_uri=http://localhost
 *
 * @apiSuccess {html} html The dialoge page with the request for permissions
 */

/**
 * @api {POST} /oauth/token Exchange code
 * @apiVersion 0.1.0
 * @apiName postToken
 * @apiGroup oauth
 *
 * @apiDescription Exchange a code for a bearer access token.
 *
 * @apiParam {Sting} code The code gain from the callback (see /oauth/authorize).
 * @apiParam {String} response_type Response type, should always be code.
 * @apiParam {String} redirect_uri The redirect url which was used in GET /oauth/authorize, used as validation
 * @apiParamExample {json} Exchange a code for a token:
 *     {
 *       "code": "S7VlbvRQW1aIC5X5",
 *       "response_type": "code",
 *       "redirect_ur": "http://localhost"
 *     }
 *
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
 */
