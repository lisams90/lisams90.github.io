$(document).ready(function() {
  var songs = ['https://soundcloud.com/bangtan/161204jinawake'];

  playsong(songs[0], false); // false = don't autoPlay, true = autoPlay
  albuminfo(songs[0], 'thumbnail', true, true);

  for (i = 1; i < songs.length; i++) {
      
    (function(i) {
        playsong(songs[i], true);

        // external link
        $("#link").attr("href", songs[i]);
      });        
  }

  var player = SC.Widget("so");

  // Set the song link as the external link
  $("#link").attr("href", songs[0]);

  // Play button pressed
  $("#play").click(function() {
    player.play();
    toggleButtons('play');
  });

  // Pause button pressed
  $("#pause").click(function() {
    player.pause();
    toggleButtons('pause');
  });

  // New SoundCloud URL requested via prompt()
  $("#newSong").click(function() {
    var url = prompt("Enter in a new SoundCloud URL:");
    var matchh = url.match(/^https:\/\/soundcloud\.com\/[a-z1-9-]*\/[a-z1-9-]*\/?$/);
    if(url !== null && matchh !== null){
      playsong(url, true);
      albuminfo(url, 'thumbnail', true, true);
      $("#link").attr("href", url);
    }else{
      alert("Enter in a valid soundcloud link.")
    }
  });
})


function playsong(song, autoPlay){
  var uri = encodeURIComponent(song);
  var scUrl ='https://w.soundcloud.com/player/?url='+uri;
  // Set iFrame source
  $("#so").prop('src', scUrl);
  // Play song after 1 sec delay
  $("#so").on("load", function () {
      setTimeout(function(){
        if(autoPlay === true){
          var player = SC.Widget("so");
          player.play();
          toggleButtons('play');
        }
      }, 1000);
  });
}


function albuminfo(song, thumbId, setTitle, setArtist){
  var uri = encodeURIComponent(song);
  var scUrl = 'https://soundcloud.com/oembed.json?maxheight=200&url='+uri;
  $.get(scUrl, function(data){
    var thumb_https = data.thumbnail_url.replace(/^http:\/\//i, 'https://');
    var title_only = data.title.split("by");
    $("#" + thumbId).prop("src", thumb_https);
    if (setTitle) {
      $("#song_title").html('<i class="fa fa-music" aria-hidden="true"></i> ' + title_only[0]);
    }
    
    if (setArtist) {
      $("#song_artist").html('<i class="fa fa-user" aria-hidden="true"></i> ' + data.author_name);
    }
  })
}


 //button chage-based on the state of the song
function toggleButtons(status) {
  if (status === 'play') {
    $("#play").hide();
    $("#pause").show();
  } else {
    $("#play").show();
    $("#pause").hide();
  }
}