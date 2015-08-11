// ------------------------------------------------------------------------------------------
// Errors.
// ------------------------------------------------------------------------------------------
/**
 * @apiDefine PermissionError
 * @apiVersion 0.1.0
 *
 * @apiError EPERMS The permission level of the user is not high enough.
 * @apiError Unauthorized The user is not authorized.
 *
 * @apiErrorExample {json} EPERMS:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "error": {
 *         "name": "EPERM",
 *         "message": "Permission denied."
 *       }
 *     }
 *
 * @apiErrorExample {json} Unauthorized:
 *     HTTP/1.1 401 Unauthorized
 *     Unauthorized
 */


// ------------------------------------------------------------------------------------------
// Permissions.
// ------------------------------------------------------------------------------------------
/**
 * @apiDefinePermission Admin Admin access rights needed.
 * Admin is the highest rank available, should only be given to very trusty people.
 *
 * @apiVersion 0.1.0
 */

/**
 * @apiDefinePermission Mod Moderator access rights needed.
 * Mod is the middle rank, and should be given to the ones who have to manage the system in daily live.
 *
 * @apiVersion 0.1.0
 */

/**
 * @apiDefinePermission User User access rights needed.
 * User is the lowest rank, and is given standard to every user. These are the people who are actually using the system.
 *
 * @apiVersion 0.1.0
 */
