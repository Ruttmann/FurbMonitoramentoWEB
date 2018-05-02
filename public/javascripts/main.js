(function() {
    // var socket = io('/admin');
    var socket = io('/arduino');

    // socket.on('sayhi', function(msg) {
    //     console.log(msg);
    // });

    // socket.on('newSignal', function(msg) {
    //     console.log(msg);
    // });

    socket.emit('sigSend', {msg: 'start'});

    socket.emit('arrayPart', "[123, 456, 789, 000]");
    socket.emit('arrayPart', "[123, 456, 789, 000]");
    socket.emit('arrayPart', "[123, 456, 789, 000]");
    socket.emit('arrayPart', "[123, 456, 789, 000]");
    socket.emit('arrayPart', "[123, 456, 789, 000]");

    socket.emit('sigSend', {msg: 'end'});
})()