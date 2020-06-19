function onLoad(){
  me = new Player();
  game = new Paint("game");
  gameDisplay = new Paint("gameDisplay");
  socket = io();
  bindSocketEvents();
}

function setup(){
  game.makeBuffer(gameDisplay);
  game.setSize(1280, 720);
  game.setVisibility(false);
  gameDisplay.setSize(window.innerWidth, window.innerHeight);
  gameDisplay.setVisibility(true);
  tickCount = 0;
  color = Color.red;
  runner();
}

function runner(){
  menuScreen();
  gameDisplay.copyData(game, 0, 0, gameDisplay.canvas.width, gameDisplay.canvas.height);
  tickCount = (tickCount + 1) % 60;
  window.requestAnimationFrame(runner);
}

function menuScreen(){
  game.fill(color);
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

  });
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
