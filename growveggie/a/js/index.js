//여기서 채소 4개 만들고 html에서도 3개 더 만들고 css로 위치 조정하기
if(location.href.indexOf("veggie=pu")>0){
	$('#veggies').attr('src', 'https://lisams90.github.io/song/pumpkin.png');
}
if(location.href.indexOf("veggie=av")>0){
	$('#veggies').attr('src', 'https://lisams90.github.io/song/avo.png');
}
if(location.href.indexOf("veggie=be")>0){
	$('#veggies').attr('src', 'https://lisams90.github.io/song/beans.png');
}
if(location.href.indexOf("veggie=as")>0){
	$('#veggies').attr('src', 'https://lisams90.github.io/song/asasp.png');
}



$(function () {
	var rotationSnap = 80;
	var wtwtHeight = document.querySelectorAll('.wtwt');
	var knob = document.getElementById('knob');
	var temp = document.getElementById('temp');
	var wtwt2 = document.querySelector('.two');
	var wtwt4 = document.querySelector('.four');
	var maxRotation = 180;
	Draggable.create("#knob", {
		type:"rotation",
		bounds:{minRotation: -90, maxRotation: 90},
		onDrag:dragUpdate,
		throwProps:true,
		onThrowUpdate:dragUpdate,
	});

	Draggable.create("#knob2", {
		type:"rotation",
		bounds:{minRotation: 0, maxRotation: 80	},
		onDrag:funcUpdate,
		throwProps:true,
		onThrowUpdate:funcUpdate,
		liveSnap: true,
		snap:function(endValue) {
	
			return Math.round(endValue / rotationSnap) * rotationSnap;
		}
	});

	function funcUpdate(){
		var val = (knob2._gsTransform.rotation/maxRotation);
		var percent = val * 100;
		if(percent == 0){
			wtwt2.style.display = 'block';
			wtwt4.style.display = 'block';
		} 
		if(percent > 0) {
			wtwt2.style.display = 'none';
			wtwt4.style.display = 'none';
		}
	}

// function setup(){
//   		createCanvas(windowWidth, windowHeight);
//   		sample_video = createVideo(['assets/video.mov']);
//   		sample_video.hide();
// 		}

// function draw(){
//  		image(sample_video, 0, 0)
// 		}

function dragUpdate(){
	var val = (knob._gsTransform.rotation/maxRotation);
	var percent = val * 100;
	if(percent > 0){
		percent = percent + 50;
	}
	percent = (percent > 100) ? 100 : percent;
	if(percent < 0){
		percent = Math.abs(-50 + Math.abs(percent));
	}
	// percent = (percent < 0) ? 0 : percent;

	TweenLite.set(wtwtHeight, {height:"auto"})
	TweenLite.to(wtwtHeight, 0.2, {height:Math.floor(percent), width: Math.floor(percent) })
	temp.innerHTML = Math.floor(percent);
	if(temp.innerHTML == 80){
		alert("Your veggie is ready to sprout! Move on to the next step");
		
	}
}

});