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
		delete connections[socket.id];
	});

	socket.on("create_room", (type) => {
		var r = new Room(socket.id, type);
		rooms[r.getCode()] = r;
		socket.emit("room_metadata", r.getRoomMetadata());
	});

});

function Connection(socket){
	this.socket = socket;
	this.socketId = socket.id;
	this.room = undefined;
	this.isHost = false;
	this.isPlayer = false;

	this.updateRoomInfo = function(room, isHost){
		this.room = room;
		this.isHost = isHost;
	}

	this.getRoom = function(){
		return this.room;
	}
}

function Room(hostId, type){
	this.metadata = {
		host:hostId,
		type:type,
		code:generateRoomCode(),
		players:{},
		maxPlayers:8
	};

	this.data = {

	}

	this.addPlayer = function(playerId){
		this.metadata.players[playerId] = new Player(playerId, Object.keys(this.metadata.players));
		this.sendToHost("room_metadata", this.metadata);
	}

	this.removePlayer = function(playerId){
		connections[playerId].room = undefined;
		delete this.metadata.players[playerId];
	}

	this.removeAllPlayers = function(){
		for(var p = 0; p < Object.keys(this.metadata.players).length; p++){
			connections[this.metadata.players[Object.keys(this.metadata.players)[p]].id].room = undefined;
		}
		this.metadata.players = {};
	}

	this.totalPlayers = function(){
		return Object.keys(this.metadata.players).length
	}

	this.canJoin = function(){
		return  this.totalPlayers() < this.metadata.maxPlayers;
	}

	this.getRoomMetadata = function(){
		return this.metadata;
	}

	this.getCode = function(){
		return this.metadata.code;
	}

	this.sendToPlayers = function(name, data){
		for(var p = 0; p < Object.keys(this.metadata.players).length; p++){
			connections[this.metadata.players[Object.keys(this.metadata.players)[p]].id].socket.emit(name, data);
		}
	}

	this.sendToHost = function(name, data){
		connections[this.metadata.host].socket.emit(name, data);
	}

	this.updateMetadata = function(data){
		for(var m = 0; m < Object.keys(data).length; m++){
			this.metadata[Object.keys(data)[m]] = data[Object.keys(data)[m]];
		}
		this.sendToHost("room_metadata", this.metadata);
	}

	this.updatePlayerMetadata = function(player, data){
		var me = this.metadata.players[player];
		me.changeNickname(data.nickname);
		this.sendToHost("room_metadata", this.metadata);
	}

	connections[hostId].updateRoomInfo(this.metadata.code, true);
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

function Player(socketId, players){
	this.id = socketId;
	this.playerNumber = players.length;
	this.defaultNickname = "Player " + (players.length + 1);
	this.nickname = "Player " + (players.length + 1);

	this.changeNickname = function(name){
		name = name.trim();
		if(name == ""){
			this.nickname = this.defaultNickname;
		} else {
			this.nickname = name;
		}
	}
}
