function Host(){
  this.code = undefined;
  this.players = undefined;
  this.gameRunning = false;
  this.showingScreen = undefined;

  this.setData = function(code, players){
    this.code = code;
    this.players = players;
  }

  this.setCurrentScreen = function(s){
    this.showingScreen = s;
  }
}
