var WSS = require("ws").Server;
var server = new WSS({port: 3000});
var notifier = require("node-notifier");
var clients = [];
var msgHist = [];
var x = 0;

server.on("connection", function (conn) {
//want to move User constructor to server side, then send user object to client side and store it *there* in onlineUsers, so that all clients will have this list
//current model on client side doesn't actually take all the online users, as suspected
//this requires a slight overhaul of the client side code, so attempt to figure out versioning

//super mad at myself for sleeping/being out of it the day we were given to tweak this chat app, ngl


	clients.push(conn);

	console.log(clients.length + " users are in the chat.");

	msgHist.forEach(function (msg) {
		conn.send(msg);
	});

	conn.on("message", function (input) {
		var info = JSON.parse(input);

		if (info.hasOwnProperty("message") && info.message !== null) {
			var message = info.name + ": " + info.message;
			var toSend = {name: info.name, message: info.message, color: info.color };
			function sending() {
				var sendMsg = JSON.stringify(toSend);
				clients.forEach(function (cl) {
					cl.send(sendMsg);
				});
				msgHist.push(sendMsg);
			}

			var arr = info.message.split(" ");
			console.log(message);

			if(arr.indexOf("kike") > -1 || arr.indexOf("kikes") > -1) {
				toSend.message = "**this user has been banned**";
				sending();
				conn.close();
			}
			else if (info.message === "(table flip)"){
				toSend.message = "(╯°□°）╯︵ ┻━┻";
				sending();
			}
			else if (info.message === "(shrug)") {
				toSend.message = "¯\\_(ツ)_/¯";
				sending();
			}
			else if (info.message === "(flower in hair)") {
				toSend.message = "(◡ ‿ ◡ ✿)";
				sending();
			}
			else if (arr[0] === "/yell") {
				arr.shift("/yell");
				var newMessage = arr.join(" ");
				toSend.message = newMessage.toUpperCase();
				sending();
			}
			else {
				toSend.message = info.message;
				sending();
			}
		}
		else if (info.hasOwnProperty("message") && info.message === null) {
			if () {
				clients.forEach(function (cl) {
					if (cl !== conn) {
						var announcement = info.name + " has joined the chat";
						var serial = {type: "announ", ann: announcement};
						cl.send(JSON.stringify(serial));
					}
					var userList = {type: "list", items: users};
					cl.send(JSON.stringify(userList));
				});

			}
		}
		else {
			if (info.type === "announ") {
				console.log(info.ann);
			}
			clients.forEach(function (cl) {
				var toSend = JSON.stringify(info);
				cl.send(toSend);
			});
		}
		
		
	});

	conn.on("close", function () {
		clients.splice(clients.indexOf(this), 1);
		console.log(clients.length + " users are in the chat.");
	});
});