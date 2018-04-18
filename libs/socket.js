module.exports = function(io) {
    var nsp1 = io.of('/');
    var nsp2 = io.of('/admin');

    nsp1.on('connection', function(socket) {
        console.log('Arduino connected!');

        socket.on('atime', function (data) {
            io.sockets.emit('atime', { time: new Date().toJSON() });
            console.log(data);
          });
    });

    nsp2.on('connection', function(socket) {
        console.log('Admin connected!');
        socket.emit('sayhi', { msg: 'Hi webclient!'})
        //io.sockets.emit('sayhi', { greeting: 'Hi!'});
    });
}