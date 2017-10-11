
var square = null;

function init(){

	square=document.getElementById('square');
	square.style.left='0px';
	square.style.position='relative';

	square1=document.getElementById('square1');
	square1.style.position='relative';
	square1.style.top='80px';
}

function moveRight(){
	square.style.left = parseInt(square.style.left) + 10 + 'px';
}

function moveDown(){
	square1.style.top = parseInt(square1.style.top) + 10 + 'px';
}


window.onload = init;

