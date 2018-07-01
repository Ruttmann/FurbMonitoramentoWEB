(function() {
    // let socket = io('/admin')
    let socket = io('/arduino')

    // socket.on('newSignal', function(msg) {
    //     console.log(msg)
    // })

    // socket.emit('arrayPart', "[123, 456, 789, 000]")
    // socket.emit('arrayPart', "[123, 456, 789, 000]")
    // socket.emit('arrayPart', "[123, 456, 789, 000]")
    // socket.emit('arrayPart', "[123, 456, 789, 000]")
    // socket.emit('arrayPart', "[123, 456, 789, 000]")

    socket.emit('identify', {id:'S555'})
    socket.emit('endBoot', {msg: 'start'})

    // setTimeout(() => {
    //     console.log("Sinal1"+Date.now())
    //     socket.emit('sigSend', { msg: 'start' })

    //     socket.emit('arrayPart', "[123, 456, 789, 000]")
    //     socket.emit('arrayPart', "[123, 456, 789, 111]")
    //     socket.emit('arrayPart', "[123, 456, 789, 222]")
    //     socket.emit('arrayPart', "[123, 456, 789, 333]")
    //     socket.emit('arrayPart', "[123, 456, 789, 444]")

    //     socket.emit('sigSend', { msg: 'end' })
    // }, 2000)

    // setTimeout(() => {
    //     console.log("Sinal2"+Date.now())
    //     socket.emit('sigSend', { msg: 'start' })

    //     socket.emit('arrayPart', "[123, 456, 789, 555]")
    //     socket.emit('arrayPart', "[123, 456, 789, 666]")
    //     socket.emit('arrayPart', "[123, 456, 789, 777]")
    //     socket.emit('arrayPart', "[123, 456, 789, 888]")
    //     socket.emit('arrayPart', "[123, 456, 789, 999]")

    //     socket.emit('sigSend', { msg: 'end' })   
    //     socket.emit('clients', { msg: 'blabalbal' })
    // }, 7000)

    // setTimeout(() => {
    //     console.log("Endboot"+Date.now())
    //     socket.emit('endBoot', {msg: 'start'})
    // }, 10000);

    // setTimeout(() => {
    //     console.log("Emptyroom"+Date.now())
    //     socket.emit('monitoring', {msg: 'emptyRoom'})
    // }, 13000)

    // socket.on('monitoring', function(msg) {
    //     console.log(msg)
    // })

    // socket.on('sigPart', function(msg) {
    //     console.log(msg)
    // })

    // setTimeout(() => {
    //     console.log("Send1"+Date.now())
    //     for (let index = 0; index < 6; index++) {
    //         socket.emit('monitoring', { msg: 'send1' })
    //     }
    // }, 18000)

    // setTimeout(() => {
    //     console.log("Send2"+Date.now())
    //     for (let index = 0; index < 6; index++) {
    //         socket.emit('monitoring', { msg: 'send2' })
    //     }
    // }, 21000)
})()