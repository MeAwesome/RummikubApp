function onLoad(){
  fullscreen = false;
  me = new Host();
  game = new Paint("game");
  theme = new Wave("/public/sounds/Battle_Squids_Theme.mp3");
  gameDisplay = new Paint("gameDisplay");
  squid = new Album();
  squid.addImages("/public/characters/squid/images/", [
    "idle-front.png",
    "idle-left-0.png",
    "idle-right-0.png"
  ]);
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
  me.setCurrentScreen("title");
  runner();
}

function runner(){
  switch(me.showingScreen){
    case "title":
      theme.play();
      titleScreen();
      break;
    case "connect":
      theme.play();
      connectScreen();
      break;
    case "main menu":
      menuScreen();
      break;
    case "server disconnected":
      serverDisconnectScreen();
      break
    default:
      break;
  }
  gameDisplay.copyData(game, 0, 0, gameDisplay.canvas.width, gameDisplay.canvas.height);
  tickCount = (tickCount + 1) % 60;
  window.requestAnimationFrame(runner);
}

function titleScreen(){
  game.fill(Color.grey);
  game.polygon([
    [0, 720],
    [0, 220],
    [200, 520],
    [500, 720]
  ], Color.blue);
  game.polygon([
    [1280, 720],
    [1280, 220],
    [1080, 520],
    [780, 720]
  ], Color.blue);
  game.text("Battle", 640, 100, Color.blue, 150, "Play", "centered");
  game.text("Squids", 640, 250, Color.white, 200, "Play", "centered");
  game.image(squid.photo("idle-front"), 640, 475, 256, 256, "centered");
  game.text("Press Anything", 640, 660 + (Math.sin(tickCount) * 2), Color.white, 50, "Play", "centered");
}

function connectScreen(){
  game.fill(Color.grey);
  game.text("Play On This Display", 640, 100, Color.white, 125, "Play", "centered");
  game.polygon([
    [150, 200],
    [1130, 200],
    [1180, 250],
    [1180, 550],
    [1130, 600],
    [150, 600],
    [100, 550],
    [100, 250]
  ], Color.blue);
  game.text(me.code, 640, 410, Color.white, 300, "Play", "centered");
  game.text("JOIN  >  DISPLAY", 640, 660, Color.white, 50, "Play", "centered");
}

function menuScreen(){
  game.fill(Color.grey);
  var c = ["blue", "red", "yellow", "green"];
  if(me.players.length < 5){
    for(var p = 0; p < me.players.length; p++){
      game.box(p * (game.canvas.width / me.players.length), 0, (game.canvas.width / me.players.length), 480, Color[c[p]]);
      game.box(p * (game.canvas.width / me.players.length) + 15, 15, (game.canvas.width / me.players.length) - 30, 450, Color.grey);
    }
  }
}

function serverDisconnectScreen(){
  game.fill(Color.red);
}

function bindSocketEvents(){
  socket.on("connected_to_server", () => {
    setup();
  });

  socket.on("room_metadata", (data) => {
    me.setData(data.code, Object.values(data.players));
  });

  socket.on("first_player_connected", () => {
    me.setCurrentScreen("main menu");
  });

  socket.on("disconnect", () => {
    me.setCurrentScreen("server disconnected");
  });
}

function goFullscreen(){
  if(fullscreen == false){
    socket.emit("create_room", "display");
    me.setCurrentScreen("connect");
    fullscreen = true;
  }
}

window.addEventListener("resize", () => {
  gameDisplay.setSize(window.innerWidth, window.innerHeight);
}, {passive:false});
window.addEventListener("orientationchange", () => {
  gameDisplay.setSize(window.innerWidth, window.innerHeight);
}, {passive:false});
window.addEventListener("keydown", (e) => {
    document.body.requestFullscreen().then(() => {
      goFullscreen();
    }).catch(() => {});
    document.body.webkitRequestFullscreen().then(() => {
      goFullscreen();
    }).catch(() => {});
    document.body.mozRequestFullscreen().then(() => {
      goFullscreen();
    }).catch(() => {});
    document.body.msRequestFullscreen().then(() => {
      goFullscreen();
    }).catch(() => {});
}, {passive:false});
window.addEventListener("mousedown", (e) => {
    document.body.requestFullscreen().then(() => {
      goFullscreen();
    }).catch(() => {});
    document.body.webkitRequestFullscreen().then(() => {
      goFullscreen();
    }).catch(() => {});
    document.body.mozRequestFullscreen().then(() => {
      goFullscreen();
    }).catch(() => {});
    document.body.msRequestFullscreen().then(() => {
      goFullscreen();
    }).catch(() => {});
}, {passive:false});
window.addEventListener("touchstart", (e) => {
    document.body.requestFullscreen().then(() => {
      goFullscreen();
    }).catch(() => {});
    document.body.webkitRequestFullscreen().then(() => {
      goFullscreen();
    }).catch(() => {});
    document.body.mozRequestFullscreen().then(() => {
      goFullscreen();
    }).catch(() => {});
    document.body.msRequestFullscreen().then(() => {
      goFullscreen();
    }).catch(() => {});
  e.preventDefault();
}, {passive:false});
window.addEventListener("touchmove", (e) => {
	e.preventDefault();
}, {passive:false});
window.addEventListener("touchend", (e) => {
	e.preventDefault();
}, {passive:false});
window.addEventListener("touchcancel", (e) => {
	e.preventDefault();
}, {passive:false});
