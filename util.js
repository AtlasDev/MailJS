exports.error = function error(msg, stack, quit) {
	console.log('\n');
	console.log('Error'.red + '    ' + msg);
	if(stack) {
		console.log('Error'.red + '    ' + stack.stack);
	}
	if(quit == true) {
		console.log('Error'.red + '    Error is severe, quitting...');
		process.exit(1);
        console.log('\n');
	}
	return true;
}

exports.log = function log(msg, startup) {
    if(startup == true) {
        console.log('Start'.green + '    ' + msg);
    } else {
        console.log('Log'.cyan + '      ' + msg);
    }
    return true;
}

exports.uid = function uid (len) {
    var buf = []
        , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        , charlen = chars.length;

    for (var i = 0; i < len; ++i) {
        buf.push(chars[getRandomInt(0, charlen - 1)]);
    }

    return buf.join('');
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}