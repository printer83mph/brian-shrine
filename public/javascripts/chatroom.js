(function () {

    var chatLog, message, sendButton, fileInputButton, fileInputText, file;
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
            img.src = url;
            out.appendChild(img);
        }

        return out;
    }

    window.onload = function () {
        chatLog = document.getElementById("chatlog");
        message = document.getElementById("message");
        sendButton = document.getElementById("send");
        fileInputButton = document.getElementById("fileInput");
        fileInputText = document.getElementById("fileInputText");

        message.focus();

        function clearChat() {
            while (chatLog.firstChild) {
                chatLog.removeChild(chatLog.firstChild);
            }
        }

        function uploadImage(file, callback) {
            let reader = new FileReader();

            reader.onloadend = function () {
                let data = reader.result;
                data = data.slice(data.indexOf(',') + 1);
                callback(data);
            };

            reader.readAsDataURL(file);
        }

        chatLog.appendChild(createMessage(null, "Enter your name to begin"));

        socket.on('name', function (name) {
            clearChat();
            message.value = "";
            document.getElementById("name").innerHTML = `Logged in as ${name}`;
            socket.on('chat message', function (user, msg, url) {
                chatLog.appendChild(createMessage(user, msg, url));
                chatLog.scrollTop = chatLog.scrollHeight;
            });
            sendButton.onclick = function (e) {
                e.preventDefault();

                var msg = (message.value.trim() == "" ? null : message.value.trim());

                if (file) {
                    uploadImage(file, function(data) {
                        socket.emit('chat message', msg, data);
                    });
                } else if(msg) {
                    socket.emit('chat message', msg);
                }
                message.value = '';

                fileInputButton.value = null;
                file = null;
                fileInputText.innerText = "Upload Image";

                return false;
            };
        });

        fileInputButton.onchange = function (e) {
            file = this.files[0];
            fileInputText.innerText = file.name;
        };

        sendButton.onclick = function (e) {
            e.preventDefault();
            if (message.value.trim() != "") {
                socket.emit("name", message.value);
            } else {
                chatLog.appendChild(createMessage(null, "Please enter a valid name."))
            }
            message.value = "";
            return false;
        };

        // NEED A BROADCAST FUNCTION

    }

})();