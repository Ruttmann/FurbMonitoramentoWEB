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

    socket.emit('sigSend', {msg: 'start'})
    socket.emit('arrayPart', "[123, 456, 111, 001]")
    socket.emit('arrayPart', "[123, 456, 111, 002]")
    socket.emit('arrayPart', "[123, 456, 111, 003]")
    socket.emit('arrayPart', "[123, 456, 111, 004]")
    socket.emit('arrayPart', "[123, 456, 111, 005]")
    socket.emit('sigSend', {msg: 'end'})

    socket.emit('sigSend', {msg: 'start'})
    socket.emit('arrayPart', "[123, 456, 222, 001]")
    socket.emit('arrayPart', "[123, 456, 222, 002]")
    socket.emit('arrayPart', "[123, 456, 222, 003]")
    socket.emit('arrayPart', "[123, 456, 222, 004]")
    socket.emit('arrayPart', "[123, 456, 222, 005]")
    socket.emit('sigSend', {msg: 'end'})

    socket.emit('endBoot', {msg: 'start'})
    // socket.emit()
})()