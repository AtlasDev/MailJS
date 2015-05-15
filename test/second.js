var sec = function sec(sys) {
    sys.on("event", function() {
        console.log('SECOND EVENT!');
    });
}

module.exports = sec;