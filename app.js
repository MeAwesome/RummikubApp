var express = require("express");
var os = require("os");
var app = express();
var serv = require("http").Server(app);
var io = require("socket.io")(serv,{});
var port = process.env.PORT || 52470;
app.get("/", function(req, res){
	res.sendFile(__dirname + "/public/index.html");
});
app.use("/public", express.static(__dirname + "/public"));
serv.listen(port);
if(port != process.env.PORT){
	var __ConnectTo__ = os.networkInterfaces()["Wi-Fi"][1].address + ":" + port;
	console.clear();
	console.log("--> Webpage Started On } " + __ConnectTo__);
}



var connections = {};
var rooms = {};

io.on("connection", function(socket){

	connections[socket.id] = new Connection(socket);

	socket.emit("connected_to_server");

	socket.on("disconnect", () => {
		connections[socket.id].leaveRoom();
		delete connections[socket.id];
	});

	socket.on("create_room", () => {
		if(connections[socket.id].room == undefined){
			var r = new Room();
			rooms[r.getCode()] = r;
			connections[socket.id].joinRoom(r.getCode());
		}
	});

	socket.on("join_room", (code) => {
		connections[socket.id].joinRoom(code);
	});

	socket.on("leave_room", () => {
		connections[socket.id].leaveRoom();
	});

	socket.on("find_rooms", () => {
		var open_rooms = [];
		for(room in rooms){
			if(rooms[room].canJoin()){
				open_rooms.push(room);
			}
		}
		socket.emit("found_rooms", open_rooms);
	});

});

function Connection(socket){
	this.socket = socket;
	this.socketId = socket.id;
	this.room = undefined;

	this.joinRoom = function(room){
		if(rooms[room].canJoin() && this.room == undefined){
			rooms[room].addPlayer(this.socketId);
		}
	}

	this.leaveRoom = function(){
		if(this.room != undefined){
			rooms[this.room].removePlayer(this.socketId);
		}
	}

	this.getRoom = function(){
		return this.room;
	}
}

function Room(){
	this.metadata = {
		code:generateRoomCode(),
		players:[],
		maxPlayers:4
	};

	this.data = {

	}

	this.addPlayer = function(id){
		this.metadata.players.push(id);
		connections[id].room = this.metadata.code;
		connections[id].socket.emit("joined_room", this.getRoomMetadata());
	}

	this.removePlayer = function(id){
		for(var p = 0; p < this.metadata.players.length; p++){
			if(this.metadata.players[p] == id){
				this.metadata.players.splice(p, 1);
			}
		}
		connections[id].room = undefined;
		connections[id].socket.emit("left_room");
		if(this.metadata.players.length == 0){
			delete rooms[this.metadata.code];
		}
	}

	this.canJoin = function(){
		return this.metadata.players.length <= this.metadata.maxPlayers;
	}

	this.getRoomMetadata = function(){
		return this.metadata;
	}

	this.getCode = function(){
		return this.metadata.code;
	}
}

function generateRoomCode(){
	var code = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for(var i = 0; i < 4; i++){
   	code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
	for(var c = 0; c < Object.keys(rooms).length; c++){
		if(code == rooms[Object.keys(rooms)[c]].getCode()){
			generateRoomCode();
			return;
		}
	}
  return code;
}
