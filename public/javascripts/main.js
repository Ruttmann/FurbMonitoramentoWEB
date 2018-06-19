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

    socket.emit('identify', {id:'S403'})

    setTimeout(() => {
        socket.emit('endBoot', {msg: 'start'})
    }, 2000)

    setTimeout(() => {
        socket.emit('monitoring', {msg: 'emptyRoom'})
    }, 2000)

    socket.on('monitoring', function(msg) {
        console.log(msg)
    })
})()