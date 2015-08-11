/**
 * @api {post} /login Login
 * @apiVersion 0.1.0
 * @apiName LoginUser
 * @apiGroup Login
 *
 * @apiDescription Login on a user account, it returns a token which is good for 24 hours.
 *
 * @apiParam {String} username Username of the user.
 * @apiParam {String} password Password which belongs to the username
 * @apiParamExample {json} Login to a user:
 *     {
 *       "username": "AtlasDev",
 *       "password": "supersecretpassword"
 *     }
 *
 * @apiSuccess {String} _id The id of the user.
 * @apiSuccess {String} token The token to login with.
 * @apiSuccessExample {json} Created response:
 *     HTTP/1.1 200 OK
 *     {
 *       "_id": "55bcf8a904edc314212c857d",
 *       "token": "OXznHAmkzEGY9JSIGSWWD3cK6jlRgcSYAmRBZwDH",
 *     }
 *
 * @apiError EINVALID Username/Password is not valid.
 * @apiErrorExample {json} EINVALID:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "name": "EINVALID",
 *         "message": "Username/Password is not valid."
 *       }
 *     }
 */
