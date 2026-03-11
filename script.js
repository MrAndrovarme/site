/* ENTRY SCREEN & MUSIC START */
const entry = document.getElementById('entry-screen');
const music = document.getElementById('music');
const profile = document.querySelector('.profile-card');
const audioToggle = document.getElementById('audio-toggle');

entry.addEventListener('click', ()=>{
    entry.style.opacity = 0;
    setTimeout(()=>{ entry.style.display='none'; },1000);

    profile.style.opacity = 1;
    audioToggle.style.display = 'block';

    // Start music immediately
    music.volume = 0;
    music.play();
    let vol = 0;
    const fadeIn = setInterval(()=>{
        vol += 0.05;
        if(vol >= 1){ vol = 1; clearInterval(fadeIn); }
        music.volume = vol;
    },50);
});

/* AUDIO TOGGLE */
let audioPlaying = true;
audioToggle.textContent = "🔊";
audioToggle.onclick = ()=>{
    if(audioPlaying){ 
        music.pause();
        audioPlaying=false; 
        audioToggle.textContent="🔇";
    } else { 
        music.play();
        audioPlaying=true; 
        audioToggle.textContent="🔊";
    }
};

/* LIGHTWEIGHT CURSOR */
const cursor = document.createElement('div');
cursor.classList.add('cursor');
document.body.appendChild(cursor);

document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

/* PARTICLES */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
for(let i=0;i<120;i++){
    particles.push({
        x:Math.random()*canvas.width,
        y:Math.random()*canvas.height,
        size:Math.random()*2+1,
        speed:Math.random()*0.6,
        color:`hsl(${Math.random()*360}, 80%, 60%)`
    });
}

function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p=>{
        p.y += p.speed;
        if(p.y>canvas.height){ p.y=0; p.x=Math.random()*canvas.width; }
        ctx.fillStyle=p.color;
        ctx.fillRect(p.x,p.y,p.size,p.size);
    });
    requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});