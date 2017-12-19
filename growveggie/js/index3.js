var canvas = document.getElementById("canvas"),
    w = canvas.width = window.innerWidth-150,
    h = canvas.height = window.innerHeight-150

var dropZone = document.getElementById("drop-zone"),
    successCallback = document.querySelector(".success-callback"),
    playButton = document.getElementById("pplay")

window.onload = function(){
  loadSound()
}

// register sounds
var collision = "collision",
    collision2 = "collision2",
    process = "process",
    process2 = "process2",
    win = "win",
    error = "error"

function loadSound () {
  // createjs.Sound.registerSound("https://s3-us-west-2.amazonaws.com/s.cdpn.io/111167/collision.wav", collision, 1);
  createjs.Sound.registerSound("https://s3-us-west-2.amazonaws.com/s.cdpn.io/111167/collision2.wav", collision2, 1);  
  createjs.Sound.registerSound("https://s3-us-west-2.amazonaws.com/s.cdpn.io/111167/win.wav", win, 1);
  // createjs.Sound.registerSound("https://s3-us-west-2.amazonaws.com/s.cdpn.io/111167/error.wav", error, 1);
  createjs.Sound.registerSound("https://s3-us-west-2.amazonaws.com/s.cdpn.io/111167/process2.wav", process2, 1);
}

// stage inits
var stage = new createjs.Stage("canvas")
// enabling mouse event
stage.enableMouseOver()
// enabling touch
createjs.Touch.enable(stage)

// ripples
var ripples = [],
    shadowRipples = [],
    ripplesLength = 2


// circle init
var circle = new createjs.Shape()
circle.width = 60
// circle.graphics.beginFill("#2c3e50")
circle.graphics.drawCircle(0, 0, circle.width)

// shadow circle init
var shadowCircle = new createjs.Shape()
shadowCircle.width = 80
shadowCircle.graphics.beginFill("#E60012")
shadowCircle.graphics.drawCircle(0, 0, shadowCircle.width)

var shadowCircleCtr = new createjs.Container().addChild(shadowCircle)
shadowCircleCtr.x = w/2-160
shadowCircleCtr.y = h/2
shadowCircleCtr.alpha = 0

var circleCtr = new createjs.Container().addChild(circle)
circleCtr.x = w/2-160
circleCtr.y = h/2
circleCtr.status = false

// circleCtr.cache(w/2, h/2, circle.width * 2, circle.width * 2)

// images
var imagesArray = [],
    propsArray = [],
    imagesLength = 1

function drawImage(posX, posY, index){
  
  // image init
  var image = new Image()
  // the images are from external js file
  image.src = characters[index]
  var bitmap = new createjs.Bitmap(image)
  
  var bitmapCtr = new createjs.Container().addChild(bitmap)
  
  var bitmapProps = {
    width: 128,
    height: 128,
    rotation: -6,
    // oriX: posX,
    // oriY: posY
  }

  bitmapCtr.x = posX
  bitmapCtr.y = posY
  // bitmapCtr.oriX = posX
  // bitmapCtr.oriY = posY
  // bitmapCtr.rotation = bitmapProps.rotation
  
  if(index == 0){
    bitmapCtr.key = true
  } else {
    bitmapCtr.key = false
  }

  // transform origin center
  bitmapCtr.regX = bitmapProps.width/2
  bitmapCtr.regY = bitmapProps.height/2
  
  imagesArray.push(bitmapCtr)
  propsArray.push(bitmapProps)
  
  stage.addChild(bitmapCtr)
    
}

// var sines = [w/2 - 300, w/2 - 300, w/2 + 300, w/2 + 300],
//     coses = [h - h/1.5, h - h/3.5,  h - h/3.5,  h - h/1.5]

var sines = [w/2-385], //맨 처음 마리오 위치
    coses = [h - h/1.5]

drawImage(sines[0], coses[0], 0)


// put elements to stage
stage.addChild(circleCtr, shadowCircleCtr)

// animation listener
TweenMax.ticker.addEventListener("tick", stage.update, stage)

function scaleIt(el, x, y, duration, ease){
  TweenMax.to(el, duration, {
    scaleX: x,
    scaleY: y,
    ease: ease,
  })
}

function scaleRipples(arr, x, y, duration, staggerDelay, delay, ease){
  var tl = new TimelineMax({})
  
  tl.staggerTo(arr, .6, {
    delay: delay,
    scaleX: x,
    scaleY: y,
    ease: ease,
    onComplete: function(){
      tl.stop()
    }
  }, staggerDelay)
}

function scaleAlpha(el, x, y, alpha, duration){
  TweenMax.to(el, duration, {
    scaleX: x,
    scaleY: y,
    alpha: alpha,
    ease: Elastic.easeOut.config(1, 0.75),
  })
}

// function back(el, posX, posY, delay){
  
//   var tlTemp = new TimelineMax({})
  
//   tlTemp.to(el, .6, {
//     delay: delay,
//     x: posX,
//     y: posY,
//     ease: Elastic.easeOut.config(1, 0.75)
//   })
    
// }

var hit = false;
var bolehjalan = false;

// start image array loop
[].forEach.call(imagesArray, function(imageCtr, index){
    
  var tlImage = new TimelineMax({
    repeat: -1,
    yoyo: true
  })
  
  tlImage.to(imageCtr, .9, {
    delay: index * 0.2,
    rotation: propsArray[index].rotation * -1,
    ease: Power4.easeInOut
  })
  
  var tlRipple = new TimelineMax({})
  
  imageCtr.on("pressmove", function(e){

    tlImage.stop()
  
    var el = e.currentTarget
    
    // z index top
    stage.setChildIndex(el, stage.getNumChildren()-1)

    if(!hit) {
      
      scaleIt(el, .8, .8, 0.6, Power4.easeOut)

      TweenMax.to(el, .15, {
        x: e.stageX,
        y: e.stageY
      })
      
      var intersection = ndgmr.checkRectCollision(el, circleCtr)
                        
      doHit(intersection, e)
      
    }
  })


  imageCtr.on("pressup", function(e){

    var el = e.currentTarget
    
    if(bolehjalan) {
      
      scaleIt(el, 0.25, 0.25, 0.3)
      
      var playProcess = createjs.Sound.play(process2)
      playProcess.volume = 0.25
                
      TweenMax.to(el, .3, {
        x: w/2-170, //여기서 마리오 위치 변경
        y: h/2+50,
        alpha: 0,
        ease: Power4.easeOut,
        onComplete: function(){
                    
          scaleIt(circleCtr, 0.8, 0.8, 0.6, Power4.easeOut)
          scaleAlpha(shadowCircleCtr, 0.8, 0.8, 0, 0.6, Power4.easeOut)
          scaleRipples(ripples, 0.8, 0.8, 0.6, .015, 0.05, Power4.easeOut)
          
          inin(el)
          
        
        }
      })

    }

    // else {      
    //   tlImage.resume()
    //   var playCollision = createjs.Sound.play(collision)
    //   playCollision.volume = 0.25
    //   scaleIt(el, 1, 1, 0.3)
    //   back(el, propsArray[index].oriX, propsArray[index].oriY)
        
    // }

  })

})
// end image array loop

// if hit do this and that
function doHit(intersection){
  if(intersection){
        
    var playCollision2 = createjs.Sound.play(collision2)
    playCollision2.volume = 0.25
        
    scaleIt(circleCtr, 1.5, 1.5, 0.6, Power4.easeOut)
    
    scaleAlpha(shadowCircleCtr, 1.2, 1.2, 1, 0.2, Power4.easeOut)
    
    scaleRipples(ripples, 1.4, 1.4, 0.6, .015, 0.05, Power4.easeOut)
    
    TweenMax.to(dropZone, .3, {
      opacity: 0,
      scale: 0.5
    })
  
    bolehjalan = true
    
  }
  
}

// define wheter choice is right or no
function inin(el){
  
 
  if(el.key == true) {
        
    var tl = new TimelineMax({})
    
    // succeed ripple
    tl.to([circleCtr, shadowCircleCtr], 0.3, {
      delay: .6,
      scaleX: 1.2,
      scaleY: 1.2,
      ease: Elastic.easeOut.config(1, .75)
    }).staggerTo(ripples, 0.3, {
      scaleX: 1.2,
      scaleY: 1.2,
      ease: Power4.easeOut
    }, 0.05, 0.5).to(imagesArray[0], 0.6, {
      scaleX: 0.7,
      scaleY: 0.7,
      alpha: 1,
      ease: Elastic.easeOut.config(1, .75)
    }, 0.6)

    
    setTimeout(function(){
      var playWin = createjs.Sound.play(win)
      playWin.volume = 0.25
    }, 600)    
    
    
  }
}


//시작
$('.terr-wrap.start').on('click', function(){
  $(this).removeClass('start').addClass('selected');
  $('.terr-wrap.start').fadeOut();
  $('.terrarium-container').addClass('shrink');
  $('.plant-drawer').addClass('open');
  
  $(this).droppable({
    drop: function(e, ui) {
      if ($(ui.helper).clone().hasClass('original')) {
        $(this).append($(ui.helper).clone());
        $(this).find('.succulent').removeClass('original');
        $(this).find('.succulent').draggable();
        console.log ($(ui.helper));
        window.location.href='a/index.html?veggie='+ $(ui.helper).attr('data-type');

      }
    }
  });
});

$('.original').draggable({
  appendTo: ".terr-wrap.selected",
  helper: 'clone'
});



 
// calculate correct scale value
function getScale() {
  // get the transform matrix of the clicked succulent
  var div = $('.edit').css('transform');

  // turn the matrix string into an array of values
  var values = div.split('(')[1];
  values = values.split(')')[0];
  values = values.split(',');
  
  // return the transform scale values we need from the matrix array
  var a = values[0];
  var b = values[1];

  // this is how to get the correct scale value out of the css matrix
  return Math.sqrt(a*a + b*b);
}

$('.new').on('click', function(){
  location.href='a/index.html';
  // $('.terr-wrap.selected .succulent').remove();
  // $('.terr-wrap.selected').removeClass('selected').addClass('start');
  // $('.terr-wrap.start').fadeIn();
  // $('.terrarium-container').removeClass('shrink');
  // $('.plant-drawer').removeClass('open');
});