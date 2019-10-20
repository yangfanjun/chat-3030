
var username = 'testusername';
username += '！';


$(document).ready(function(){

    $('.topname').append(username);

    var socket = io.connect('http://localhost:3030');

    socket.on('news', function (data) {
        console.log(data);
        socket.emit('my other event', { my: 'data' });
    });





});


