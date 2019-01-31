(function () {

    var chatLog, message, sendButton;
    var socket = io();

    function createMessage(user, message) {
        var out = document.createElement("li");
        if (user) {
            let name = document.createElement("h2");
            name.innerHTML = user;
            out.appendChild(name);
        }
        let msg = document.createElement("p");
        msg.innerHTML = message;
        out.appendChild(msg);
        return out;
    }

    window.onload = function () {
        chatLog = document.getElementById("chatlog");
        message = document.getElementById("message");
        sendButton = document.getElementById("send");

        let name = prompt("Enter your name") || "anon";

        socket.emit("name", name);

        socket.on('name', function(name) {
            document.getElementById("name").innerHTML = `Logged in as ${name}`;
        });

        sendButton.onclick = function (e) {
            e.preventDefault;
            socket.emit("chat message", message.value);
            message.value = "";
            return false;
        };

        socket.on('chat message', function (user, msg) {
            chatLog.appendChild(createMessage(user, msg));
            chatLog.scrollTop = chatLog.scrollHeight;
        });



    }

})();