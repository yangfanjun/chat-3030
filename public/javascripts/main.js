$(document).ready(function () {
    var FADE_TIME = 150; // ms
    var username = 'testusername';
    var amazing = '！';

    var $window = $(window);
    var $myModal = $('#myModal');
    var $messages = $('.messages'); // Messages area
    var $chatbody = $(".chat-body");
    var $loginTextarea = $('#loginTextarea')
    var $inputMessage = $('#exampleTextarea');
    var $userlist = $('#user-list');
    var $onlinenumber = $('#online-number');
    var $whiteback = $('#whiteback')
    // var socket = io.connect('http://localhost:3030');
    // socket.io架在当前网址+端口
    var currenturl = location.port;
    var socket = io();
    var connected = false;

    // 新消息提示框隐藏
    var newtip = false;

    // Sets the client's username
    const setUsername = () => {
        username = cleanInput($loginTextarea.val().trim());
        console.log('setUsername');
        // If the username is valid
        if (username) {
            // Tell the server your username
            socket.emit('add user', username);
        }
        // 页面右上角填充
        $('.topname').append(username + amazing);
        // 清空用户名输入框
        $loginTextarea.val('');
    };

    // 用户加入时显示的内容
    const addParticipantsMessage = (data) => {
        console.log('addParticipantsMessage');
        var message = '';
        if (data.numUsers === 1) {
            message += "当前有 1 位用户在线";
        } else {
            message += "当前有 " + data.numUsers + " 位用户在线";
        }
        log(message);
    };

    // 生成系统消息html元素
    const log = (message, options) => {
        console.log('log');
        var $el = $("<div>").addClass('log').text(message);
        addMessageElement($el, options);
    };

    // 将html元素加至messages类下
    const addMessageElement = (el, options) => {
        console.log('addMessageElement');

        // 在添加元素前判断当前是否已在底端，如果在则diff_bool为真
        var diff = $messages.height() - $chatbody.height();
        var diff_bool = false;
        if ($chatbody.scrollTop() >= diff) {
            diff_bool = true;
        } else {
            // 如果新消息出现但不在最底端，则显示"有新消息"
            newtip = true;
            shownewtip(newtip);
        }

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
        // 新消息发出时滚至底端(前提是原本已在底端)
        if (diff_bool) {
            $chatbody.scrollTop($messages.height() - $chatbody.height());
        }
    };

    // Adds the visual chat message to the message list
    // 生成用户消息html元素
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
        // 判断是否是自发消息，决定消息靠左侧还是右侧
        var $messageDiv;
        if (data.username === username) {
            $messageDiv = $("<div>")
                .addClass('message-mine')
                .append($usernameDiv, $messageBodyDiv);
        } else {
            $messageDiv = $("<div>")
                .addClass('message-others')
                .append($usernameDiv, $messageBodyDiv);
        }
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

    // 生成在线用户列表html元素
    const addUserlist = (data) => {
        console.log('addUserlist');
        var $userlist_dy0 = $("<div>").addClass('py-0 px-2 d-flex list-group-item list-group-item-action align-items-center single-usercard');
        $userlist_dy0.attr({
            'username': data
        });
        var $roundedcircle = $("<img src='/images/User.png' />").addClass('rounded-circle align-self-start mt-2');
        $roundedcircle.attr({
            'alt': "UserAdmin",
            'aria-hidden': "true",
            'style': "height: 38px; margin-bottom: 0.5rem",
        });
        var $span = $("<span>").addClass('contact-status-online');
        var $w100 = $("<div>").addClass('w-100 text-truncate ml-2 my-2');
        var $usernamediv = $("<div>").addClass('text-truncate').text(data);
        var $combine = $w100.append($usernamediv);
        var $all = $userlist_dy0.append($roundedcircle, $span, $combine);
        addUserlistElement($all);
    };

    // 添加在线用户列表html元素
    const addUserlistElement = (el) => {
        var $el = $(el);
        if ($el) {
            $userlist.append($el);
        }
    };

    // Prevents input from having injected markup
    const cleanInput = (input) => {
        return $('<div/>').text(input).html();
    };

    // Keyboard events
    // 回车 -> sendMessage -> addChatMessage -> new message(server broadcast) -> addChatMessage(other clients)
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

    // 判断是否显示有新消息
    const shownewtip = (newtip) => {
        if (newtip) {
            $('.newtip').css('display', 'flex');
        } else {
            $('.newtip').css('display', 'none');
        }
    };

    // 点击“有新消息”跳至最底端
    $('.newtip-content').click(function () {
        $chatbody.scrollTop($messages.height() - $chatbody.height());
        $('.newtip').css('display', 'none');
    });

    // 用户自由滚动至底端时提示消失
    $chatbody.scroll(function () {
        var diff = $messages.height() - $chatbody.height();
        if ($chatbody.scrollTop() === diff) {
            $('.newtip').css('display', 'none');
        }
    });

    // 监听用户名输入
    const listeninput = () => {
        $loginTextarea.bind("input propertychange", function (event) {
            if ($loginTextarea.val() === '') {
                $('#loginsubmit').attr("disabled", true)
            } else {
                $('#loginsubmit').attr("disabled", false)
            }
        });
    };


    // Focus input when clicking on the message input's border
    $inputMessage.click(() => {
        $inputMessage.focus();
    });

    // Whenever the server emits 'login', log the login message
    // login -> addParticipantsMessage -> log -> addMessageElement
    socket.on('login', (data) => {
        console.log('login');
        console.log(data);
        connected = true;
        // Display the welcome message
        var message = "欢迎来到讨论区 – ";
        log(message, {
            prepend: true
        });
        addParticipantsMessage(data);
        // 进入聊天室显示已经在线的所有用户
        var i;
        for (i in data.onlineuserlist) {
            addUserlist(data.onlineuserlist[i]);
        }
        // 显示在线人数
        var pre_str = "当前在线人数：";
        var num = data.numUsers;
        var str_all = pre_str + num;
        $onlinenumber.text(str_all);
    });

    // Whenever the server emits 'user joined', log it in the chat body
    socket.on('user joined', (data) => {
        // 只有自己输入用户名后才能侦听其他用户的加入
        if (username !== 'testusername') {
            console.log('user joined');
            log(data.username + ' 加入讨论组');
            addParticipantsMessage(data);
            addUserlist(data.username);

            // 显示在线人数
            var pre_str = "当前在线人数：";
            var num = data.numUsers;
            var str_all = pre_str + num;
            $onlinenumber.text(str_all);
        }
    });

    // Whenever the server emits 'user left', log it in the chat body
    socket.on('user left', (data) => {
        var username_str = data.username;
        log(data.username + ' 离开讨论组');
        addParticipantsMessage(data);
        $("div[username = " + username_str + "]").remove();
        // removeChatTyping(data);
        // 显示在线人数
        var pre_str = "当前在线人数：";
        var num = data.numUsers;
        var str_all = pre_str + num;
        $onlinenumber.text(str_all);
    });

    // Whenever the server emits 'new message', update the chat body
    // 只有输入用户名之后才监听消息接收
    socket.on('new message', (data) => {
        if (username !== 'testusername') {
            console.log('new message');
            addChatMessage(data);
        }
    });


    // 首先让modal自动打开
    $myModal.modal({
        keyboard: false,
        backdrop: 'static',
        show: true,
    });


    $myModal.on('shown.bs.modal', function (e) {
        listeninput();
    });

    $myModal.on('hidden.bs.modal', function (e) {
        // 第一个执行的函数 first
        setUsername();
        // 默认至页面底端
        $chatbody.scrollTop($messages.height() - $chatbody.height());
        $whiteback.fadeOut(150);
        shownewtip();
    });

});


