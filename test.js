var express = require('express');
var letiny = require('letiny');
var app = express();
app.use('/', express.static('pub'));

letiny.getCert({
    email:'info@atlasdev.nl',
    domains:['home.atlasdev.nl'],
    webroot:'./pub',
    agreeTerms:true
}, function(err, cert, key, caCert, accountKey) {
    console.log(err || cert+'\n+\n'+key+'\n+\n'+caCert);
});

app.listen(80);
