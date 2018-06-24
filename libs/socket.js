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
                    if (!err) {
                        console.log(`Arduino client infos '${clientID}' successfully stored.`)  
                        console.log(`Arduino client '${clientID}' started room monitoring.`)
                    } 
                    else return console.error(err)
                })
            }
        })

        let comando1 = null
        let comando2 = null

        socket.on('monitoring', data => {
            switch (data.msg) {
                case 'emptyRoom':
                    console.log(`>>>${process.env.OFF_TIME}<<<`)
                    if (new Date().getHours() >= process.env.OFF_TIME) {
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
                            }
                        })

                        //Busca comando 2 do dispositivo
                        let querySignal2 = Signal.where({ _id: arduinoBanco.signalKeys[1] })
                        querySignal2.findOne(function(err, record) {
                            if (err) return console.error(err)
                            if (record) {
                                comando2 = record.signal
                            }
                        })
                    } else {
                        socket.emit('monitoring', { msg: 'nok' })
                    }
                    break
                case 'send1':
                    //enviar comando 1 do dispositivo
                    if (comando1 != null && comando1.length > 0) {
                        // socket.emit('sigPart', comando1[0])
                        socket.emit('sP', { s: `[${comando1[0]}]` })
                        comando1.splice(0,1)
                    } else {
                        socket.emit('sP', { s: 'eS'})
                    }
                    break
                case 'send2':
                    //enviar comando 2 do dispositivo
                    if (comando2 != null && comando2.length > 0) {
                        // socket.emit('sigPart', comando2[0])
                        socket.emit('sP', { s: `[${comando2[0]}]` })
                        comando2.splice(0,1)
                    } else {
                        socket.emit('sP', { s: 'eS'})
                    }
                    break    
            }
        })

        socket.on('keepAlive', data => {
            let id = data.msg
            console.log(`Arduino client ${id} is alive.`)
        })

        socket.on('disconnect', data => {
            console.log(`Arduino client ${clientID} has disconnected.`)
        })
    })
}