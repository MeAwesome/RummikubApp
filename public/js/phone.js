function onLoad(){
  touches = [];
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
  logos = new Album();
  icons = new Album();
  logos.addImages("/public/images/", ["Rummikub-Joker.png", "Rummikub-Logo.png"]);
  icons.addImages("/public/images/", ["Profile.png", "Settings.png"]);
  click_wav = new Wave("/public/sounds/button-click.mp3");
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
  tickCount = 0;
  showingScreen = "main menu";
  open_rooms = [];
  currentPage = 0;
  currentRoom = undefined;
  currentRoomMetaData = undefined;
  currentRoomData = undefined;
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
    case "game menu passive":
      gameScreen(false);
      break;
    case "game menu active":
      gameScreen(true);
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
    click_wav.stop();
    click_wav.play();
    socket.emit("find_rooms");
    showingScreen = "join menu";
  }
  if(create_btn.pressed()){
    click_wav.stop();
    click_wav.play();
    socket.emit("create_room");
  }
  if(settings_btn.pressed()){
    click_wav.stop();
    click_wav.play();
    showingScreen = "settings menu";
  }
  if(profile_btn.pressed()){
    click_wav.stop();
    click_wav.play();
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
    click_wav.stop();
    click_wav.play();
    if(room1_btn.label != "----"){
      socket.emit("join_room", room1_btn.label);
    }
  }
  if(room2_btn.pressed()){
    click_wav.stop();
    click_wav.play();
    if(room2_btn.label != "----"){
      socket.emit("join_room", room2_btn.label);
    }
  }
  if(room3_btn.pressed()){
    click_wav.stop();
    click_wav.play();
    if(room3_btn.label != "----"){
      socket.emit("join_room", room3_btn.label);
    }
  }
  if(room4_btn.pressed()){
    click_wav.stop();
    click_wav.play();
    if(room4_btn.label != "----"){
      socket.emit("join_room", room4_btn.label);
    }
  }
  if(home_btn.pressed()){
    click_wav.stop();
    click_wav.play();
    showingScreen = "main menu";
  }
}

function lobbyScreen(){
  game.fill(Color.grey);
  game.text(currentRoom, 360, 125, Color.red, 100, "Barlow", "centered");
  for(var player = 0; player < currentRoomMetaData.players.length; player++){
    game.text(currentRoomMetaData.players[player], 360, 250 + (100 * player), Color.white, 50, "Barlow", "centered");
  }
  if(currentRoomMetaData.players.length > 1){
    start_btn.draw();
  }
  home_btn.draw();
  if(start_btn.pressed()){
    click_wav.stop();
    click_wav.play();
    socket.emit("start_game");
  }
  if(home_btn.pressed()){
    click_wav.stop();
    click_wav.play();
    socket.emit("leave_room");
  }
}

function gameScreen(playing){
  game.fill(Color.grey);
  if(playing){
    end_turn_btn.draw();
    end_game_btn.draw();
    if(end_turn_btn.pressed()){
      socket.emit("end_turn");
    }
    if(end_game_btn.pressed()){
      socket.emit("end_game");
    }
  } else {
    game.text("Currently Player " + (currentRoomData.currentPlayer + 1) + "'s Turn", 360, 640, Color.white, 50, "Barlow", "centered");
  }
}

function bindSocketEvents(){
  socket.on("connected_to_server", () => {
    setup();
  });

  socket.on("joined_room", (data) => {
    currentRoom = data.code;
    currentRoomMetaData = data;
    showingScreen = "lobby menu";
  });

  socket.on("left_room", () => {
    currentRoom = undefined;
    currentRoomMetaData = undefined;
    currentRoomData = undefined;
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
    showingScreen = "game menu active";
  });

  socket.on("ended_turn", () => {
    showingScreen = "game menu passive";
  });

  socket.on("disconnect", () => {
    color = Color.red;
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
