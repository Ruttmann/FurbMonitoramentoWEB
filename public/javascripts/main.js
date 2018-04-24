(function() {
    var socket = io('/admin');
    socket.on('sayhi', function(msg) {
        console.log(msg);
    });
    socket.on('id', function(msg) {
        console.log(msg);
    });
    socket.on('broad', function(msg) {
        console.log(msg);
    })
})()