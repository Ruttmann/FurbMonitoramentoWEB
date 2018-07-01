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
            let commandName = card.children().children('.deviceName').text()
            let commandDescr = card.children().children('.deviceDescription').text()

            $modal.find('#id').val(commandId)
            $modal.find('#name').val(commandName)
            $modal.find('#description').val(commandDescr)
        }

        $('#modalCommands').on('show.bs.modal', (event) => {
            fillCommandsModal(event, $(this))
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
                    `<tr data-toggle="modal" data-target="#modalDevices">
                        <th>${element.clientID}</th>
                        <th>${element.description}</th>
                        <th s1="a" s2="b">${element.signalKeys[0]}<br>${element.signalKeys[1]}</th>
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
                    `<tr data-toggle="modal" data-target="#modalDevices">
                        <th>${element.clientID}</th>
                        <th>${element.description}</th>
                        <th>${element.signalKeys[0]}<br>${element.signalKeys[1]}</th>
                        <th><span class="badge badge-pill badge-danger">Offline</span></th>
                        <th><span class="badge badge-pill badge-${badgeFailure}">${element.hasFailure}</span></th>
                    </tr>`
                )
            })
        })
    })
})()