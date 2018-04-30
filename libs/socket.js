module.exports = function(io) {
    var arduino = io.of('/arduino');
    var admin = io.of('/admin');

    var dado;

    arduino.on('connection', function(socket) {
        var clientID;
        var cnt = 1;

        console.log('Arduino connected!');

        socket.on('connection', function(data) {
            clientID = data.id;
            console.log(data);
        });

        socket.on('sigSend', function(data) {
            if (data.msg == 'start') {
                console.log("VOU RECEBER DADOS!");
            }
            
            if (data.msg == 'end') {
                console.log("ACABARAM-SE OS DADOS!");
            }
        });

        socket.on('arrayPart', function(data) {
            console.log(data+" --- "+cnt);
            cnt++;
            console.log('/////////////');
        });

    });

    admin.on('connection', function(socket) {
        /*
        * socket.emit => emite apenas ao socket específico
        * socket.nsp.emit => emite para todos os sockets do namespace
        */
        console.log('Admin connected!');

        //socket.emit('sayhi', { msg: 'Hi webclient!'});
    });
}