
module.exports = function(io) {
    //namespaces
    var arduino = io.of('/arduino');
    var admin = io.of('/admin');

    //model do banco de dados
    var Arduino = require('../model/arduino')();

    //Objeto de data para monitoramento
    let dateNow = new Date();

    arduino.on('connection', function(socket) {
        var clientID;
        var cnt = 1;
        var arduinoBanco = new Arduino;

        console.log('Arduino connected!');

        socket.on('identify', function(data) {
            clientID = data.id;
            console.log(`Arduino client '${clientID}' has connected.`);
        });

        socket.on('sigSend', function(data) {
            switch (data.msg) {
                case 'start':
                    console.log(`Receiving signals from Arduino client '${clientID}'`);
                    arduinoBanco.id = clientID;
                    arduinoBanco.description = 'New Arduino client';
                    break;
                case 'end':
                    console.log(`Signals reception for Arduino client '${clientID}' finished.`);
                    arduinoBanco.save(function(err, arduinoBanco) {
                        if (!err) console.log(`Signals for Arduino client '${clientID}' successfully stored.`);
                        else return console.error(err);
                    });
                    break;
                default:
                    break;
            }
        });

        socket.on('arrayPart', function(data) {
            arduinoBanco.signals.push(data);
            console.log(data+" --- "+cnt);
            cnt++;
            console.log('/////////////');
        });

        socket.on('monitoring', function(data) {
            switch (data.msg) {
                case 'isEmpty':
                    if (dateNow.getHours() >= 22)
                        socket.emit('monitoring', { msg: 'ok' });
                    else
                    socket.emit('monitoring', { msg: 'nok' });
                    break;
            
                default:
                    break;
            }
        });

        socket.on('list', function(data) {
            // Arduino.find(function(err, dados) {
            //     if (err) return console.error(err);
            //     dados[0].signals.forEach(element => {
            //         console.log(element)
            //     });
            // })

            // Arduino.find({ id: 'S403' }, function(err, dados) {
            //     dados[0].signals.forEach(element => {
            //         console.log(element)
            //     });
            // })
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