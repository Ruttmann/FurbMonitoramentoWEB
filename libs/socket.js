module.exports = function(io) {
    var arduino = io.of('/arduino');
    var admin = io.of('/admin');

    arduino.on('connection', function(socket) {
        console.log('Arduino connected!');

        socket.on('atime', function (data) {
            io.sockets.emit('atime', { time: new Date().toJSON() });
            console.log(data);
          });
    });

    admin.on('connection', function(socket) {
        /*
        * socket.emit => emite apenas ao socket específico
        * socket.nsp.emit => emite para todos os sockets do namespace
        */
        console.log('Admin connected!');
        socket.emit('sayhi', { msg: 'Hi webclient!'});
        socket.emit('id', {msg: "Unique id: "+socket.id});
    });
}