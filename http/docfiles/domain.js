/**
 * @api {get} /domain Get domains
 * @apiVersion 0.1.0
 * @apiName GetDomains
 * @apiGroup Domain
 *
 * @apiDescription Get all domains openly avalible
 *
 * @apiSuccess {Array} domains A list of domains.
 * @apiSuccessExample {json} Created response:
 *     HTTP/1.1 200 OK
 *     {
 *       "domains": [
 *         {
 *           "_id": "55e40dc8cf8dbadb0c352305",
 *           "domain": "example.com",
 *           "disabled": "false",
 *           "__v": 0
 *         },
 *         {
 *           ....
 *         }
 *       ]
 *     }
 *
 * @apiUse AuthError
 * @apiUse UserAuthHeader
 * @apiUse OAuthHeader
 */

/**
 * @api {post} /domain Create domain
 * @apiVersion 0.1.0
 * @apiName PostDomain
 * @apiGroup Domain
 * @apiPermission domain.create
 *
 * @apiDescription Create a new domain.
 *
 * @apiParam {String} domain Domain to be registerd (e.g. `example.com`)
 * @apiParam {Boolean} disabled (optional) Disable the domain for registrations, default to false
 * @apiParamExample {json} Create a new disabled domain:
 *     {
 *       "domain": "mailjs.net",
 *       "disabled": "true"
 *     }
 * @apiParamExample {json} Create a new enabled domain:
 *     {
 *       "domain": "mailjs.net"
 *     }
 *
 * @apiSuccess {Object} user The new user.
 * @apiSuccessExample {json} Created response:
 *     HTTP/1.1 200 OK
 *     {
 *       {
 *         "domain": {
 *           "__v": 0,
 *           "domain": "mailjs.net",
 *           "disabled": "true",
 *           "_id": "55e415b46e0c093119a0748c",
 *         }
 *       }
 *     }
 *
 * @apiError EINVALID Domain missing
 * @apiErrorExample {json} EINVALID:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "name": "EINVALID",
 *         "message": "Domain missing."
 *       }
 *     }
 *
 * @apiError EINVALID Invalid disabled value
 * @apiErrorExample {json} EINVALID:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "name": "EINVALID",
 *         "message": "Invalid disabled value."
 *       }
 *     }
 *
 * @apiUse PermissionError
 * @apiUse AuthError
 * @apiUse UserAuthHeader
 * @apiUse OAuthHeader
 */
