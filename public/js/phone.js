function onLoad(){
  touches = [];
  me = new Player();
  game = new Paint("game");
  gameDisplay = new Paint("gameDisplay");
  join_btn = new Controller("rectangle-button", game);
  create_btn = new Controller("rectangle-button", game);
  profile_btn = new Controller("circle-button", game);
  settings_btn = new Controller("circle-button", game);
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
  input_box = document.createElement("INPUT");
  input_box.setAttribute("type", "submit");
  input_box.setAttribute("defaultValue", "ROOM CODE");
  input_box.style.display = "none";
  tickCount = 0;
  showingScreen = "main menu";
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
    showingScreen = "join menu";
  }
  if(create_btn.pressed()){
    click_wav.stop();
    click_wav.play();
    showingScreen = "create menu";
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
  game.text("Enter Room Code", 360, 125, Color.white, 90, "Barlow", "centered");
  input_box.style.display = "block";
}

function bindSocketEvents(){
  socket.on("connected_to_server", () => {
    setup();
  });

  socket.on("joined_room", () => {
    color = Color.green;
  });

  socket.on("left_room", () => {
    color = Color.red;
  });

  socket.on("room_code", (code) => {
    console.log(code);
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
