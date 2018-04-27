(function() {
    var socket = io('/admin');
    socket.on('sayhi', function(msg) {
        console.log(msg);
    });

    socket.on('newSignal', function(msg) {
        console.log(msg);
    });
})()