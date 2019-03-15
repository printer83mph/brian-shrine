(function () {
	const JeremyBot = require('./jeremy_bot.js');

	var chatLog, message, sendButton, name, bot;

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

		chatLog.appendChild(createMessage(null, "Enter your name to begin"));

		function beginChat() {
			clearChat();
			message.value = "";
			document.getElementById("name").innerHTML = `Logged in as ${name}`;
			bot = new JeremyBot(name);

			bot.onchatmessage = function (msg) {
				chatLog.appendChild(createMessage("Jeremy", msg));
				chatLog.scrollTop = chatLog.scrollHeight;
			};
			sendButton.onclick = function (e) {
				e.preventDefault();

				var msg = (message.value.trim() == "" ? null : message.value.trim());

				if(msg) {
					chatLog.appendChild(createMessage(name, msg));
					bot.send(msg);
				}
				message.value = '';

				return false;
			};
		};

		sendButton.onclick = function (e) {
			e.preventDefault();
			if (message.value.trim() != "") {
				name = message.value;

				beginChat();
			} else {
				chatLog.appendChild(createMessage(null, "Please enter a valid name."))
			}
			message.value = "";
			return false;
		};

		// NEED A BROADCAST FUNCTION

	}

})();