function Wave(src){
  this.src = src;
  this.id = this.src.substring(this.src.indexOf("sounds/") + 7, this.src.indexOf(".")).replace(/_/g, " ").replace(/-/g, " ");
  this.audio = document.createElement("audio");
  this.audio.src = this.src;
  this.audio.id = this.id;
  document.body.appendChild(this.audio);
  document.getElementById(this.id).load();

  this.play = function(){
    var original = document.getElementById(this.id);
    var clone = original.cloneNode(true);
    document.body.appendChild(clone);
    clone.play().catch(() =>{

    });
    clone.onend = function(){
      document.body.removeChild(clone);
    }
  }

  this.pause = function(){
    document.getElementById(this.id).pause();
  }

  this.stop = function(){
    document.getElementById(this.id).pause();
    this.currentTime = 0;
  }
}
