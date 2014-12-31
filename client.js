var client = new WebSocket("ws://shoshanah.princesspeach.nyc:3000");

var usertext = document.querySelector("#usertext");
var chat = document.querySelector(".chat");
var send = document.querySelector("#send");
var username = window.prompt("What is your name?");
var colors = [];
var users = [];
var x = 0;

function User() {
	this.name = username;
	this.generateColor = function() {
		var newColor = "rgb(" + Math.floor(Math.random()*255) + ", " + Math.floor(Math.random()*255) + ", " + Math.floor(Math.random()*255) + ")";
		colors.unshift(newColor);
		this.color = colors[0];
	}
	users.push(this);
}

client.addEventListener("open", function () {
	var currentUser = new User;
	currentUser.generateColor();

	function sendMessage() {
		var text = usertext.value;
		var msg = { name: currentUser.name, message: text, color: currentUser.color };
		var sendMsg = JSON.stringify(msg);
		client.send(sendMsg);
	}

	send.addEventListener("click", sendMessage);
	usertext.addEventListener("keypress", function (evt) {
		if (evt.keyCode === 13) {
			sendMessage();
		}	
	});

	client.addEventListener("message", function (stuff) {
		var txt = JSON.parse(stuff.data);
		var msg = txt.message;
		var chatBlurb = document.createElement("p");
		chatBlurb.setAttribute("class", "user");
		chatBlurb.style.color = txt.color;
		chat.appendChild(chatBlurb);
		var chatUser = document.createElement("b");
		chatUser.setAttribute("class", "uname");
		chatUser.innerHTML = txt.name + ": ";
		var chatMsg = document.createElement("a");
		chatMsg.setAttribute("class", "umsg");
		chatMsg.innerHTML = msg;
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
	});

	client.addEventListener("close", function () {
		clients.splice(clients.indexOf(currentUser), 1);
	});
});



