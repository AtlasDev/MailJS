/**
 * @api {get} /2fa Generate key
 * @apiVersion 0.1.0
 * @apiName Get2FA
 * @apiGroup 2FA
 *
 * @apiDescription Get a key to enable 2FA with. You should generate a QR code with the URI and/or display the key to the user for manual input. The key is secret, and the 2FA layer is useless if it leaks. You need to send the post request described underneat to actually activate 2FA.
 *
 * @apiSuccess {String} key The key to display to the user.
 * @apiSuccess {String} uri The URI to be put as a value into the QR code.
 * @apiSuccessExample {json} Created response:
 *     HTTP/1.1 200 OK
 *     {
 *       "key": "KY7TSZRWFZBXCMJGHRED6PDOPBS",
 *       "uri": "otpauth://totp/MailJS?secret=KY7TSZRWFZBXCMJGHRED6PDOPBS"
 *     }
 *
 * @apiError EINVALID 2FA already enabled.
 * @apiErrorExample {json} EINVALID:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "name": "EINVALID",
 *         "message": "2FA already enabled."
 *       }
 *     }
 *
 * @apiUse AuthError
 * @apiUse UserAuthHeader
 */

/**
 * @api {post} /2fa Enable 2FA
 * @apiVersion 0.1.0
 * @apiName Enable2FA
 * @apiGroup 2FA
 *
 * @apiDescription Enable 2FA by sending a valid TOTP value. This will destroy ALL active sessions from the user (including the current), but not the OAuth tokens.
 *
 * @apiParam {Int} code A valid TOTP value with the key send with the last key request.
 * @apiParamExample {json} Valid TOTP value:
 *     {
 *       "code": "3294815"
 *     }
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccessExample {json} Created response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "2FA has been enabled."
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
 * @apiError EINVALID TOTP value missing.
 * @apiErrorExample {json} EINVALID:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "name": "EINVALID",
 *         "message": "TOTP value missing."
 *       }
 *     }
 *
 * @apiUse AuthError
 * @apiUse UserAuthHeader
 */

/**
 * @api {delete} /2fa Remove 2FA
 * @apiVersion 0.1.0
 * @apiName Disable2FA
 * @apiGroup 2FA
 *
 * @apiDescription Remove Two Factor Authentication on the user account.
 *
 * @apiParam {Int} code One last time the TOTP value, to validate the disable request.
 * @apiParamExample {json} Valid TOTP value:
 *     {
 *       "code": "3294815"
 *     }
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccessExample {json} Created response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "2FA disabled."
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
 * @apiError EINVALID TOTP value missing.
 * @apiErrorExample {json} EINVALID:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "name": "EINVALID",
 *         "message": "TOTP value missing."
 *       }
 *     }
 *
 * @apiUse AuthError
 * @apiUse UserAuthHeader
 */
