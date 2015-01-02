var client = new WebSocket("ws://shoshanah.princesspeach.nyc:3000");

var usertext = document.querySelector("#usertext");
var userInput = usertext.value;
var chat = document.querySelector(".chat");
var send = document.querySelector("#send");
var username = document.querySelector("#username");
var online = document.querySelector(".online");
var usersOnline = [];
var formerUserName = "";
var colors = [];
var x = 0;

function User() {
	this.name = "Anonymous";
	this.conn = client;
	this.generateColor = function() {
		var newColor = "rgb(" + Math.floor(Math.random()*255) + ", " + Math.floor(Math.random()*255) + ", " + Math.floor(Math.random()*255) + ")";
		colors.unshift(newColor);
		this.color = colors[0];
	}
}

client.addEventListener("open", function () {
	var currentUser = new User;
	currentUser.generateColor();

	usersOnline.forEach(function (elem) {
		var thisUser = document.createElement("li");
		thisUser.innerHTML = elem.name;

	});

	function sendMessage(input) {
		var txt = input;
		var msg = { name: currentUser.name, message: txt, color: currentUser.color, conn: currentUser.conn };
		var sendMsg = JSON.stringify(msg);
		client.send(sendMsg);
	}

	sendMessage(null);

	username.innerHTML = "Anonymous";

	username.addEventListener("dblclick", function () {
		var userChange = document.createElement("input");
		userChange.setAttribute("type", "text");
		var sidebar = document.querySelector(".sidebar");
		sidebar.replaceChild(username, userChange);
		userChange.innerHTML = username.innerHTML;
		userChange.addEventListener("keypress", function (evt) {
			if (evt.keyCode === 13) {
				formerUserName = currentUser.name;
				username.innerHTML = userChange.value;
				var announcement = formerUserName + " has changed name to " + userChange.value;
				console.log(announcement);
				client.send(announcement);
				currentUser.name = userChange.value;
				sidebar.replaceChild(userChange, username);
				sendMessage(null);
			}
		});
	});

	function sendUserMessage() {
		sendMessage(userInput);
	}

	send.addEventListener("click", sendUserMessage);
	usertext.addEventListener("keypress", function (evt) {
		if (evt.keyCode === 13) {
			sendUserMessage();
		}	
	});

	client.addEventListener("message", function (stuff) {
		var txt = JSON.parse(stuff.data);
		if (typeof txt === 'object' && txt.hasOwnProperty(message)) {
			var msg = txt.message;
			if (currentUser.name !== txt.name && usersOnline.indexOf(txt.name) > -1) {
				var onlineUser = { name: txt.name, color: txt.color, conn: txt.conn };
				usersOnline.forEach(function (elem) {
					if (onlineUser.conn === elem.conn) {
						var printedUsers = document.querySelectorAll("li");
						for (i = 0; i < printedUsers.length; i++) {
							var n = printedUser[i];
							if (n.textContent === elem.name) {
								elem.name = onlineUser.name;
								n.innerHTML = elem.name;
							} 
						}	
					}
					else {
						usersOnline.push(onlineUser);
						var thisUser = document.createElement("li");
						thisUser.innerHTML = onlineUser.name;
						online.appendChild(thisUser);
					}
				});
			}
			if (msg !== null) {
				var chatBlurb = document.createElement("div");
				chatBlurb.setAttribute("class", "user");
				chatBlurb.style.color = txt.color;
				chat.appendChild(chatBlurb);
				var chatUser = document.createElement("p");
				chatUser.setAttribute("class", "uname");
				chatUser.innerHTML = txt.name + ": ";
				var chatMsg = document.createElement("p");
				chatMsg.setAttribute("class", "umsg");
				chatMsg.innerHTML = " " + msg;
				chatBlurb.appendChild(chatUser);
				chatBlurb.appendChild(chatMsg);
				if (msg.substr(0, 7) === "http://") {
					chatMsg.setAttribute("href", msg);
				}
				if (msg.substr(-3) === "png" || msg.substr(-3) === 
					"jpg" || msg.substr(-4) === "jpeg" || msg.substr(-4) === "tiff" || msg.substr(-3) === "gif") {
					var newline = document.createElement("br");
					chatBlurb.appendChild(newline);
					var chatImg = document.createElement("img");
					chatImg.setAttribute("src", msg);
					chatBlurb.appendChild(chatImg);
				}
				if (txt.name === currentUser.name) {
					chatBlurb.style.background = "lightblue";
				}

				usertext.value = "";
				if (txt.name === currentUser.name && msg === "**this user has been banned**") {
					window.alert("Sorry, you used a banned word. You have been booted from the chat.");
				}
			}
		}
		else if (typeof txt === 'string') {
			var words = txt.split(" ");
			var phrase = [];
			words.forEach(function (elem) {
				if (elem === "has" || elem === "changed" || elem === "name" || elem === "to") {
					phrase.push(elem);
				}
				var checkPhrase = phrase.join(" ");
				if (checkPhrase === "has changed name to") {
					var chatBlurb = document.createElement("div");
					chatBlurb.setAttribute("class", "announce");
					chat.appendChild(chatBlurb);
					var announce = document.createElement("p");
					announce.innerHTML = txt;
					chatBlurb.appendChild(announce);
				}
			});
		}
	});

	client.addEventListener("close", function () {
		usersOnline.splice(usersOnline.indexOf(currentUser), 1);
	});
});



