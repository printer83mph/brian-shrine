(function () {

    var chatLog, message, sendButton;
    var socket = io();

    function createMessage(user, message, url) {
        var out = document.createElement("li");
        
        // username
        if (user) {
            let name = document.createElement("h2");
            name.innerHTML = user + ": ";
            out.appendChild(name);
        }
        
        // TODO: check if url (ANCHORME)
        // container.target = "_blank";
        if (message) {
            let msg = document.createElement("p");
            msg.innerHTML = message;
            out.appendChild(msg);
        }

        if (url) {
            let img = document.createElement("img");
            img.src = imageURL;
            out.appendChild(img);
        }

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

        socket.on('chat message', function (user, msg, url) {
            chatLog.appendChild(createMessage(user, msg, url));
            chatLog.scrollTop = chatLog.scrollHeight;
        });

        // NEED A BROADCAST FUNCTION

    }

})();