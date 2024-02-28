console.log('Its');

let currectsong = new Audio();
let songs;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs() {

    let a = await fetch("http://127.0.0.1:3000/song/")
    let response = await a.text();

    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")

    let songs = []

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/song/")[1])
        }
    }
    return songs
}


const playMusic = (track, pause = false) => {
    currectsong.src = /song/ + track
    if (!pause) {
        currectsong.play()
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main() {

    // Get All The Songs 
    songs = await getsongs()
    playMusic(songs[0], true)

    // Show all songs in the playlist
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li>
                            <img class="invert" src="music.svg" alt="">
                            <div class="info">
                            <div >${song.replaceAll("%20", " ")} </div>    
                            <div >Tushar</div>    
                            </div>
                            <div class="playnow">
                            <span> Play now</span>
                            <img class="invert" src="play.svg" alt="">
                        </div>
        </li>`;
    }

    // attach an eventlistener to aeach song

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        });


    });

    // Attach  an event listenter to play , next and previous
    play.addEventListener("click", () => {
        if (currectsong.paused) {
            currectsong.play()
            play.src = "pause.svg"
        }
        else {
            currectsong.pause()
            play.src = "play.svg"
        }
    })
    // Listen to timeupdate event

    currectsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currectsong.currentTime)}/${secondsToMinutesSeconds(currectsong.duration)}`
        document.querySelector(".circle").style.left = (currectsong.currentTime / currectsong.duration) * 100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currectsong.currentTime = (currectsong.duration) * percent / 100
    })

    document.querySelector(".menu").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0
    })
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })
    document.querySelector("#previous").addEventListener("click", () => {
        console.log("previous clicked");

        let index = songs.indexOf(currectsong.src.split("/").slice(-1)[0])
        if (index-1 >= 0) {
            playMusic(songs[index-1])
        }
    })
    document.querySelector("#next").addEventListener("click", () => {
        console.log("next clicked");

        let index = songs.indexOf(currectsong.src.split("/").slice(-1)[0])
        if ((index+1) < songs.length - 1) {
            playMusic(songs[index+1])
        }
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change" , (e)=>{
        console.log("Settings volume to", e.target.value , "/100");
        currectsong.volume = parseInt(e.target.value)/100   
    })

}

main()


