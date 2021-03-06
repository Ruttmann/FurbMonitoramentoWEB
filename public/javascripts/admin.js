(function() {
    //Websocket com servidor
    let socket = io('/arduino')
    //Lista de comandos
    let signalsList

    $(document).ready(function() {
        //Desabilita primeiro link da NAVBAR
        $(".pdge4").click(function(event) {
            event.preventDefault()
        }) 
        //Abre página de informações
        $("#infolink").click(function(event) {
            event.preventDefault()
            $(".infopanel").show()
            $(".devicespanel").hide()
            $(".commandspanel").hide()
        })
        //Abre página de dispositivos
        $("#displink").click(function(event) {
            event.preventDefault()
            $(".devicespanel").show()
            $(".infopanel").hide()
            $(".commandspanel").hide()
        })
        //Abre página de comandos
        $("#comalink").click(function(event) {
            event.preventDefault()
            $(".commandspanel").show()
            $(".infopanel").hide()
            $(".devicespanel").hide()
        })

        //Se identifica no servidor
        socket.emit('identify', { id: 'web'})

        //Solicita todos os dados para preencher as páginas
        socket.emit('sendAllData')

        //Desabilita botão salvar do modal de comandos se o nome do comando estiver vazio
        $('#nameCommand').keyup(function(){
            $('#saveCommand').prop('disabled', this.value == "" ? true : false);     
        })

        //Desabilita botão salvar do modal de dispositivos se o ID do dispositivo estiver vazio
        $('#clientId').keyup(function(){
            $('#saveDevice').prop('disabled', this.value == "" ? true : false);     
        })

        //Salva os valores do modal de comandos
        $('#saveCommand').click(function(event) {
            let modal = $('#modalCommands')
            let commandId = modal.find('#idCommand').val()
            let commandName = modal.find('#nameCommand').val()
            let commandDescr = modal.find('#descriptionCommand').val()

            let commandObj = { id: commandId, name: commandName, description: commandDescr }

            socket.emit('saveSignal', commandObj)
        })

        //Salva os valores do modal de dispositivos
        $('#saveDevice').click(function(event) {
            let modal = $('#modalDevices')
            let deviceId = modal.find('#devId').val()
            let deviceClientId = modal.find('#clientId').val()
            let deviceDescr = modal.find('#descr').val()
            let commandsKeys = []
            commandsKeys[0] = modal.find('#commAr :selected').val()
            commandsKeys[1] = modal.find('#commProjetor :selected').val()
            let deviceResetFail = modal.find('#resetFailure').prop('checked')

            let deviceObj = { id: deviceId, clientID: deviceClientId, description: deviceDescr, signalKeys: commandsKeys, resetFailure: deviceResetFail }

            socket.emit('saveDevice', deviceObj)
        })

        //Atualiza div .commandspanel e a lista de sinais
        socket.on('updateSignals', (data) => {
            let commandsDiv = '#commandsCards'
            $(commandsDiv).empty()
            
            //ATUALIZA A DIV
            data.signals.forEach(element => {
                $(commandsDiv).append(
                    `<div class="card bg-dark" data-toggle="modal" data-target="#modalCommands" data-id=${element._id}>
                        <div class="card-body text-center">
                            <p class="card-text deviceName text-white">${element.deviceName}</p>
                            <p class="card-text deviceDescription text-white-50">${element.description}</p>
                        </div>
                    </div>`
                )
            })

            //ATUALIZA A LISTA DE SINAIS
            signalsList = data.signals
        })

        //Preenche a modal de comandos
        function fillCommandsModal(event, $modal) {
            let card = $(event.relatedTarget)
            let commandId = card.data('id')
            let commandName = card.find('.deviceName').text()
            let commandDescr = card.find('.deviceDescription').text()

            $modal.find('#idCommand').val(commandId)
            $modal.find('#nameCommand').val(commandName)
            $modal.find('#descriptionCommand').val(commandDescr)
        }

        //Preenche a modal de dispositivos
        function fillDevicesModal(event, $modal) {
            let row = $(event.relatedTarget)
            let deviceId = row.data('id')
            let clientId = row.find('.devId').text()
            let description = row.find('.description').text()
            let command1key = row.find('.command1key').text()
            let command1name = row.find('.command1name').text()
            let command2key = row.find('.command2key').text()
            let command2name = row.find('.command2name').text()

            $modal.find('#devId').val(deviceId)
            $modal.find('#clientId').val(clientId)
            $modal.find('#descr').val(description)

            //ESVAZIA E ADICIONA A PRIMEIRA OPÇÃO NA DROPDOWN COMANDO AR
            $modal.find('#commAr').empty()
            $modal.find('#commAr').append($('<option />')
                .val(command1key).text(command1name))
            
            //ESVAZIA E ADICIONA A PRIMEIRA OPÇÃO NA DROPDOWN COMANDO PROJETOR
            $modal.find('#commProjetor').empty()
            $modal.find('#commProjetor').append($('<option />')
                .val(command2key).text(command2name))

            $modal.find('#resetFailure').prop('checked', false)

            //PREENCHE OS ITENS RESTANTES NA DROPDOWN DE COMANDO AR
            signalsList.forEach(signal => {
                if (signal._id != command1key) {
                    $modal.find('#commAr').append($('<option />')
                        .val(signal._id).text(signal.deviceName))
                }
            })

            //PREENCHE OS ITENS RESTANTES NA DROPDOWN DE COMANDO PROJETOR
            signalsList.forEach(signal => {
                if (signal._id != command2key) {
                    $modal.find('#commProjetor').append($('<option />')
                        .val(signal._id).text(signal.deviceName))
                }
            })
        }

        //Evento de abertura da modal de comandos, chama a função que preenche a modal de comandos
        $('#modalCommands').on('show.bs.modal', event => {
            fillCommandsModal(event, $(this))
        })

        //Evento de abertura da modal de dispositivos, chama a função que preenche a modal de dispositivos
        $('#modalDevices').on('show.bs.modal', event => {
            fillDevicesModal(event, $(this))
        })
        
        //Atualiza a página de dispositivos
        socket.on('updateDevices', (data) => {
            let devicesDiv = '#bodyDevices'
            $(devicesDiv).empty()

            //Preenche tabela com Dispositivos IR online
            data.online.forEach(element => {
                let badgeFailure
                switch (element.hasFailure) {
                    case 'Não':
                        badgeFailure = 'success'
                        break
                    default:
                        badgeFailure = 'warning'
                        break
                }
                
                $(devicesDiv).append(
                    `<tr data-toggle="modal" data-target="#modalDevices" data-id=${element._id}>
                        <th class="devId">${element.clientID}</th>
                        <th class="description">${element.description}</th>
                        <th class="commands">
                            <span class="command1key" hidden>${element.signalKeys[0]}</span>
                            <span class="command1name">${!element.signalKeys[2] ? '' : element.signalKeys[2]}</span>
                            <br>
                            <span class="command2key" hidden>${element.signalKeys[1]}</span>
                            <span class="command2name">${!element.signalKeys[3] ? '' : element.signalKeys[3]}</span>
                        </th>
                        <th><span class="badge badge-pill badge-success">Online</span></th>
                        <th><span class="badge badge-pill badge-${badgeFailure}">${element.hasFailure}</span></th>
                    </tr>`
                )
            })

            //Preenche tabela com Dispositivos IR offline
            data.offline.forEach(element => {
                let badgeFailure
                switch (element.hasFailure) {
                    case 'Não':
                        badgeFailure = 'success'
                        break
                    default:
                        badgeFailure = 'warning'
                        break
                }

                $(devicesDiv).append(
                    `<tr data-toggle="modal" data-target="#modalDevices" data-id=${element._id}>
                        <th class="devId">${element.clientID}</th>
                        <th class="description">${element.description}</th>
                        <th class="commands">
                            <span class="command1key" hidden>${element.signalKeys[0]}</span>
                            <span class="command1name">${!element.signalKeys[2] ? '' : element.signalKeys[2]}</span>
                            <br>
                            <span class="command2key"hidden>${element.signalKeys[1]}</span>
                            <span class="command2name">${!element.signalKeys[3] ? '' : element.signalKeys[3]}</span>
                        </th>
                        <th><span class="badge badge-pill badge-danger">Offline</span></th>
                        <th><span class="badge badge-pill badge-${badgeFailure}">${element.hasFailure}</span></th>
                    </tr>`
                )
            })
        })
    })
})()