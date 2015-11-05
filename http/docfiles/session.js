/**
 * @api {get} /user/session Get active sessions
 * @apiVersion 0.1.0
 * @apiName GetSession
 * @apiGroup Sessions
 *
 * @apiDescription Get all active session of the current logged in user.
 *
 * @apiSuccess {Array} session A list of sessions.
 * @apiSuccessExample {json} Created response:
 *     HTTP/1.1 200 OK
 *     {
 *       "session": [
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
 * @apiUse AuthError
 * @apiUse UserAuthHeader
 * @apiUse OAuthHeader
 */

 /**
  * @api {delete} /user/session/:sid Destroy session
  * @apiVersion 0.1.0
  * @apiName DeleteSession
  * @apiGroup Sessions
  *
  * @apiDescription Destroy a session with the specified id, the session must be yours.
  *
  * @apiParam {MongoID} sid ID of the session (NOT the token).
  * @apiParamExample {URI} Delete a session:
  *     /user/session/55e40dc8cf8dbadb0c352305
  *
  * @apiSuccess {String} message Simple success message.
  * @apiSuccessExample {json} Created response:
  *     HTTP/1.1 200 OK
  *     {
  *       {
  *         "message": "Session deleted."
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
  * @apiUse AuthError
  * @apiUse UserAuthHeader
  * @apiUse OAuthHeader
  */
