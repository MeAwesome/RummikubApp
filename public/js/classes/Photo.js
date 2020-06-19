const photos = [];
const albums = [];

function Photo(src){
  this.loaded = false;
  this.src = src;
  this.img = new Image();
  this.img.src = src;
  this.width = 0;
  this.height = 0;

  var me = this;

  this.img.onload = function(){
    me.width = this.width;
    me.height = this.height;
    me.loaded = true;
  }

  this.image = function(){
    return this.img;
  }

  photos.push(this);
}

function Album(){
  this.loaded = false;
  this.photos = {};

  this.addImages = async function(path, names){
    for(var p = 0; p < names.length; p++){
      this.photos[names[p].substring(0, names[p].indexOf("."))] = new Photo(path + names[p]);
    }
    await loadAllPhotos();
    this.loaded = true;
  }

  this.photo = function(name){
    return this.photos[name];
  }
}

function loadAllPhotos(){
  return new Promise((resolve) => {
    var loaded = setInterval(() => {
      var unloaded = 0;
      for(var p = 0; p < photos.length; p++){
        if(photos[p].loaded == false){
          unloaded++;
        }
      }
      for(var a = 0; a < albums.length; a++){
        if(albums[a].loaded == false){
          unloaded++;
        }
      }
      if(unloaded == 0){
        clearInterval(loaded);
        resolve();
      }
    }, 100, loaded);
  });
}
