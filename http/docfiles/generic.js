// ------------------------------------------------------------------------------------------
// Errors.
// ------------------------------------------------------------------------------------------
/**
 * @apiDefine PermissionError
 * @apiVersion 0.1.0
 *
 * @apiError EPERMS The permission level of the user is not high enough.
 *
 * @apiErrorExample {json} EPERMS:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "error": {
 *         "name": "EPERM",
 *         "message": "Permission denied."
 *       }
 *     }
 */

 /**
  * @apiDefine AuthError
  * @apiVersion 0.1.0
  *
  * @apiError Unauthorized The user is not authorized.
  *
  * @apiErrorExample {json} Unauthorized:
  *     HTTP/1.1 401 Unauthorized
  *     Unauthorized
  */
