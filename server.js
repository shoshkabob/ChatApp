var WSS = require("ws").Server;
var server = new WSS({port: 3000});
var notifier = require("node-notifier");
var clients = [];
var msgHist = [];
var x = 0;

server.on("connection", function (conn) {

	clients.push(conn);

	console.log(clients.length + " users are in the chat.");

	msgHist.forEach(function (msg) {
		conn.send(msg);
	});

	conn.on("message", function (input) {
		var info = JSON.parse(input);
		if (typeof info === 'object' && info.hasOwnProperty("message") && info.message !== null) {
			var message = info.name + ": " + info.message;
			var toSend = {name: info.name, message: info.message, color: info.color };
			function sending() {
				var sendMsg = JSON.stringify(toSend);
				clients.forEach(function (cl) {
					cl.send(sendMsg);
				});
				msgHist.push(JSON.stringify(toSend));
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
		else {
			var toSend = JSON.stringify(info);
			clients.forEach(function (cl) {
				cl.send(toSend);
			});
		}
		
		
	});

	conn.on("close", function () {
		clients.splice(clients.indexOf(this), 1);
		console.log(clients.length + " users are in the chat.");
	});
});