
var username = 'testusername';
username += '！';


$(document).ready(function(){

    $('.topname').append(username);

    var socket = io.connect('http://localhost:3030');

    socket.on('news', function (data) {
        console.log(data);
        socket.emit('my other event', { my: 'data' });
    });

    const addParticipantsMessage = (data) => {
        var message = '';
        if (data.numUsers === 1) {
            message += "there's 1 participant";
        } else {
            message += "there are " + data.numUsers + " participants";
        }
        log(message);
    }


});


