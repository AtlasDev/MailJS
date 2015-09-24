/**
 * @api {get} /domain Get domains
 * @apiVersion 0.1.0
 * @apiName GetDomains
 * @apiGroup domain
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
