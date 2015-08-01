exports.getSecret = function(req, res) {
    res.json({secret: 'This is a secret'});
};