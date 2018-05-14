(function() {
    // let socket = io('/admin')
    let socket = io('/arduino')

    // socket.on('sayhi', function(msg) {
    //     console.log(msg)
    // })

    // socket.on('newSignal', function(msg) {
    //     console.log(msg)
    // })

    // socket.emit('sigSend', {msg: 'start'})

    // socket.emit('arrayPart', "[123, 456, 789, 000]")
    // socket.emit('arrayPart', "[123, 456, 789, 000]")
    // socket.emit('arrayPart', "[123, 456, 789, 000]")
    // socket.emit('arrayPart', "[123, 456, 789, 000]")
    // socket.emit('arrayPart', "[123, 456, 789, 000]")

    // socket.emit('sigSend', {msg: 'end'})

    socket.emit('identify', {id: 'browser123'})
    socket.emit('monitoring', { msg: 'isEmpty' })

    socket.on('monitoring', msg => console.log(msg))
})()