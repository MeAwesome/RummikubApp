const Color = {
  white:"#FFFFFF",
  grey:"#222222",
  lightgrey:"#AAAAAA",
  silver:"#C0C0C0",
  black:"#000000",
  red:"#FF0000",
  green:"#00FF00",
  blue:"#0000FF",
  yellow:"#FFFF00",
  orange:"#FF8000",
  lightblue:"#007FFF",
  teal:"#00FFFF",
  purple:"#8B008B",
  felicity:"#008000",
  toHex:function(rgb){
    var hex = Number(rgb).toString(16);
    if(hex.length < 2){
         hex = "0" + hex;
    }
    return hex;
  },
  rgbToHex:function(r, g, b){
    return Color.toHex(r) + Color.toHex(g) + Color.toHex(b);
  }
}
