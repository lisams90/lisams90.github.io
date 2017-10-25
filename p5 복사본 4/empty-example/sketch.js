var song;
var img;
var effect=[];

var pumpkin =[];
var veggie=[];

function preload(){
	song = loadSound('assets/bgm.mov');
	// effect[0]=loadSound('assets/bite.wav');
    effect[0]=loadSound('assets/yum.wav');
    effect[1]=loadSound('assets/yum2.wav');
    effect[2]=loadSound('assets/yum3.wav');

	img = loadImage("assets/illustration.jpg")
  veggie[0] =loadImage('assets/pumpkin.png');
  veggie[1]=loadImage('assets/bean.png');
    veggie[2]=loadImage('assets/asp.png');
      veggie[3]=loadImage('assets/avo.png');

}

function setup(){
  createCanvas(1210,603);


}
function keyTyped(){
  if(key=="s"){
  if ( song.isPlaying() ) { 
    song.stop();


  } else{
    song.loop();

  }
}

}

function mousePressed(){
	var r =floor(random(0,veggie.length));
  var p =new Pumpkin(mouseX, mouseY,veggie[r]);
  pumpkin.push(p);
if(pumpkin.push(p)){

var e =floor(random(0,effect.length));
effect[e].play();
}
else{
	effect[e].stop();
}


}

function draw(){
background(img);
  for(var i=pumpkin.length -1; i>=0; i--){
    
    pumpkin[i].update();
    pumpkin[i].display();

  }

}