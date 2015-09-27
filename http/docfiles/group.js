/**
 * @api {get} /group Get all groups
 * @apiVersion 0.1.0
 * @apiName GetGroups
 * @apiGroup Group
 * @apiPermission group.list
 *
 * @apiDescription Get all groups available
 *
 * @apiSuccess {Array} groups A list of group objects available.
 * @apiSuccessExample {json} Created response:
 *     HTTP/1.1 200 OK
 *     {
 *       "groups": [
 *         {
 *           "_id": "55e17a65989d3fcc096c3efb",
 *           "type": "Administrators",
 *           "name": "Administrators",
 *           "__v": 0,
 *           "permissions": [
 *             "user.list",
 *             "user.create",
 *             "user.delete",
 *             "user.protected",
 *             "user.overwrite",
 *             "user.group.change",
 *             "client.create",
 *             "client.list",
 *             "client.delete",
 *             "mailbox.create",
 *             "domain.create"
 *           ]
 *         },
 *         {
 *           ....
 *         }
 *       ]
 *     }
 *
 * @apiUse PermissionError
 * @apiUse AuthError
 * @apiUse UserAuthHeader
 * @apiUse OAuthHeader
 */

/**
 * @api {get} /group/:groupid Get a specific group
 * @apiVersion 0.1.0
 * @apiName GetGroup
 * @apiGroup Group
 *
 * @apiDescription Get a specific group by group id.
 *
 * @apiParam {String} groupid ID of the group to get.
 *
 * @apiSuccess {Object} group The group requested
 * @apiSuccessExample {json} Created response:
 *     HTTP/1.1 200 OK
 *     {
 *       "group": {
 *         "_id": "55e17a65989d3fcc096c3efb",
 *         "type": "Administrators",
 *         "name": "Administrators",
 *         "__v": 0,
 *         "permissions": [
 *           "user.list",
 *           "user.create",
 *           "user.delete",
 *           "user.protected",
 *           "user.overwrite",
 *           "user.group.change",
 *           "client.create",
 *           "client.list",
 *           "client.delete",
 *           "mailbox.create",
 *           "domain.create"
 *         ]
 *       }
 *     }
 *
 * @apiError EINVALID The given group ID is not in the correct format.
 * @apiErrorExample {json} EINVALID:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "name": "EINVALID",
 *         "message": "Invalid group ID!"
 *       }
 *     }
 *
 * @apiError ENOTFOUND The given group was not found.
 * @apiErrorExample {json} ENOTFOUND:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "name": "ENOTFOUND",
 *         "message": "Group not found."
 *       }
 *     }
 *
 * @apiUse AuthError
 * @apiUse UserAuthHeader
 * @apiUse OAuthHeader
 */
