/**
 * @api {post} /login Login
 * @apiVersion 0.1.0
 * @apiName LoginUser
 * @apiGroup Login
 *
 * @apiDescription Login on a user account, it returns a token which is valid for 24 hours.
 *
 * @apiParam {String} username Username of the user.
 * @apiParam {String} password Password which belongs to the username.
 * @apiParamExample {json} Login to a user:
 *     {
 *       "username": "AtlasDev",
 *       "password": "supersecretpassword"
 *     }
 *
 * @apiSuccess {String} token The id of the user.
 * @apiSuccess {Array} user User object of the user logged in.
 * @apiSuccessExample {json} Success response:
 *     HTTP/1.1 200 OK
 *     {
 *       "token": "0TXlLAtzDPSIwiWQ93VnFMB5UHkbCUTTv43JICXXSEmxtqhJTiPVPosZidvpxshh",
 *       "user": {
 *         "_id": "55e06be7650cf63410cdf8ad",
 *         "username": "admin",
 *         "group": "55e06be7650cf63410cdf8aa",
 *         "__v": 0,
 *         "mailboxes": [
 *           "55e06be7650cf63410cdf8af"
 *         ]
 *       }
 *     }
 *
 * @apiError Unauthorized The username/password is invalid.
 *
 * @apiErrorExample {json} Unauthorized:
 *     HTTP/1.1 401 Unauthorized
 *     Unauthorized
 */

 /**
  * @api {delete} /login Logout
  * @apiVersion 0.1.0
  * @apiName LogoutUser
  * @apiGroup Login
  *
  * @apiDescription Logout the current logged in user.
  *
  * @apiSuccess {String} message Simple success message.
  * @apiSuccessExample {json} Success response:
  *     HTTP/1.1 200 OK
  *     {
  *       "message": "Logout successfull."
  *     }
  *
  * @apiUse AuthError
  * @apiUse UserAuthHeader
  */
