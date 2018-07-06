/*
* socket.emit => emite apenas ao socket específico
* socket.nsp.emit => emite para todos os sockets do namespace
*/

module.exports = function(io) {
    //namespace
    let arduinoNM = io.of('/arduino')

    //models do banco de dados
    let Arduino = require('../model/arduino')()
    let Signal = require('../model/signal')()

    //Array com os id's dos clientes web conectados.
    let adminsWeb = [];

    //Array com os devices que estão online
    let devicesOnline = [];

    //Array com os devices que estão offline
    let devicesOffline = [];

    //Array com todos os sinais cadastrados em banco
    let signalsList = [];

    //Contém todos os objetos de Dispositivos IR do banco de dados
    let devicesDB

    //Contém o clientID de todos os Dispositivos IR conectados ao Sistema Gerenciador
    let connectedClients

    arduinoNM.on('connection', socket => {
        let counterSignal = 1
        let arduinoBanco
        let signalBanco
        let isNewDevice = false
        let isFirstSignal = true

        let comando1 = null
        let comando2 = null

        //Preenche as listas de dispositivos online e offline
        async function updateDevicesStatus() {
            //Zera as duas listas
            devicesOnline.splice(0,devicesOnline.length)
            devicesOffline.splice(0,devicesOffline.length)

            connectedClients = await getAllConnectedClients()
            devicesDB = await getAllDevices()

            devicesDB.forEach((currentDevice) => {
                if (connectedClients.indexOf(currentDevice.clientID) == -1)
                    devicesOffline.push(currentDevice)
                else
                    devicesOnline.push(currentDevice)
            })
            console.log("[LOG] Lista de dispositivos online atualizada.")

            await updateDevicesSignalsNames()
            sendClientDevices()
        }

        //Adiciona os nomes dos comandos atribuídos ao dispositivo
        function updateDevicesSignalsNames() {
            return new Promise((resolve,reject) => {
                devicesDB.forEach(element => {
                    let sig1 = element.signalKeys[0]
                    let sig2 = element.signalKeys[1]
    
                    signalsList.forEach(signal => {
                        if (signal._id == sig1) {
                            element.signalKeys[2] = signal.deviceName
                        }
                        if (signal._id == sig2) {
                            element.signalKeys[3] = signal.deviceName
                        }
                    });

                    if (!sig1)
                        element.signalKeys[0] = ''
                    if (!sig2)
                        element.signalKeys[1] = ''
                });
                resolve(true)
            })
        }

        //Envia ao cliente web as listas de dispositivos online e offline
        function sendClientDevices() {
            adminsWeb.forEach((currentClient) => {
                arduinoNM.connected[currentClient].emit('updateDevices', { online: devicesOnline, offline: devicesOffline })
                console.log('[LOG] Lista de clientes enviada ao cliente web.')
            })
        }

        //Atualiza a lista de comandos
        async function updateSignalsList() {
            signalsList = await getAllSignals()
            sendClientSignals()
        }

        //Envia ao cliente web a lista de comandos
        function sendClientSignals() {
            adminsWeb.forEach((currentClient) => {
                arduinoNM.connected[currentClient].emit('updateSignals', { signals: signalsList })
                console.log('[LOG] Lista de comandos enviada ao cliente web.')
            })
        }

        //Busca todos os clientes conectados
        function getAllConnectedClients() {
            return new Promise((resolve,reject) => {
                arduinoNM.clients((err, results) => {
                    if (err) return console.error('[ERR] Erro listando todos os clientes conectados.')
                    let clientsIds = []
                    results.forEach((currentValue) => {
                        if (arduinoNM.connected[currentValue].clientID != 'web' && arduinoNM.connected[currentValue].clientID != undefined)
                            clientsIds.push(arduinoNM.connected[currentValue].clientID)
                    })
                    resolve(clientsIds)
                })
            })
        }

        //Busca todos os dispositivos no banco de dados
        function getAllDevices() {
            return new Promise((resolve, reject) => {
                let query = Arduino.where({})
                query.find((err,results) => {
                    if (err) return console.error('[ERR] Erro buscando todos os dispositivos do banco para WEB.')
                    resolve(results)
                })
            })
        }
        
        //Busca todos os comandos no banco de dados
        function getAllSignals() {
            return new Promise((resolve,reject) => {
                let query = Signal.where({})
                query.find( (err, results) => {
                    if (err) return console.error('[ERR] Erro buscando todos os sinais do banco para WEB.')
                    resolve(results)
                })
            })
        }

        //Salva alterações em comandos feitas no cliente web
        async function saveSignal(signalObj) {
            await saveSignalPromise(signalObj)
            updateSignalsList()
            updateDevicesStatus()
        }

        //Adiciona em banco as alterações de comandos feitas no cliente web
        function saveSignalPromise(signalObj) {
            return new Promise((resolve,reject) => {
                Signal.update({ _id: signalObj.id }, { deviceName: signalObj.name, description: signalObj.description }, err => {
                    if (err) console.error(err)
                    resolve(true)
                })
            })
        }

        //Salva alterações em dispositivos feitas no cliente web
        async function saveDevice(deviceObj) {
            await saveDevicePromise(deviceObj)
            updateDevicesStatus()
        }

        //Adiciona em banco as alterações de dispositivos feitas no cliente web
        function saveDevicePromise(deviceObj) {
            return new Promise((resolve,reject) => {
                let obj
                if (deviceObj.resetFailure) //Se vai resetar o status de falha do dispositivo...
                    obj  = { clientID: deviceObj.clientID, description: deviceObj.description, signalKeys: deviceObj.signalKeys, hasFailure: 'Não' }
                else
                    obj  = { clientID: deviceObj.clientID, description: deviceObj.description, signalKeys: deviceObj.signalKeys }

                Arduino.update({ _id: deviceObj.id }, obj, err => {
                    if (err) console.error(err)
                    resolve(true)
                })
            })
        }

        async function updateLocalDevice() {
            await updateLocalDevicePromise()
        }

        function updateLocalDevicePromise() {
            return new Promise((resolve,reject) => {
                let queryArduino = Arduino.where({ clientID: socket.clientID })
                queryArduino.findOne(function(err, record) {
                    if (err) return console.error(err)
                    arduinoBanco = record
                    resolve(true)
                })
            })
        }

        async function updateCommand1() {
            await updateCommand1Promise()
        }

        function updateCommand1Promise() {
            return new Promise((resolve,reject) => {
                let querySignal1 = Signal.where({ _id: arduinoBanco.signalKeys[0] })
                    querySignal1.findOne(function(err, record) {
                        if (err) return console.error(err)
                        if (record) {
                            comando1 = record.signal
                        }
                        resolve(true)
                    })
            })
        }

        async function updateCommand2() {
            await updateCommand2Promise()
        }

        function updateCommand2Promise() {
            return new Promise((resolve,reject) => {
                let querySignal2 = Signal.where({ _id: arduinoBanco.signalKeys[1] })
                    querySignal2.findOne(function(err, record) {
                        if (err) return console.error(err)
                        if (record) {
                            comando2 = record.signal
                        }
                        resolve(true)
                    })
            })
        }

        async function updateDevicesAndSignals() {
            await updateLocalDevicePromise()
            await updateCommand1Promise()
            await updateCommand2Promise()
        }

        //Envia listas de dispositivos online e offline, e lista de comandos ao cliente web
        socket.on('sendAllData', () => {
            updateDevicesStatus()
            updateSignalsList()
        })

        //Salva comandos alterados no cliente web
        socket.on('saveSignal', data => {
            saveSignal(data)
        })

        //Salva dispositivos alterados no cliente web
        socket.on('saveDevice', data => {
            saveDevice(data)
        })

        //Evento de identificação dos clientes que se conectam ao servidor
        socket.on('identify', data => {
            socket.clientID = data.id

            if (socket.clientID == 'web') {
                console.log("[WEB] Cliente web se conectou.")
                adminsWeb.push(socket.id)
            } else {
                let query = Arduino.where({ clientID: socket.clientID })
                query.findOne( (err, record) => {
                    if (err) return console.error('[ERR] Erro na query de banco (identify).', err)
                    if (!record) {
                        console.log(`[NEW] Cliente '${socket.clientID}' identificado.`)
                        isNewDevice = true
                        arduinoBanco = new Arduino
                        arduinoBanco.clientID = socket.clientID
                    } else {
                        console.log(`[OLD] Cliente '${socket.clientID}' identificado.`)
                        arduinoBanco = record
                    }
                })
            }
        })

        //Evento de recepção de comandos enviados por um Dispositivo IR
        socket.on('sigSend', data => {
            switch (data.msg) {
                case 'start':
                    console.log(`[SIG] Recebendo segmentos de sinal do cliente '${socket.clientID}'`)
                    signalBanco = new Signal
                    signalBanco.description = `Adicionado em: ${new Date().toLocaleString('pt-BR')}`
                    break
                case 'end':
                    console.log(`[SIG] Recepção de segmentos de sinal do cliente '${socket.clientID}' terminou.`)
                    if (!isNewDevice && isFirstSignal) {
                        arduinoBanco.set({ signalKeys: [] })
                        isFirstSignal = !isFirstSignal
                    }
                    arduinoBanco.signalKeys.push(signalBanco.id)
                    signalBanco.save((err, signalBanco) => {
                        if (err) return console.error(err)
                        console.log(`[SIG] Comando para o cliente '${socket.clientID}' persistido.`)
                        updateSignalsList()
                    })
                    break
            }
        })

        //Evento que salva cada segmento de comando enviado pelo Dispositivo IR
        socket.on('arrayPart', data => {
            signalBanco.signal.push(data)
            //Debug purposes
            console.log(data+" --- "+counterSignal)
            counterSignal++
            console.log('/////////////')
            //Debug purposes
        })

        //Evento de fim de boot de um Dispositivo IR
        socket.on('endBoot', data => {
            switch (data.msg) {
                case 'start':
                    arduinoBanco.save((err, arduinoBanco) => {
                        if (err) return console.error(err)
                        console.log(`[ARD] Atributos do cliente '${socket.clientID}' persistidos.`)
                        //Quando um dispositivo termina o boot, atualiza a lista de dispositivos no cliente web
                        updateDevicesStatus()
                    })
                    break;
                case 'restart':
                    //Quando um Dispositivo IR sai do modo stand-by, atualiza a lista de dispositivos no cliente web
                    updateDevicesStatus()
                    break;
            }
        })

        //Evento de desligamento, quando o Dispositivo IR detecta que a sala está vazia
        socket.on('monitoring', data => {
            switch (data.msg) {
                case 'emptyRoom':
                    let currentTime = new Date().getHours()
                    let startOff = process.env.START_OFF_TIME
                    let endOff = process.env.END_OFF_TIME
                    console.log(`[INF] Autorizado a desligar entre ${startOff} e ${endOff} horas.`)
                    if (currentTime >= startOff || currentTime <= endOff) {
                    // if (currentTime >= 22 || currentTime <= 7) {
                        socket.emit('monitoring', { msg: 'ok' })

                        updateDevicesAndSignals()
                        //Atualiza objeto de banco do dispositivo
                        // let queryArduino = Arduino.where({ clientID: socket.clientID })
                        // queryArduino.findOne(function(err, record) {
                        //     if (err) return console.error(err)
                        //     arduinoBanco = record
                        // })
                        // console.log(arduinoBanco)

                        //Busca comando 1 do dispositivo
                        // let querySignal1 = Signal.where({ _id: arduinoBanco.signalKeys[0] })
                        // querySignal1.findOne(function(err, record) {
                        //     if (err) return console.error(err)
                        //     if (record) {
                        //         comando1 = record.signal
                        //     }
                        // })

                        //Busca comando 2 do dispositivo
                        // let querySignal2 = Signal.where({ _id: arduinoBanco.signalKeys[1] })
                        // querySignal2.findOne(function(err, record) {
                        //     if (err) return console.error(err)
                        //     if (record) {
                        //         comando2 = record.signal
                        //     }
                        // })
                    } else {
                        socket.emit('monitoring', { msg: 'nok' })
                    }
                    break
                case 'send1':
                    //enviar comando 1 do dispositivo
                    if (comando1 != null && comando1.length > 0) {
                        socket.emit('sP', { s: `[${comando1[0]}]` })
                        comando1.splice(0,1)
                    } else {
                        socket.emit('sP', { s: 'eS'})
                    }
                    break
                case 'send2':
                    //enviar comando 2 do dispositivo
                    if (comando2 != null && comando2.length > 0) {
                        socket.emit('sP', { s: `[${comando2[0]}]` })
                        comando2.splice(0,1)
                    } else {
                        socket.emit('sP', { s: 'eS'})
                    }
                    break    
            }
        })

        //Evento de reporte de falha no desligamento de algum equipamento da sala
        socket.on('failure', data => {
            let failure = data.id
            Arduino.update({ _id: arduinoBanco._id }, { hasFailure: failure }, err => {
                if (err) console.error(err)
                console.log(`[FAILURE] Dispositivo ${socket.clientID} reportou falha: ${failure}.`)
            })
        })

        //Evento de keepAlive do Dispositivo IR, para que não acontece timeout de conexão
        socket.on('keepAlive', data => {
            let id = data.msg
            console.log(`[KEP] Keepalive do cliente '${id}'.`)
        })

        //Evento de desconexão dos clientes.
        socket.on('disconnect', data => {
            if (socket.clientID != 'web' && socket.clientID != undefined) { //Se é um Dispositivo IR...
                console.log(`[DSC] Cliente '${socket.clientID}' se desconectou.`)
                //Quando um dispositivo se desconecta, atualiza a lista de dispositivos no cliente web
                updateDevicesStatus()
            } else { //Se é um cliente web
                let index = adminsWeb.indexOf(socket.id)
                if (index != -1) adminsWeb.splice(index, 1)
                console.log('[WEB] Cliente web se desconectou.')
            }
        })
    })    
}