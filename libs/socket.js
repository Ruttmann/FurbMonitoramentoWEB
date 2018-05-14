
module.exports = function(io) {
    //namespaces
    let arduino = io.of('/arduino')
    let admin = io.of('/admin')

    //model do banco de dados
    let Arduino = require('../model/arduino')()
    let Signals = require('../model/signals')()

    //Objeto de data para monitoramento
    let dateNow = new Date()

    arduino.on('connection', socket => {
        let clientID
        let cnt = 1
        let arduinoBanco = new Arduino
        let signalsBanco = new Signals

        console.log('Arduino connected!')

        socket.on('identify', data => {
            clientID = data.id
            console.log(`Arduino client '${clientID}' has connected.`)
        })

        socket.on('sigSend', data => {
            switch (data.msg) {
                case 'start':
                    console.log(`Receiving signals from Arduino client '${clientID}'`)
                    arduinoBanco.id = clientID
                    arduinoBanco.description = 'New Arduino client'
                    break
                case 'end':
                    console.log(`Signals reception for Arduino client '${clientID}' finished.`)
                    arduinoBanco.save((err, arduinoBanco) => {
                        if (!err) console.log(`Signals for Arduino client '${clientID}' successfully stored.`)
                        else return console.error(err)
                    })
                    break
                default:
                    break
            }
        })

        socket.on('arrayPart', data => {
            arduinoBanco.signals.push(data)
            console.log(data+" --- "+cnt)
            cnt++
            console.log('/////////////')
        })

        socket.on('monitoring', data => {
            switch (data.msg) {
                case 'emptyRoom':
                    console.log(dateNow.getHours())
                    if (dateNow.getHours() >= 22) {
                        socket.emit('monitoring', { msg: 'ok' })
                    }    
                    else {
                        socket.emit('monitoring', { msg: 'nok' })
                    }
                    break
                default:
                    break
            }
        })

        socket.on('list', data => {
            // Arduino.find(function(err, dados) {
            //     if (err) return console.error(err)
            //     dados[0].signals.forEach(element => {
            //         console.log(element)
            //     })
            // })

            // Arduino.find({ id: 'S403' }, function(err, dados) {
            //     dados[0].signals.forEach(element => {
            //         console.log(element)
            //     })
            // })
        })
    })

    admin.on('connection', socket => {
        /*
        * socket.emit => emite apenas ao socket específico
        * socket.nsp.emit => emite para todos os sockets do namespace
        */
        console.log('Admin connected!')

        //socket.emit('sayhi', { msg: 'Hi webclient!'})
    })
}