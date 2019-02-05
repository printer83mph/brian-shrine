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

        function clearChat() {
            while(chatLog.firstChild) {
                chatLog.removeChild(chatLog.firstChild);
            }
        }

			  function uploadImage(message, file) {
				    let reader = new FileReader();

				    reader.onloadend = function() {
				    	  let data = reader.result;
				    	  data = data.slice(data.indexOf(',') + 1);
				    	  socket.emit('chat message', message, data);
				    };

				    reader.readAsDataURL(file);
			  }

        chatLog.appendChild(createMessage(null, "Enter your name to begin"));

        socket.on('name', function(name) {
            clearChat();
            message.value = "";
            document.getElementById("name").innerHTML = `Logged in as ${name}`;
            socket.on('chat message', function (user, msg, url) {
                chatLog.appendChild(createMessage(user, msg, url));
                chatLog.scrollTop = chatLog.scrollHeight;
            });
            sendButton.onclick = function(e) {
                e.preventDefault();

                if (file) {
                    uploadImage(message.value, file);
                } else {
                    socket.emit('chat message', message.value);
                }
                message.value = '';

                fileInputButton.value = null;
                fileInputText.innerText = "Upload Image";

                return false;
            };
        });

        fileInputButton.onchange = function(e) {
            file = this.files[0];
            fileInputText.innerText = file.name;
        };

        sendButton.onclick = function (e) {
            e.preventDefault();
            socket.emit("name", message.value);
            return false;
        };

        // NEED A BROADCAST FUNCTION

    }

})();