function onLoad(){
  me = new Player();
  game = new Paint("game");
  gameDisplay = new Paint("gameDisplay");
  join_btn = new Controller("rectangle-button", game);
  create_btn = new Controller("rectangle-button", game);
  logos = new Album();
  logos.addImages("/public/images/", ["Rummikub-Joker.png", "Rummikub-Logo.png"]);
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
  create_btn.setData("create", 150, 800, 400, 200, Color.blue);
  create_btn.setLabel("CREATE", 80, "Barlow", Color.white, "centered");
  tickCount = 0;
  runner();
}

function runner(){
  menuScreen();
  gameDisplay.copyData(game, 0, 0, gameDisplay.canvas.width, gameDisplay.canvas.height);
  tickCount = (tickCount + 1) % 60;
  window.requestAnimationFrame(runner);
}

function menuScreen(){
  game.fill(Color.grey);
  game.image(logos.photo("Rummikub-Logo"), 50, 50, 620, 203);
  join_btn.draw();
  create_btn.draw();
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
