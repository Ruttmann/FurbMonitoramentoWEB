(function() {
    let socket = io('/arduino')

    $(document).ready(function() {
        $(".pdge4").click(function(event) {
            event.preventDefault()
        }) 
    
        $("#infolink").click(function(event) {
            event.preventDefault()
            $(".infopanel").show()
            $(".devicespanel").hide()
            $(".commandspanel").hide()
        })
    
        $("#displink").click(function(event) {
            event.preventDefault()
            $(".devicespanel").show()
            $(".infopanel").hide()
            $(".commandspanel").hide()
        })
    
        $("#comalink").click(function(event) {
            event.preventDefault()
            $(".commandspanel").show()
            $(".infopanel").hide()
            $(".devicespanel").hide()
        })

        //DESABILITA BOTÃO SALVAR DO MODAL DE COMANDOS SE O NOME DO COMANDO ESTIVER VAZIO
        $('#nameCommand').keyup(function(){
            $('#saveCommand').prop('disabled', this.value == "" ? true : false);     
        })

        //DESABILITA BOTÃO SALVAR DO MODAL DE DISPOSITIVOS SE O NOME DO COMANDO ESTIVER VAZIO
        $('#clientId').keyup(function(){
            $('#saveDevice').prop('disabled', this.value == "" ? true : false);     
        })

        $('#saveCommand').click(function(event) {
            let modal = $('#modalCommands')
            let commandId = modal.find('#idCommand').val()
            let commandName = modal.find('#nameCommand').val()
            let commandDescr = modal.find('#descriptionCommand').val()

            let commandObj = { id: commandId, name: commandName, description: commandDescr }

            socket.emit('saveSignal', commandObj)

        })


        $('#saveDevice').click(function(event) {
            let modal = $('#modalDevices')
            let deviceId = modal.find('#devId').val()
            let deviceClientId = modal.find('#clientId').val()
            let deviceDescr = modal.find('#descr').val()
            
        })

        socket.emit('identify', { id: 'web'})

        socket.emit('sendAllData')

        //Atualiza div .commandspanel
        socket.on('updateSignals', (data) => {
            let commandsDiv = '#commandsCards'
            $(commandsDiv).empty()
            
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
        })

        function fillCommandsModal(event, $modal) {
            let card = $(event.relatedTarget)
            let commandId = card.data('id')
            let commandName = card.find('.deviceName').text()
            let commandDescr = card.find('.deviceDescription').text()

            $modal.find('#idCommand').val(commandId)
            $modal.find('#nameCommand').val(commandName)
            $modal.find('#descriptionCommand').val(commandDescr)
        }

        function fillDevicesModal(event, $modal) {
            let row = $(event.relatedTarget)
            let deviceId = row.data('id')
            let clientId = row.find('.devId').text()
            let description = row.find('.description').text()
            let command1 = row.find('.command1').text()
            let command2 = row.find('.command2').text()

            $modal.find('#devId').val(deviceId)
            $modal.find('#clientId').val(clientId)
            $modal.find('#descr').val(description)
            $modal.find('#commAr').val(command1)
            $modal.find('#commProjetor').val(command2)
        }

        $('#modalCommands').on('show.bs.modal', event => {
            fillCommandsModal(event, $(this))
        })

        $('#modalDevices').on('show.bs.modal', event => {
            fillDevicesModal(event, $(this))
        })
        
        //Atualiza div .devicespanel
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
                            <span class="command1name">${element.signalKeys[2]}</span>
                            <br>
                            <span class="command2key" hidden>${element.signalKeys[1]}</span>
                            <span class="command2name">${element.signalKeys[3]}</span>
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
                            <span class="command1name">${element.signalKeys[2]}</span>
                            <br>
                            <span class="command2key"hidden>${element.signalKeys[1]}</span>
                            <span class="command2name">${element.signalKeys[3]}</span>
                        </th>
                        <th><span class="badge badge-pill badge-danger">Offline</span></th>
                        <th><span class="badge badge-pill badge-${badgeFailure}">${element.hasFailure}</span></th>
                    </tr>`
                )
            })
        })
    })
})()