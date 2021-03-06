function onLoad(){
  touches = [];
  noSleep = new NoSleep();
  me = new Player();
  game = new Paint("game");
  gameDisplay = new Paint("gameDisplay");
  join_btn = new Controller("rectangle-button", game);
  create_btn = new Controller("rectangle-button", game);
  profile_btn = new Controller("circle-button", game);
  settings_btn = new Controller("circle-button", game);
  home_btn = new Controller("image-button", game);
  room1_btn = new Controller("rectangle-button", game);
  room2_btn = new Controller("rectangle-button", game);
  room3_btn = new Controller("rectangle-button", game);
  room4_btn = new Controller("rectangle-button", game);
  start_btn = new Controller("rectangle-button", game);
  end_turn_btn = new Controller("circle-button", game);
  end_game_btn = new Controller("circle-button", game);
  refresh_btn = new Controller("rectangle-button", game);
  logos = new Album();
  icons = new Album();
  logos.addImages("/public/images/", ["Rummikub-Joker.png", "Rummikub-Logo.png"]);
  icons.addImages("/public/images/", ["Profile.png", "Settings.png"]);
  click_wav = new Wave("/public/sounds/button-click.mp3");
  end_turn_wav = new Wave("/public/sounds/end-turn.mp3");
  celebration_wav = new Wave("/public/sounds/celebration.mp3");
  socket = io();
  bindSocketEvents();
}

function setup(){
  game.makeBuffer(gameDisplay);
  game.setSize(720, 1280);
  game.setVisibility(false);
  gameDisplay.setSize(window.innerWidth, window.innerHeight);
  gameDisplay.setVisibility(true);
  join_btn.setData("join", 150, 400, 400, 200, Color.red);
  join_btn.setLabel("JOIN", 80, "Barlow", Color.white, "centered");
  create_btn.setData("create", 150, 700, 400, 200, Color.blue);
  create_btn.setLabel("CREATE", 80, "Barlow", Color.white, "centered");
  profile_btn.setData("profile", 550, 1150, 100, Color.yellow);
  profile_btn.setHoldColors(Color.yellow, Color.black);
  settings_btn.setData("settings", 150, 1150, 100, Color.black);
  home_btn.setData("home", logos.photo("Rummikub-Joker"), 285, 1000, 150, 150);
  room1_btn.setData("room1", 100, 400, 200, 100, Color.white);
  room1_btn.setLabel("----", 80, "Barlow", Color.black, "centered");
  room2_btn.setData("room2", 420, 400, 200, 100, Color.white);
  room2_btn.setLabel("----", 80, "Barlow", Color.black, "centered");
  room3_btn.setData("room3", 100, 700, 200, 100, Color.white);
  room3_btn.setLabel("----", 80, "Barlow", Color.black, "centered");
  room4_btn.setData("room4", 420, 700, 200, 100, Color.white);
  room4_btn.setLabel("----", 80, "Barlow", Color.black, "centered");
  start_btn.setData("start", 235, 800, 250, 150, Color.green);
  start_btn.setLabel("START", 70, "Barlow", Color.black, "centered");
  end_turn_btn.setData("end-turn", 360, 427, 300, Color.red);
  end_turn_btn.setLabel("END TURN", 90, "Barlow", Color.black);
  end_turn_btn.setHoldColors(Color.black, Color.red);
  end_game_btn.setData("end-game", 360, 1000, 200, Color.blue);
  end_game_btn.setLabel("END GAME", 60, "Barlow", Color.black);
  end_game_btn.setHoldColors(Color.black, Color.blue);
  refresh_btn.setData("refresh", 210, 900, 300, 150, Color.yellow);
  refresh_btn.setLabel("REFRESH", 70, "Barlow", Color.black, "centered");
  tickCount = 0;
  showingScreen = "main menu";
  open_rooms = [];
  currentPage = 0;
  currentRoom = undefined;
  currentRoomMetaData = undefined;
  currentRoomData = undefined;
  endedTurn = false;
  winner = undefined;
  runner();
}

function runner(){
  switch(showingScreen){
    case "main menu":
      menuScreen();
      break;
    case "join menu":
      joinScreen();
      break;
    case "lobby menu":
      lobbyScreen();
      break;
    case "settings menu":
      settingsScreen();
      break;
    case "profile menu":
      profileScreen();
      break;
    case "game menu passive":
      gameScreen(false);
      break;
    case "game menu active":
      gameScreen(true);
      break;
    case "win menu":
      winScreen();
      break;
    case "error menu":
      errorScreen();
      break;
    default:
      menuScreen();
      break;
  }
  gameDisplay.copyData(game, 0, 0, gameDisplay.canvas.width, gameDisplay.canvas.height);
  tickCount = (tickCount + 1) % 60;
  window.requestAnimationFrame(runner);
}

function menuScreen(){
  game.fill(Color.grey);
  game.image(logos.photo("Rummikub-Logo"), 50, 75, 620, 203);
  join_btn.draw();
  create_btn.draw();
  settings_btn.draw();
  game.image(icons.photo("Settings"), 55, 1055, 190, 190);
  profile_btn.draw();
  game.image(icons.photo("Profile"), 450, 1050, 200, 200);
  if(join_btn.pressed()){
    buttonSound("menu");
    socket.emit("find_rooms");
    showingScreen = "join menu";
  }
  if(create_btn.pressed()){
    buttonSound("menu");
    socket.emit("create_room");
  }
  if(settings_btn.pressed()){
    buttonSound("menu");
    showingScreen = "settings menu";
  }
  if(profile_btn.pressed()){
    buttonSound("menu");
    showingScreen = "profile menu";
  }
}

function joinScreen(){
  game.fill(Color.grey);
  game.text("Select Room Code", 360, 125, Color.white, 90, "Barlow", "centered");
  room1_btn.draw();
  room2_btn.draw();
  room3_btn.draw();
  room4_btn.draw();
  home_btn.draw();
  var room_btns = [room1_btn, room2_btn, room3_btn, room4_btn];
  for(var room = 0; room < 4; room++){
    if(room + (4 * currentPage) < open_rooms.length){
      room_btns[room].setLabelText(open_rooms[room + (4 * currentPage)]);
    } else {
      room_btns[room].setLabelText("----");
    }
  }
  if(room1_btn.pressed()){
    buttonSound("menu");
    if(room1_btn.label != "----"){
      socket.emit("join_room", room1_btn.label);
    }
  }
  if(room2_btn.pressed()){
    buttonSound("menu");
    if(room2_btn.label != "----"){
      socket.emit("join_room", room2_btn.label);
    }
  }
  if(room3_btn.pressed()){
    buttonSound("menu");
    if(room3_btn.label != "----"){
      socket.emit("join_room", room3_btn.label);
    }
  }
  if(room4_btn.pressed()){
    buttonSound("menu");
    if(room4_btn.label != "----"){
      socket.emit("join_room", room4_btn.label);
    }
  }
  if(home_btn.pressed()){
    buttonSound("menu");
    showingScreen = "main menu";
  }
}

function lobbyScreen(){
  game.fill(Color.grey);
  game.text(currentRoom, 360, 125, Color.red, 100, "Barlow", "centered");
  for(var player = 0; player < currentRoomMetaData.players.length; player++){
    game.text(currentRoomMetaData.players[player].name, 360, 250 + (100 * player), Color.white, 50, "Barlow", "centered");
  }
  if(currentRoomMetaData.players.length > 1){
    start_btn.draw();
  }
  home_btn.draw();
  if(start_btn.pressed()){
    buttonSound("menu");
    socket.emit("start_game");
  }
  if(home_btn.pressed()){
    buttonSound("menu");
    socket.emit("leave_room");
  }
}

function settingsScreen(){
  game.fill(Color.grey);
  home_btn.draw();
  if(home_btn.pressed()){
    buttonSound("menu");
    showingScreen = "main menu";
  }
}

function profileScreen(){
  game.fill(Color.grey);
  home_btn.draw();
  if(home_btn.pressed()){
    buttonSound("menu");
    showingScreen = "main menu";
  }
}

function gameScreen(playing){
  game.fill(Color.grey);
  if(playing && endedTurn == false){
    end_turn_btn.draw();
    game.text(currentRoomData.timeLeft, 360, 527, Color.black, 70, "Barlow", "centered");
    end_game_btn.draw();
    if(end_turn_btn.pressed()){
      endedTurn = true;
      socket.emit("end_turn");
      buttonSound("end turn");
    }
    if(end_game_btn.pressed()){
      socket.emit("end_game");
    }
  } else {
    game.text("Currently " + currentRoomMetaData.players[currentRoomData.currentPlayer].name + "'s Turn", 360, 640, Color.white, 50, "Barlow", "centered");
  }
}

function winScreen(){
  game.fill(Color.grey);
  game.text(winner, 360, 640, Color.yellow, 70, "Barlow", "centered");
  game.text("Is The Winner!", 360, 740, Color.white, 50, "Barlow", "centered");
  home_btn.draw();
  if(home_btn.pressed()){
    buttonSound("menu");
    endedTurn = false;
    socket.emit("leave_room");
  }
}

function errorScreen(){
  game.fill(Color.red);
  game.text("An Error Occured", 360, 640, Color.white, 50, "Barlow", "centered");
  refresh_btn.draw();
  if(refresh_btn.pressed()){
    window.location.reload();
  }
}

function buttonSound(type){
  switch(type){
    case "menu":
      click_wav.play();
      break;
    case "end turn":
      end_turn_wav.play();
      break;
    case "end game":
      celebration_wav.play();
      break;
  }
}

function bindSocketEvents(){
  socket.on("connected_to_server", () => {
    setup();
  });

  socket.on("joined_room", (data) => {
    currentRoom = data.code;
    currentRoomMetaData = data;
    winner = undefined;
    showingScreen = "lobby menu";
  });

  socket.on("left_room", () => {
    currentRoom = undefined;
    currentRoomMetaData = undefined;
    currentRoomData = undefined;
    winner = undefined;
    showingScreen = "main menu";
  });

  socket.on("found_rooms", (rooms) => {
    open_rooms = rooms;
  });

  socket.on("update_room", (d) => {
    currentRoomMetaData = d.metadata;
    currentRoomData = d.data;
  });

  socket.on("started_game", () => {
    showingScreen = "game menu passive";
  });

  socket.on("current_turn", () => {
    endedTurn = false;
    showingScreen = "game menu active";
  });

  socket.on("ended_turn", () => {
    endedTurn = false;
    showingScreen = "game menu passive";
  });

  socket.on("ended_game", (victor) => {
    winner = victor;
    showingScreen = "win menu";
    buttonSound("end game");
  });

  socket.on("disconnect", () => {
    showingScreen = "error menu";
    socket.disconnect();
  });
}

function touchesToCoords(e){
  var widthRatio = game.canvas.width / gameDisplay.canvas.width;
  var heightRatio = game.canvas.height / gameDisplay.canvas.height;
  for(var t = 0; t < e.touches.length; t++){
    touches[t] = {
      x:e.touches[t].clientX * widthRatio,
      y:e.touches[t].clientY * heightRatio
    };
  }
  if(e.touches.length == 0){
    touches = [];
  }
}

window.onload = function(){
  onLoad();
}

window.addEventListener("resize", () => {
  gameDisplay.setSize(window.innerWidth, window.innerHeight);
}, {passive:false});
window.addEventListener("orientationchange", () => {
  gameDisplay.setSize(window.innerWidth, window.innerHeight);
}, {passive:false});
window.addEventListener("touchstart", (e) => {
	e.preventDefault();
  touchesToCoords(e);
	checkPaintTouches(e);
}, {passive:false});
window.addEventListener("touchmove", (e) => {
	e.preventDefault();
  touchesToCoords(e);
	checkPaintTouches(e);
}, {passive:false});
window.addEventListener("touchend", (e) => {
	e.preventDefault();
  touchesToCoords(e);
	checkPaintTouches(e);
}, {passive:false});
window.addEventListener("touchcancel", (e) => {
	e.preventDefault();
  touchesToCoords(e);
	checkPaintTouches(e);
}, {passive:false});
document.addEventListener('touchstart', function enableNoSleep() {
  document.removeEventListener('touchstart', enableNoSleep, false);
  noSleep.enable();
}, false);
