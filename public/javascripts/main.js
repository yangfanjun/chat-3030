$(document).ready(function () {
    var FADE_TIME = 150; // ms
    var username = 'testusername';
    username += '！';
    $('.topname').append(username);

    var $messages = $('.messages'); // Messages area
    var socket = io.connect('http://localhost:3030');
    var connected = false;

    // Sets the client's username
    const setUsername = (username) => {
        // If the username is valid
        if (username) {
            // Tell the server your username
            socket.emit('add user', username);
        }
    };

    const addParticipantsMessage = (data) => {
        var message = '';
        if (data.numUsers === 1) {
            message += "there's 1 participant";
        } else {
            message += "there are " + data.numUsers + " participants";
        }
        log(message);
    };

    const log = (message, options) => {
        // var $el = $("div").addClass('log').text(message);
        var $el = $("<div>").addClass('log').text(message);
        console.log(message);
        console.log($el);
        addMessageElement($el, options);
    };

    const addMessageElement = (el, options) => {
        var $el = $(el);

        // Setup default options
        if (!options) {
            options = {};
        }
        if (typeof options.fade === 'undefined') {
            options.fade = true;
        }
        if (typeof options.prepend === 'undefined') {
            options.prepend = false;
        }

        // Apply options
        if (options.fade) {
            $el.hide().fadeIn(FADE_TIME);
        }
        if (options.prepend) {
            $messages.prepend($el);
        } else {
            $messages.append($el);
        }
        $messages[0].scrollTop = $messages[0].scrollHeight;
    };

    setUsername(username);

    socket.on('news', function (data) {
        console.log(data);
        socket.emit('my other event', {my: 'data'});
    });

    // Whenever the server emits 'login', log the login message
    socket.on('login', (data) => {
        connected = true;
        // Display the welcome message
        var message = "Welcome to Socket.IO Chat – ";
        log(message, {
            prepend: true
        });
        addParticipantsMessage(data);
    });

    // Whenever the server emits 'user joined', log it in the chat body
    socket.on('user joined', (data) => {
        log(data.username + ' joined');
        addParticipantsMessage(data);
    });

    // Whenever the server emits 'user left', log it in the chat body
    // socket.on('user left', (data) => {
    //     log(data.username + ' left');
    //     addParticipantsMessage(data);
    //     removeChatTyping(data);
    // });


});


