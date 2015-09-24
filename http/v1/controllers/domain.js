var sys = require('../../../sys/main.js');

exports.getDomains = function (req, res) {
    console.log(sys.domain.getDomains(function (err, domains) {
        if(err) {
            return res.status(500).json({error: {name: err.name, message: err.message}});
        }
        return res.json({domains: domains});
    }));
}
