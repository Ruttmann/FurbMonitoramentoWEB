
module.exports = function(io) {
    //namespaces
    var arduino = io.of('/arduino');
    var admin = io.of('/admin');

    //model do banco de dados
    var Arduino = require('../model/arduino')();

    arduino.on('connection', function(socket) {
        var clientID;
        var cnt = 1;
        var arduinoBanco = new Arduino;

        console.log('Arduino connected!');

        socket.on('connection', function(data) {
            clientID = data.id;
            console.log(data);
        });

        socket.on('sigSend', function(data) {
            if (data.msg == 'start') {
                console.log("VOU RECEBER DADOS!");

                arduinoBanco.id = "S403";
                arduinoBanco.description = "Descrição de teste!";
            }
            
            if (data.msg == 'end') {
                console.log("ACABARAM-SE OS DADOS!");

                arduinoBanco.save(function(err, arduinoBanco) {
                    if (err) return console.error(err);
                    console.log("Çalvou!");
                });
            }
        });

        socket.on('arrayPart', function(data) {
            arduinoBanco.signals.push(data);
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