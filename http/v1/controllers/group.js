var sys = require('../../../sys/main.js');

exports.getGroups = function (req, res) {
    sys.group.getGroups(function (err, groups) {
        if(err) {
            return res.json({error: {name: err.name, message: err.message} });
        }
        return res.json({groups: groups});
    })
}

exports.getGroup = function(req, res) {
    if(!req.params.group) {
        return res.status(400).json({error: {name: "EINVALID", message: 'No group ID given'}});
    }
    sys.group.getGroup(req.params.group, function(err, group) {
        if(err) {
            return res.json({error: {name: err.name, message: err.message}});
        }
        if(!group) {
            return res.json({error: {name: 'ENOTFOUND', message: 'Group not found.'}});
        }
        return res.json({group: group});
    })
}
