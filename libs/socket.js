/*
* socket.emit => emite apenas ao socket específico
* socket.nsp.emit => emite para todos os sockets do namespace
*/

module.exports = function(io) {
    //namespaces
    let arduinoNM = io.of('/arduino')
    let adminNM = io.of('/admin')

    //models do banco de dados
    let Arduino = require('../model/arduino')()
    let Signal = require('../model/signal')()

    arduinoNM.on('connection', socket => {
        let clientID
        let cnt = 1 //Debug purposes
        let arduinoBanco
        let signalBanco
        let isNewDevice = false
        let isFirstSignal = true

        socket.on('identify', data => {
            clientID = data.id
            let query = Arduino.where({ device_Id: clientID })
            query.findOne(function(err, record) {
                if (err) return console.error('Error on identifying query.', err)
                if (!record) {
                    console.log(`'${clientID}' is a new Arduino client.`)
                    isNewDevice = true
                    arduinoBanco = new Arduino
                    arduinoBanco.device_Id = clientID
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
                    signalBanco.description = `Device added on ${new Date().toLocaleString()}`
                    break
                case 'end':
                    console.log(`Signals reception for Arduino client '${clientID}' finished.`)
                    if (!isNewDevice && isFirstSignal) {
                        arduinoBanco.set({ signalKeys: [] })
                        isFirstSignal = !isFirstSignal
                    }
                    arduinoBanco.signalKeys.push(signalBanco.id)
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

        let comando1 = null
        let comando2 = null

        socket.on('monitoring', data => {
            switch (data.msg) {
                case 'emptyRoom':
                    if (new Date().getHours() >= 21) {
                        socket.emit('monitoring', { msg: 'ok' })

                        //Atualiza objeto de banco do dispositivo
                        let queryArduino = Arduino.where({ device_Id: clientID })
                        queryArduino.findOne(function(err, record) {
                            if (err) return console.error(err)
                            arduinoBanco = record
                        })

                        //Busca comando 1 do dispositivo
                        let querySignal1 = Signal.where({ _id: arduinoBanco.signalKeys[0] })
                        querySignal1.findOne(function(err, record) {
                            if (err) return console.error(err)
                            if (record) {
                                comando1 = record.signal
                                console.log(comando1.length)
                            }
                        })

                        //Busca comando 2 do dispositivo
                        let querySignal2 = Signal.where({ _id: arduinoBanco.signalKeys[1] })
                        querySignal2.findOne(function(err, record) {
                            if (err) return console.error(err)
                            if (record) {
                                comando2 = record.signal
                                console.log(comando2.length)
                            }
                        })
                    } else {
                        socket.emit('monitoring', { msg: 'nok' })
                    }
                    break
                case 'send1':
                    //enviar comando 1 do dispositivo
                    if (comando1 != null) {

                    }

                    socket.emit('monitoring', { msg: 'endSignals'})
                    break
                case 'send2':
                    //enviar comando 2 do dispositivo
                    if (comando2 != null) {
                        
                    }
                    
                    socket.emit('monitoring', { msg: 'endSignals'})
                    break    
                default:
                    break
            }
        })

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
}