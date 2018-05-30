
module.exports = function(io) {
    //namespaces
    let arduino = io.of('/arduino')
    let admin = io.of('/admin')

    //models do banco de dados
    let Arduino = require('../model/arduino')()
    let Signal = require('../model/signal')()

    //Objeto de data para monitoramento
    let dateNow;

    arduino.on('connection', socket => {
        let clientID
        let cnt = 1
        let arduinoBanco
        let signalBanco
        let isNewDevice = false

        socket.on('identify', data => {
            clientID = data.id
            let query = Arduino.where({ device_Id: clientID })
            query.findOne(function(err, record) {
                if (err) console.log('Error on identifying query.')
                if (!record) {
                    console.log(`'${clientID}' is a new Arduino client.`)
                    isNewDevice = true
                    arduinoBanco = new Arduino
                    arduinoBanco.device_Id = clientID
                    // arduinoBanco.save((err, arduinoBanco) => {
                    //     if (!err) console.log(`Arduino client '${clientID}' inserted on DB.`)
                    //     else return console.error(err)
                    // })
                } else {
                    console.log(`'${clientID}' isn't a new Arduino client.`)
                    arduinoBanco = record
                }
            })
        })

        socket.on('sigSend', data => {
            switch (data.msg) {
                case 'start':
                    console.log(`Receiving signals from Arduino client '${clientID}'`)
                    signalBanco = new Signal
                    break
                case 'end':
                    console.log(`Signals reception for Arduino client '${clientID}' finished.`)
                    if (isNewDevice)
                        arduinoBanco.signalKeys.push(signalBanco.id)
                    else {
                        //TODO: Verificar esta lógica. Só pode zerar o array na primeira vez que entra aqui
                        arduinoBanco.set({ signalKeys: [] })
                        arduinoBanco.signalKeys.push(signalBanco.id)
                    }    
                    signalBanco.save((err, signalBanco) => {
                        if (!err) {
                            console.log(`Signal for Arduino client '${clientID}' inserted on DB.`)
                        }
                        else return console.error(err)
                    })
                    break
            }
        })

        socket.on('arrayPart', data => {
            signalBanco.signal.push(data)
            //Debug purposes
            console.log(data+" --- "+cnt)
            cnt++
            console.log('/////////////')
            //Debug purposes
        })

        socket.on('endBoot', data => {
            if (data.msg == 'start') {
                arduinoBanco.save((err, arduinoBanco) => {
                    if (!err) console.log(`Arduino client infos '${clientID}' successfully stored.`)
                    else return console.error(err)
                })
            }
        })

        socket.on('monitoring', data => {
            switch (data.msg) {
                case 'emptyRoom':
                    dateNow = new Date()
                    if (dateNow.getHours() >= 22) {
                        socket.emit('monitoring', { msg: 'ok' })
                    }    
                    else {
                        socket.emit('monitoring', { msg: 'nok' })
                    }
                    break
                case 'getSignal':
                    //buscar sinais do dispositivo e enviar
                    break    
                default:
                    break
            }
        })

        // socket.on('test', data => {
            // socket.emit('test', '[123, 456, 789, 000, 666, 123, 456, 789, 000, 666, 123, 456, 789, 000, 666]')
            // socket.emit('test', { msg: '[123, 456, 789, 000, 666, 123, 456, 789, 000, 666, 123, 456, 789, 000, 666]' })
        // })

        // socket.on('list', data => {
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
        // })
    })

    // admin.on('connection', socket => {
        /*
        * socket.emit => emite apenas ao socket específico
        * socket.nsp.emit => emite para todos os sockets do namespace
        */
        // console.log('Admin connected!')

        //socket.emit('sayhi', { msg: 'Hi webclient!'})
    // })
}