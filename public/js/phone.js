function onLoad(){
  touches = [];
  me = new Player();
  game = new Paint("game");
  gameDisplay = new Paint("gameDisplay");
  theme = new Wave("/public/sounds/Battle_Squids_Theme.mp3");
  keyboard = new Controller("keyboard", game);
  input_box = new Controller("input-box", game);
  left_joystick = new Controller("joystick", game);
  button_a = new Controller("circle-button", game);
  button_b = new Controller("circle-button", game);
  button_y = new Controller("circle-button", game);
  button_x = new Controller("circle-button", game);
  menu_join = new Controller("image-button", game);
  menu_create = new Controller("image-button", game);
  menu_profile = new Controller("rectangle-button", game);
  menu_back = new Controller("image-button", game);
  join_private = new Controller("rectangle-button", game);
  join_display = new Controller("rectangle-button", game);
  characters = new Characters();
  buttons = new Album();
  squid = new Album();
  man = new Album();
  buttons.addImages("/public/images/", [
    "join-button.png",
    "create-button.png",
    "back-button.png"
  ]);
  squid.addImages("/public/characters/squid/images/", [
    "idle-front.png",
    "idle-left-0.png",
    "idle-right-0.png"
  ]);
  man.addImages("/public/characters/man/images/", [
    "idle-front.png"
  ]);
  socket = io();
  bindSocketEvents();
}

function setup(){
  game.makeBuffer(gameDisplay);
  game.setSize(1280, 720);
  keyboard.setKeyData(Color.white);
  keyboard.setKeyLabelColor(Color.black);
  keyboard.setKeyHoldColors(Color.blue, Color.white);
  input_box.setData("textbox", 0, 0, 0, 0, Color.white, 0);
  input_box.setLabel("", 0, "Play", Color.black, "centered");
  left_joystick.setData("LS", 320, 360, 200, 150, Color.white, Color.black);
  button_a.setData("btn_a", 1140, 360, 100, Color.white);
  button_a.setLabel("A", 100, "Arial", Color.black);
  button_a.setHoldColors(Color.green, Color.white);
  button_b.setData("btn_b", 980, 560, 100, Color.white);
  button_b.setLabel("B", 100, "Arial", Color.black);
  button_b.setHoldColors(Color.red, Color.white);
  button_y.setData("btn_y", 820, 360, 100, Color.white);
  button_y.setLabel("Y", 100, "Arial", Color.black);
  button_y.setHoldColors(Color.yellow, Color.white);
  button_x.setData("btn_x", 980, 160, 100, Color.white);
  button_x.setLabel("X", 100, "Arial", Color.black);
  button_x.setHoldColors(Color.blue, Color.white);
  menu_join.setData("menu_join", buttons.photo("join-button"), 100, 104);
  menu_create.setData("menu_create", buttons.photo("create-button"), 668, 104);
  menu_profile.setData("menu_profile", 668, 424, 192, 192, Color.yellow);
  menu_profile.setLabel("Profile", 60, "Play", Color.white, "centered");
  menu_back.setData("menu_back", buttons.photo("back-button"), 0, 0);
  join_private.setData("join_private", 950, 100, 330, 250, Color.red);
  join_private.setLabel("Private", 60, "Play", Color.white, "centered");
  join_display.setData("join_display", 950, 370, 330, 250, Color.blue);
  join_display.setLabel("Display", 60, "Play", Color.white, "centered");
  game.setVisibility(false);
  gameDisplay.setSize(window.innerWidth, window.innerHeight);
  gameDisplay.setVisibility(true);
  tickCount = 0;
  me.setCurrentScreen("main menu");
  runner();
}

function runner(){
  switch(me.showingScreen){
    case "main menu":
      theme.play();
      menuScreen();
      break;
    case "join menu":
      theme.play();
      joinMenuScreen();
      break;
    case "edit profile":
      theme.play();
      profileScreen();
      break;
    case "private join menu":
      theme.play();
      joinPrivateRoomScreen();
      break;
    case "display join menu":
      theme.play();
      joinDisplayScreen();
      break;
    case "character selection":
      theme.stop();
      selectCharacter();
      break;
    case "controller":
      drawController();
      break;
    default:
      break;
  }
  gameDisplay.copyData(game, 0, 0, gameDisplay.canvas.width, gameDisplay.canvas.height);
  tickCount = (tickCount + 1) % 60;
  window.requestAnimationFrame(runner);
}

function menuScreen(){
  game.fill(Color.grey);
  menu_join.draw();
  menu_create.draw();
  menu_profile.draw();
  if(menu_join.pressed()){
    me.setCurrentScreen("join menu");
  }
  if(menu_profile.pressed()){
    input_box.setPosition(340, 20);
    input_box.setDimensions(600, 140);
    input_box.setLabelSize(100);
    input_box.setMaxLength(15);
    input_box.setLabelText("");
    input_box.setLabelPlaceholder("Nickname", Color.lightgrey);
    me.showingKeyboard = false;
    me.setCurrentScreen("edit profile");
  }
}

function joinMenuScreen(){
  game.fill(Color.grey);
  menu_back.draw();
  game.box(200, 100, 700, 520, Color.white);
  game.text("No Public Rooms Available", 550, 150, Color.black, 55, "Play", "centered");
  join_private.draw();
  join_display.draw();
  if(menu_back.pressed()){
    me.setCurrentScreen("main menu");
  }
  if(join_private.pressed()){
    me.setCurrentScreen("private join menu");
  }
  if(join_display.pressed()){
    input_box.setPosition(240, 20);
    input_box.setDimensions(800, 280);
    input_box.setLabelSize(160);
    input_box.setMaxLength(4);
    input_box.setLabelText("");
    input_box.setLabelPlaceholder("Code", Color.lightgrey);
    me.setCurrentScreen("display join menu");
  }
}

function profileScreen(){
  game.fill(Color.grey);
  menu_back.draw();
  if(me.showingKeyboard){
    input_box.setLabelText(input_box.getValue());
  } else {
    input_box.setLabelText(me.nickname);
  }
  input_box.draw();
  if(input_box.pressed()){
    me.showingKeyboard = true;
  }
  if(me.showingKeyboard){
    keyboard.draw();
    if(keyboard.key_enter.pressed()){
      me.showingKeyboard = false;
      me.nickname = input_box.getValue();
      keyboard.reset();
    }
    keyboard.keys.forEach((key) => {
      if(key.pressed()){
        if(keyboard.shifting){
          input_box.input(key.id.toUpperCase());
        } else {
          input_box.input(key.id);
        }
      }
    });
    if(keyboard.dismissed()){
      me.showingKeyboard = false;
    }
  }
  if(menu_back.pressed()){
    me.setCurrentScreen("main menu");
  }
}

function joinPrivateRoomScreen(){
  game.fill(Color.grey);
  menu_back.draw();
  if(menu_back.pressed()){
    me.setCurrentScreen("join menu");
  }
}

function joinDisplayScreen(){
  game.fill(Color.grey);
  menu_back.draw();
  input_box.draw();
  keyboard.draw();
  if(keyboard.key_enter.pressed()){
    socket.emit("join_room", input_box.getValue());
  }
  keyboard.keys.forEach((key) => {
    if(key.pressed() && key.id != "space" && isNaN(key.id)){
      if(keyboard.shifting){
        input_box.input(key.id.toUpperCase());
      } else {
        input_box.input(key.id);
      }
    }
  });
  if(menu_back.pressed()){
    keyboard.reset();
    me.setCurrentScreen("join menu");
  }
}

function selectCharacter(){
  game.fill(Color.black);
  game.polygon([
    [355, 360],
    [510, 20],
    [765, 20],
    [925, 360],
    [765,700],
    [510,700]
  ], Color.blue);
  game.polygon([
    [370, 360],
    [520, 35],
    [755, 35],
    [910, 360],
    [755,685],
    [520,685]
  ], Color.white);
  game.image(man.photo("idle-front"), 640, 360, "centered");
  if(input_box.pressed()){
    me.showingKeyboard = true;
  }
  if(me.showingKeyboard == true){
    keyboard.draw(game);
    keyboard.keys.forEach((key) => {
      if(key.pressed()){
        if(key.id == "backspace"){
          me.nickname = me.nickname.substring(0, me.nickname.length - 1);
        } else if(key.id == "shift"){
          return;
        } else if(key.id == "space"){
          me.nickname += " ";
          if(game.textWidth(me.nickname, input_box.labelSize, input_box.labelFont) >= input_box.w){
            me.nickname = me.nickname.substring(0, me.nickname.length - 1);
          }
        } else if(key.id == "enter"){
          me.showingKeyboard = false;
          keyboard.reset(game);
          socket.emit("update_player_metadata", {
            nickname:me.nickname
          });
        } else {
          if(keyboard.shifting){
            me.nickname += key.id.toUpperCase();
          } else {
            me.nickname += key.id;
          }
          if(game.textWidth(me.nickname, input_box.labelSize, input_box.labelFont) >= input_box.w){
            me.nickname = me.nickname.substring(0, me.nickname.length - 1);
          }
        }
      }
    });
    if(keyboard.dismissed(game)){
      me.showingKeyboard = false;
      socket.emit("update_player_metadata", {
        nickname:me.nickname
      });
    }
  }
}

function drawController(){
  game.fill(Color.black);
  left_joystick.draw(game);
  button_a.draw(game);
  button_b.draw(game);
  button_y.draw(game);
  button_x.draw(game);
  if(button_a.pressed()){
    socket.emit("button_hit", "A");
  }
  if(button_b.pressed()){
    socket.emit("button_hit", "B");
  }
  if(button_y.pressed()){
    socket.emit("button_hit", "Y");
  }
  if(button_x.pressed()){
    socket.emit("button_hit", "X");
  }
  if(left_joystick.held()){
    socket.emit("joystick_moved", left_joystick.getValues());
  }
}

function bindSocketEvents(){
  socket.on("connected_to_server", () => {
    setup();
  });

  socket.on("connected_to_room", () => {
    me.showingKeyboard = false;
    me.setCurrentScreen("character selection");
  });

  socket.on("invalid_room", () => {
    input_box.setLabelText("");
  });

  socket.on("host_disconnect", () =>{
    me.setCurrentScreen("main menu");
  });

  socket.on("disconnect", () => {

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

window.addEventListener("resize", () => {
  gameDisplay.setSize(window.innerWidth, window.innerHeight);
}, {passive:false});
window.addEventListener("orientationchange", () => {
  gameDisplay.setSize(window.innerWidth, window.innerHeight);
}, {passive:false});
window.addEventListener("touchstart", (e) => {
  try{
    //document.body.requestFullscreen().then(() => {}).catch(() => {});
    //document.body.webkitRequestFullscreen().then(() => {}).catch(() => {});
    //document.body.mozRequestFullscreen().then(() => {}).catch(() => {});
    //document.body.msRequestFullscreen().then(() => {}).catch(() => {});
  } catch {

  }
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
