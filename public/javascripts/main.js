(function() {
    // let socket = io('/admin')
    let socket = io('/arduino')

    // socket.on('sayhi', function(msg) {
    //     console.log(msg)
    // })

    // socket.on('newSignal', function(msg) {
    //     console.log(msg)
    // })

    // socket.emit('arrayPart', "[123, 456, 789, 000]")
    // socket.emit('arrayPart', "[123, 456, 789, 000]")
    // socket.emit('arrayPart', "[123, 456, 789, 000]")
    // socket.emit('arrayPart', "[123, 456, 789, 000]")
    // socket.emit('arrayPart', "[123, 456, 789, 000]")

    socket.emit('identify', {id:'A444'})

    setTimeout(() => {
        socket.emit('sigSend', {msg: 'start'})
        socket.emit('arrayPart', "[123, 456, 333, 001]")
        socket.emit('arrayPart', "[123, 456, 333, 002]")
        socket.emit('arrayPart', "[123, 456, 333, 003]")
        socket.emit('arrayPart', "[123, 456, 333, 004]")
        socket.emit('arrayPart', "[123, 456, 333, 005]")
        socket.emit('sigSend', {msg: 'end'})

        socket.emit('sigSend', {msg: 'start'})
        socket.emit('arrayPart', "[123, 456, 444, 001]")
        socket.emit('arrayPart', "[123, 456, 444, 002]")
        socket.emit('arrayPart', "[123, 456, 444, 003]")
        socket.emit('arrayPart', "[123, 456, 444, 004]")
        socket.emit('arrayPart', "[123, 456, 444, 005]")
        socket.emit('sigSend', {msg: 'end'})

        socket.emit('endBoot', {msg: 'start'})
    }, 2000)
})()