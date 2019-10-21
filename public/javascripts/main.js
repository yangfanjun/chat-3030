$(document).ready(function () {
    var FADE_TIME = 150; // ms
    var username = 'testusername';
    var amazing = '！';
    $('.topname').append(username+amazing);

    var $window = $(window);
    var $messages = $('.messages'); // Messages area
    var $chatbody = $(".chat-body");
    var $inputMessage = $('#exampleTextarea');
    // var socket = io.connect('http://localhost:3030');
    var socket = io.connect('http://47.97.26.62:3030/');
    var connected = false;

    // Sets the client's username
    const setUsername = (username) => {
        console.log('setUsername');
        // If the username is valid
        if (username) {
            // Tell the server your username
            socket.emit('add user', username);
        }
    };

    // 用户加入时显示的内容
    const addParticipantsMessage = (data) => {
        console.log('addParticipantsMessage');
        var message = '';
        if (data.numUsers === 1) {
            message += "there's 1 participant";
        } else {
            message += "there are " + data.numUsers + " participants";
        }
        log(message);
    };

    // 生成html元素
    const log = (message, options) => {
        console.log('log');
        var $el = $("<div>").addClass('log').text(message);
        addMessageElement($el, options);
    };

    // 将html元素加至messages类下
    const addMessageElement = (el, options) => {
        console.log('addMessageElement');
        // 捕获html元素
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
        // 新消息发出时滚至底端
        var getmessageheight = $messages.height();
        var getchatbodyheight = $chatbody.height();
        console.log(diff);

        var getscroll = $(".chat-body").scrollTop();
        console.log(getheight);
        console.log(getscroll);
        // if ((getheight-getscroll)<500 ){
        //     $(".chat-body").scrollTop($(".messages").height());
        // }
        // if( $(".chat-body").scrollTop() !== ){
        //     $(".chat-body").scrollTop($(".messages").height());
        // }
    };

    // Adds the visual chat message to the message list
    // 生成消息html元素
    const addChatMessage = (data, options) => {
        console.log('addChatMessage');
        // Don't fade the message in if there is an 'X was typing'
        // var $typingMessages = getTypingMessages(data);
        options = options || {};
        // if ($typingMessages.length !== 0) {
        //     options.fade = false;
        //     $typingMessages.remove();
        // }

        var $usernameDiv = $("<div>").addClass('message-time').text(data.username);
        var $messageBodyDiv = $("<div>").addClass('message-content').text(data.message);

        // var typingClass = data.typing ? 'typing' : '';
        var $messageDiv = $("<div>")
            .addClass('message-mine')
            .append($usernameDiv, $messageBodyDiv);

        addMessageElement($messageDiv, options);
    };

    // Sends a chat message
    const sendMessage = () => {
        console.log('sendMessage');
        var message = $inputMessage.val();
        // Prevent markup from being injected into the message
        message = cleanInput(message);
        // if there is a non-empty message and a socket connection
        if (message && connected) {
            $inputMessage.val('');
            addChatMessage({
                username: username,
                message: message
            });
            // tell server to execute 'new message' and send along one parameter
            socket.emit('new message', message);
        }
    };

    // Prevents input from having injected markup
    const cleanInput = (input) => {
        return $('<div/>').text(input).html();
    };

    // Keyboard events
    $window.keydown(event => {
        // Auto-focus the current input when a key is typed
        // if (!(event.ctrlKey || event.metaKey || event.altKey)) {
        //     $currentInput.focus();
        // }
        // When the client hits ENTER on their keyboard
        if (event.which === 13) {
            if (username) {
                sendMessage();
                // socket.emit('stop typing');
                // typing = false;
            } else {
                setUsername();
            }
        }
    });

    // Focus input when clicking on the message input's border
    $inputMessage.click(() => {
        $inputMessage.focus();
    });


    // Whenever the server emits 'login', log the login message
    // login -> addParticipantsMessage -> log -> addMessageElement
    socket.on('login', (data) => {
        console.log('login');
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
        console.log('user joined');
        log(data.username + ' joined');
        addParticipantsMessage(data);
    });

    // Whenever the server emits 'user left', log it in the chat body
    socket.on('user left', (data) => {
        log(data.username + ' left');
        addParticipantsMessage(data);
        // removeChatTyping(data);
    });

    // Whenever the server emits 'new message', update the chat body
    socket.on('new message', (data) => {
        console.log('new message');
        addChatMessage(data);
    });

    // 第一个执行的函数 first
    setUsername(username);

});


