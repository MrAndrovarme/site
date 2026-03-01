const video = document.getElementById("bgVideo");
const musicBtn = document.getElementById("musicBtn");

// Enable video sound on first hover or click
function enableVideoSound(){
    if(video.muted){
        video.muted = false;
        video.play();
        musicBtn.style.display = "none"; // hide button after activating
    }
}

// Click music button
musicBtn.addEventListener("click", enableVideoSound);

// Hover on video (desktop)
video.addEventListener("mouseenter", enableVideoSound);