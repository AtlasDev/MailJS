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
 * @apiSuccess {String} token The auth token of the user, uses for futher auth.
 * @apiSuccess {Array} user User object of the user logged in.
 * @apiSuccess {Boolean} need2FA If the user needs to authenticate with 2FA after login
 * @apiSuccess {String} 2FAuri URI of the 2FA login, only exists if need2FA = true
 * @apiSuccessExample {json} Success response:
 *     HTTP/1.1 200 OK
 *     {
 *       "token": "0TXlLAtzDPSIwiWQ93VnFMB5UHkbCUTTv43JICXXSEmxtqhJTiPVPosZidvpxshh",
 *       "need2FA": "true",
 *       "2FAuri": "/api/v1/2fa/setup",
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

/**
 * @api {patch} /login 2FA Login
 * @apiVersion 0.1.0
 * @apiName 2faLoginUser
 * @apiGroup Login
 *
 * @apiDescription Log in to the user account if 2fa is needed. need to have a token already which still needs 2fa auth.
 *
 * @apiParam {String} code TOTP code got from the 2fa authenticator
 * @apiParamExample {json} Login to a user:
 *     {
 *       "code": "2194832"
 *     }
 *
 * @apiSuccess {String} token The auth token of the user, uses for futher auth.
 * @apiSuccessExample {json} Success response:
 *     HTTP/1.1 200 OK
 *     {
 *       "token": "0TXlLAtzDPSIwiWQ93VnFMB5UHkbCUTTv43JICXXSEmxtqhJTiPVPosZidvpxshh",
 *       "success": "true"
 *     }
 *
 * @apiError EINVALID TOTP value invalid.
 * @apiErrorExample {json} EINVALID:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "name": "EINVALID",
 *         "message": "TOTP value invalid."
 *       }
 *     }
 *
 * @apiError EDONE User already authenticated.
 * @apiErrorExample {json} EDONE:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "name": "EINVALID",
 *         "message": "User already authenticated."
 *       }
 *     }
 *
 * @apiUse AuthError
 */
