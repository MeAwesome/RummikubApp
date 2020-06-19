function Player(){
  this.playerNumber = undefined;
  this.characterId = 0;
  this.showingScreen = undefined;
  this.showingKeyboard = false;
  this.nickname = "";
  this.code = "_ _ _ _";
  this.coords = {
    x:undefined,
    y:undefined
  }

  this.setPlayerNumber = function(num){
    this.playerNumber = num;
  }

  this.setPlayerNickname = function(name){
    this.nickname = name;
  }

  this.move = function(x, y){
    this.coords.x += x;
    this.coords.y += y;
  }

  this.moveTo = function(x, y){
    this.coords.x = x;
    this.coords.y = y;
  }

  this.draw = function(paint){
    paint.box(this.coords.x, this.coords.y, 100, 100, Color.black);
  }

  this.setCurrentScreen = function(s){
    this.showingScreen = s;
  }
}
