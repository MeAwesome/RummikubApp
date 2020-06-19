function Wave(src){
  this.src = src;
  this.id = this.src.substring(this.src.indexOf("sounds/") + 7, this.src.indexOf(".")).replace(/_/g, " ").replace(/-/g, " ");
  this.audio = document.createElement("audio");
  this.audio.src = this.src;
  this.audio.id = this.id;
  document.body.appendChild(this.audio);
  document.getElementById(this.id).load();

  this.play = function(){
    document.getElementById(this.id).play().catch(() =>{

    });
  }

  this.pause = function(){
    document.getElementById(this.id).pause();
  }

  this.stop = function(){
    document.getElementById(this.id).pause();
    this.currentTime = 0;
  }
}